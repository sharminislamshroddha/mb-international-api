import prisma from "../../database/prisma";

import { AppError } from "../../shared/errors/AppError";

import {
    CreateProductImageInput,
    UpdateProductImageInput,
} from "./product-image.schema";

class ProductImageService {
    async create(productId: string, data: CreateProductImageInput) {
        // Check product exists
        const product = await prisma.product.findUnique({
            where: {
                id: productId,
            },
        });

        if (!product) {
            throw new AppError(404, "Product not found.");
        }

        // Only one primary image per product
        if (data.isPrimary) {
            await prisma.productImage.updateMany({
                where: {
                    productId,
                    isPrimary: true,
                },
                data: {
                    isPrimary: false,
                },
            });
        }

        return prisma.productImage.create({
            data: {
                ...data,
                productId,
            },
        });
    }

    async getByProduct(productId: string) {
        return prisma.productImage.findMany({
            where: {
                productId,
            },
            orderBy: {
                sortOrder: "asc",
            },
        });
    }

    async getById(id: string) {
        const image = await prisma.productImage.findUnique({
            where: {
                id,
            },
        });

        if (!image) {
            throw new AppError(404, "Product image not found.");
        }

        return image;
    }

    async update(
        id: string,
        payload: UpdateProductImageInput
    ) {
        const image = await prisma.productImage.findUnique({
            where: {
                id,
            },
        });

        if (!image) {
            throw new AppError(404, "Product image not found.");
        }

        // Only one primary image
        if (payload.isPrimary) {
            await prisma.productImage.updateMany({
                where: {
                    productId: image.productId,
                    isPrimary: true,
                },
                data: {
                    isPrimary: false,
                },
            });
        }

        return prisma.productImage.update({
            where: {
                id,
            },
            data: payload,
        });
    }

    async delete(id: string) {
        const image = await prisma.productImage.findUnique({
            where: {
                id,
            },
        });

        if (!image) {
            throw new AppError(404, "Product image not found.");
        }

        await prisma.productImage.delete({
            where: {
                id,
            },
        });
    }
}

export const productImageService = new ProductImageService();