import { FastifyReply, FastifyRequest } from "fastify";

import { successResponse } from "../../shared/helpers/response";

import { dashboardService } from "./dashboard.service";

class DashboardController {
  async getStats(
    _request: FastifyRequest,
    reply: FastifyReply
  ) {
    const stats = await dashboardService.getStats();

    return successResponse({
      reply,
      message: "Dashboard stats fetched successfully.",
      data: stats,
    });
  }
}

export const dashboardController = new DashboardController();
