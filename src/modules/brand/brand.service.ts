import prisma from "../../database/prisma";

import { AppError } from "../../shared/errors/AppError";
import { generateSlug } from "../../shared/helpers/slug";

import { BrandQueryInput, CreateBrandInput, UpdateBrandInput,} from "./brand.schema";

class BrandService {
  async create(data: CreateBrandInput) {
    const slug = generateSlug(data.name);

    const exists = await prisma.brand.findUnique({
      where: {
        slug,
      },
    });

    if (exists) {
      throw new AppError(409, "Brand already exists.");
    }

    return prisma.brand.create({
      data: {
        ...data,
        slug,
      },
    });
  }

  async getAll(query: BrandQueryInput) {
    const { page, limit, search, sortBy, sortOrder, isActive,} = query;

    const where = {
      ...(search && {
        name: {
          contains: search,
          mode: "insensitive" as const,
        },
      }),

      ...(isActive !== undefined && {
        isActive,
      }),
    };

    const [brands, total] = await Promise.all([
      prisma.brand.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),

      prisma.brand.count({
        where,
      }),
    ]);

    return {
      data: brands,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string) {
    const brand = await prisma.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      throw new AppError(404, "Brand not found.");
    }

    return brand;
  }

  async update(id: string, payload: UpdateBrandInput) {
    const brand = await prisma.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      throw new AppError(404, "Brand not found.");
    }

    let slug = brand.slug;

    if (payload.name && payload.name !== brand.name) {
      slug = generateSlug(payload.name);

      const existingBrand = await prisma.brand.findUnique({
        where: { slug },
      });

      if (existingBrand && existingBrand.id !== id) {
        throw new AppError(409, "Brand name already exists.");
      }
    }

    return prisma.brand.update({
      where: { id },
      data: {
        ...payload,
        slug,
      },
    });
  }

  async delete(id: string) {
    const brand = await prisma.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      throw new AppError(404, "Brand not found.");
    }

    await prisma.brand.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  }
}

export const brandService = new BrandService();