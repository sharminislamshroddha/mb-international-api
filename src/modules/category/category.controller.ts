import { FastifyReply, FastifyRequest } from "fastify";

import { successResponse } from "../../shared/helpers/response";

import { categoryService } from "./category.service";
import { categoryIdSchema, categoryQuerySchema, createCategorySchema, updateCategorySchema } from "./category.schema";

class CategoryController {
    async create(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const body = createCategorySchema.parse(request.body);

        const category = await categoryService.create(body);

        return successResponse({
            reply,
            statusCode: 201,
            message: "Category created successfully.",
            data: category,
        });
    }

    async getAll(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const query =
            categoryQuerySchema.parse(request.query);

        const result =
            await categoryService.getAll(query);

        return reply.send({
            success: true,
            message: "Categories fetched successfully.",
            ...result,
        });
    }

    async getById(request: FastifyRequest, reply: FastifyReply) {
        const { id } = categoryIdSchema.parse(request.params);

        const category = await categoryService.getById(id);

        return successResponse({
            reply,
            message: "Category fetched successfully.",
            data: category,
        });
    }

    async update(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const { id } = categoryIdSchema.parse(request.params);

        const body = updateCategorySchema.parse(request.body);

        const category = await categoryService.update(id, body);

        return successResponse({
            reply,
            message: "Category updated successfully.",
            data: category,
        });
    }

    async delete(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const { id } = categoryIdSchema.parse(request.params);

        await categoryService.delete(id);

        return successResponse({
            reply,
            message: "Category deleted successfully.",
        });
    }
};

export const categoryController = new CategoryController();