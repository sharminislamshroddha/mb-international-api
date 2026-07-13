import prisma from "../../database/prisma";

import { AppError } from "../../shared/errors/AppError";
import { generateSlug } from "../../shared/helpers/slug";

import { CategoryQueryInput, CreateCategoryInput, UpdateCategoryInput } from "./category.schema";

class CategoryService {
    async create(data: CreateCategoryInput) {
        const slug = generateSlug(data.name);

        const exists = await prisma.category.findUnique({
            where: {
                slug,
            },
        });

        if (exists) {
            throw new AppError(
                409,
                "Category already exists."
            );
        }

        return prisma.category.create({
            data: {
                ...data,
                slug,
            },
        });
    }

    async getAll(query: CategoryQueryInput) {
        const { page, limit, search, sortBy, sortOrder, isActive, } = query;

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

        const [categories, total] = await Promise.all([
            prisma.category.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    [sortBy]: sortOrder,
                },
            }),

            prisma.category.count({ where }),
        ]);

        return {
            data: categories,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit), },
        };
    }

    async getById(id: string) {
        const category = await prisma.category.findUnique({
            where: { id },
        });

        if (!category) {
            throw new AppError(404, "Category not found.");
        }

        return category;
    }

    async update(
        id: string,
        payload: UpdateCategoryInput
    ) {
        const category = await prisma.category.findUnique({
            where: { id },
        });

        if (!category) {
            throw new AppError(404, "Category not found.");
        }

        let slug = category.slug;

        if (payload.name && payload.name !== category.name) {
            slug = generateSlug(payload.name);

            const existingCategory = await prisma.category.findUnique({
                where: { slug },
            });

            if (existingCategory && existingCategory.id !== id) {
                throw new AppError(409, "Category name already exists.");
            }
        }

        return prisma.category.update({
            where: { id },
            data: {
                ...payload,
                slug,
            },
        });
    }

    async delete(id: string) {
        const category = await prisma.category.findUnique({
            where: { id },
        });

        if (!category) {
            throw new AppError(404, "Category not found.");
        }

        await prisma.category.update({
            where: { id },
            data: {
                isActive: false,
            },
        });
    }
};

export const categoryService = new CategoryService();