import { FastifyReply, FastifyRequest } from "fastify";

import { successResponse } from "../../shared/helpers/response";

import {
    createProductImageSchema,
    updateProductImageSchema,
    productImageParamsSchema,
    productImageIdParamsSchema,
} from "./product-image.schema";

import { productImageService } from "./product-image.service";

class ProductImageController {
    async create(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const { productId } =
            productImageParamsSchema.parse(request.params);

        const payload =
            createProductImageSchema.parse(request.body);

        const image =
            await productImageService.create(
                productId,
                payload
            );

        return successResponse({
            reply,
            statusCode: 201,
            message: "Product image created successfully.",
            data: image,
        });
    }

    async getAll(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const { productId } =
            productImageParamsSchema.parse(request.params);

        const images =
            await productImageService.getByProduct(
                productId
            );

        return successResponse({
            reply,
            message: "Product images retrieved successfully.",
            data: images,
        });
    }

    async update(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const { imageId } =
            productImageIdParamsSchema.parse(request.params);

        const payload =
            updateProductImageSchema.parse(request.body);

        const image =
            await productImageService.update(
                imageId,
                payload
            );

        return successResponse({
            reply,
            message: "Product image updated successfully.",
            data: image,
        });
    }

    async delete(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const { imageId } =
            productImageIdParamsSchema.parse(request.params);

        await productImageService.delete(imageId);

        return successResponse({
            reply,
            message: "Product image deleted successfully.",
        });
    }
}

export const productImageController =
    new ProductImageController();