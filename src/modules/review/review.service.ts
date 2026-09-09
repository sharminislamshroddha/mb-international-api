import prisma from "../../database/prisma";

import { AppError } from "../../shared/errors/AppError";
import { getPagination } from "../../shared/pagination/pagination";

import {
  CreateReviewInput,
  ReviewQueryInput,
  UpdateReviewInput,
} from "./review.schema";

const reviewUserSelect = {
  user: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  },
};

class ReviewService {
  async create(
    productId: string,
    userId: string,
    data: CreateReviewInput
  ) {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new AppError(404, "Product not found.");
    }

    const existing = await prisma.review.findUnique({
      where: {
        productId_userId: {
          productId,
          userId,
        },
      },
    });

    if (existing) {
      throw new AppError(
        409,
        "You have already reviewed this product."
      );
    }

    const review = await prisma.review.create({
      data: {
        ...data,
        productId,
        userId,
      },
      include: reviewUserSelect,
    });

    await this.syncProductRating(productId);

    return review;
  }

  async getByProduct(
    productId: string,
    query: ReviewQueryInput
  ) {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new AppError(404, "Product not found.");
    }

    const { page, limit, rating, sortBy, sortOrder } =
      query;

    const { skip, take } = getPagination(page, limit);

    const where = {
      productId,
      isPublished: true,
      ...(rating && { rating }),
    };

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: reviewUserSelect,
      }),

      prisma.review.count({
        where,
      }),
    ]);

    return {
      data: reviews,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAll(query: ReviewQueryInput) {
    const {
      page,
      limit,
      search,
      rating,
      productId,
      categoryId,
      isPublished,
      sortBy,
      sortOrder,
    } = query;

    const { skip, take } = getPagination(page, limit);

    const where = {
      ...(rating && { rating }),

      ...(productId && { productId }),

      ...(categoryId && { product: { categoryId } }),

      ...(isPublished !== undefined && { isPublished }),

      ...(search && {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            comment: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            product: {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          },
          {
            user: {
              firstName: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          },
          {
            user: {
              lastName: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          },
          {
            user: {
              email: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          },
        ],
      }),
    };

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          ...reviewUserSelect,
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),

      prisma.review.count({
        where,
      }),
    ]);

    return {
      data: reviews,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(
    id: string,
    userId: string,
    data: UpdateReviewInput,
    isAdmin = false
  ) {
    const review = await prisma.review.findUnique({
      where: {
        id,
      },
    });

    if (!review) {
      throw new AppError(404, "Review not found.");
    }

    if (review.userId !== userId && !isAdmin) {
      throw new AppError(
        403,
        "You can only update your own review."
      );
    }

    // A customer editing their own review sends it back for
    // re-moderation instead of leaving the previously-approved
    // content live under a since-edited comment.
    const updated = await prisma.review.update({
      where: {
        id,
      },
      data: isAdmin ? data : { ...data, isPublished: false },
      include: reviewUserSelect,
    });

    await this.syncProductRating(review.productId);

    return updated;
  }

  async setPublished(id: string, isPublished: boolean) {
    const review = await prisma.review.findUnique({
      where: {
        id,
      },
    });

    if (!review) {
      throw new AppError(404, "Review not found.");
    }

    const updated = await prisma.review.update({
      where: {
        id,
      },
      data: {
        isPublished,
      },
      include: reviewUserSelect,
    });

    await this.syncProductRating(review.productId);

    return updated;
  }

  async delete(
    id: string,
    userId: string,
    isAdmin: boolean
  ) {
    const review = await prisma.review.findUnique({
      where: {
        id,
      },
    });

    if (!review) {
      throw new AppError(404, "Review not found.");
    }

    if (review.userId !== userId && !isAdmin) {
      throw new AppError(
        403,
        "You can only delete your own review."
      );
    }

    await prisma.review.delete({
      where: {
        id,
      },
    });

    await this.syncProductRating(review.productId);
  }

  private async syncProductRating(productId: string) {
    const aggregate = await prisma.review.aggregate({
      where: {
        productId,
        isPublished: true,
      },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        averageRating: aggregate._avg.rating ?? 0,
        reviewCount: aggregate._count.rating,
      },
    });
  }
}

export const reviewService = new ReviewService();
