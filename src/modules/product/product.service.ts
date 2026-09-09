import prisma from "../../database/prisma";

import { AppError } from "../../shared/errors/AppError";
import { generateSlug } from "../../shared/helpers/slug";
import { getPagination } from "../../shared/pagination/pagination";

import {
  CreateProductInput,
  ProductQueryInput,
  UpdateProductInput,
} from "./product.schema";

class ProductService {
  async create(data: CreateProductInput) {
    // Check category
    const category = await prisma.category.findUnique({
      where: {
        id: data.categoryId,
      },
    });

    if (!category) {
      throw new AppError(404, "Category not found.");
    }

    // Check brand (optional)
    if (data.brandId) {
      const brand = await prisma.brand.findUnique({
        where: {
          id: data.brandId,
        },
      });

      if (!brand) {
        throw new AppError(404, "Brand not found.");
      }
    }

    // Check SKU
    const skuExists = await prisma.product.findUnique({
      where: {
        sku: data.sku,
      },
    });

    if (skuExists) {
      throw new AppError(409, "SKU already exists.");
    }

    // Generate slug
    const slug = generateSlug(data.name);

    const slugExists = await prisma.product.findUnique({
      where: {
        slug,
      },
    });

    if (slugExists) {
      throw new AppError(409, "Product already exists.");
    }

    return prisma.product.create({
      data: {
        ...data,
        slug,
      },
      include: {
        category: true,
        brand: true,
      },
    });
  }

  async getAll(query: ProductQueryInput) {
    const {
      page,
      limit,
      search,
      categoryId,
      brandId,
      status,
      isFeatured,
      isActive,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
    } = query;

    const { skip, take } = getPagination(page, limit);

    const where = {
      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            sku: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            shortDescription: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        ],
      }),

      ...(categoryId && { categoryId }),

      ...(brandId && { brandId }),

      ...(status && { status }),

      ...(isFeatured !== undefined && {
        isFeatured,
      }),

      ...(isActive !== undefined && {
        isActive,
      }),

      ...((minPrice !== undefined || maxPrice !== undefined) && {
        price: {
          ...(minPrice !== undefined && { gte: minPrice }),
          ...(maxPrice !== undefined && { lte: maxPrice }),
        },
      }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          category: true,
          brand: true,
          images: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      }),

      prisma.product.count({
        where,
      }),
    ]);

    return {
      data: products,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string) {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
        brand: true,
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

    if (!product) {
      throw new AppError(404, "Product not found.");
    }

    return product;
  }

  async update(
    id: string,
    data: UpdateProductInput
  ) {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      throw new AppError(404, "Product not found.");
    }

    // Validate category
    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: {
          id: data.categoryId,
        },
      });

      if (!category) {
        throw new AppError(404, "Category not found.");
      }
    }

    // Validate brand
    if (data.brandId) {
      const brand = await prisma.brand.findUnique({
        where: {
          id: data.brandId,
        },
      });

      if (!brand) {
        throw new AppError(404, "Brand not found.");
      }
    }

    // SKU
    if (data.sku && data.sku !== product.sku) {
      const skuExists = await prisma.product.findUnique({
        where: {
          sku: data.sku,
        },
      });

      if (skuExists) {
        throw new AppError(409, "SKU already exists.");
      }
    }

    let slug = product.slug;

    if (data.name && data.name !== product.name) {
      slug = generateSlug(data.name);

      const exists = await prisma.product.findUnique({
        where: {
          slug,
        },
      });

      if (exists && exists.id !== id) {
        throw new AppError(409, "Product already exists.");
      }
    }

    return prisma.product.update({
      where: {
        id,
      },
      data: {
        ...data,
        slug,
      },
      include: {
        category: true,
        brand: true,
        images: true,
      },
    });
  }

  async delete(id: string) {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      throw new AppError(404, "Product not found.");
    }

    await prisma.product.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
  }
}

export const productService = new ProductService();