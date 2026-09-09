import { ProductStatus, Role } from "@prisma/client";

import prisma from "../../database/prisma";

class DashboardService {
  async getStats() {
    const [
      totalProducts,
      activeProducts,
      outOfStockProducts,
      totalCategories,
      totalBrands,
      totalReviews,
      totalCustomers,
      totalAdmins,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({
        where: { status: ProductStatus.ACTIVE },
      }),
      prisma.product.count({
        where: { status: ProductStatus.OUT_OF_STOCK },
      }),
      prisma.category.count(),
      prisma.brand.count(),
      prisma.review.count(),
      prisma.user.count({ where: { role: Role.CUSTOMER } }),
      prisma.user.count({
        where: { role: { in: [Role.ADMIN, Role.SUPER_ADMIN] } },
      }),
    ]);

    return {
      totalProducts,
      activeProducts,
      outOfStockProducts,
      totalCategories,
      totalBrands,
      totalReviews,
      totalCustomers,
      totalAdmins,
    };
  }
}

export const dashboardService = new DashboardService();
