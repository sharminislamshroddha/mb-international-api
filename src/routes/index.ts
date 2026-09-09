import { FastifyInstance } from "fastify";

import categoryRoutes from "../modules/category/category.routes";
import brandRoutes from "../modules/brand/brand.routes";
import productRoutes from "../modules/product/product.routes";
import productImageRoutes from "../modules/product-image/product-image.routes";
import authRoutes from "../modules/auth/auth.routes";
import reviewRoutes, { reviewSelfRoutes } from "../modules/review/review.routes";

export default async function routes(
    app: FastifyInstance
) {
    app.register(authRoutes, {
        prefix: "/api/v1/auth",
    });

    app.register(categoryRoutes, {
        prefix: "/api/v1/categories",
    });

    app.register(brandRoutes, {
        prefix: "/api/v1/brands",
    });

    app.register(productRoutes, {
        prefix: "/api/v1/products",
    });

    app.register(productImageRoutes, {
        prefix: "/api/v1/products",
    });

    app.register(reviewRoutes, {
        prefix: "/api/v1/products",
    });

    app.register(reviewSelfRoutes, {
        prefix: "/api/v1/reviews",
    });

}
