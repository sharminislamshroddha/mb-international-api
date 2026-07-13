import { FastifyInstance } from "fastify";

import categoryRoutes from "../modules/category/category.routes";

export default async function routes(
    app: FastifyInstance
) {
    app.register(categoryRoutes, {
        prefix: "/api/v1/categories",
    });
}