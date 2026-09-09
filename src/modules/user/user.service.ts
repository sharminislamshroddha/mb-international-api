import bcrypt from "bcrypt";

import prisma from "../../database/prisma";

import { AppError } from "../../shared/errors/AppError";
import { sanitizeUser } from "../../shared/helpers/sanitize-user";
import { getPagination } from "../../shared/pagination/pagination";

import {
  CreateAdminInput,
  UpdateUserRoleInput,
  UpdateUserStatusInput,
  UserQueryInput,
} from "./user.schema";

const SALT_ROUNDS = 10;

class UserService {
  async getAll(query: UserQueryInput) {
    const { page, limit, search, role, isActive, sortBy, sortOrder } =
      query;

    const { skip, take } = getPagination(page, limit);

    const where = {
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: "insensitive" as const } },
          { lastName: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }),

      ...(role && { role }),

      ...(isActive !== undefined && { isActive }),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),

      prisma.user.count({ where }),
    ]);

    return {
      data: users.map(sanitizeUser),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new AppError(404, "User not found.");
    }

    return sanitizeUser(user);
  }

  async createAdmin(data: CreateAdminInput) {
    const existing = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existing) {
      throw new AppError(409, "Email is already registered.");
    }

    const hashedPassword = await bcrypt.hash(
      data.password,
      SALT_ROUNDS
    );

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role,
      },
    });

    return sanitizeUser(user);
  }

  async updateRole(
    id: string,
    actingUserId: string,
    data: UpdateUserRoleInput
  ) {
    if (id === actingUserId) {
      throw new AppError(
        400,
        "You cannot change your own role."
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new AppError(404, "User not found.");
    }

    const updated = await prisma.user.update({
      where: {
        id,
      },
      data: {
        role: data.role,
      },
    });

    return sanitizeUser(updated);
  }

  async updateStatus(
    id: string,
    actingUserId: string,
    data: UpdateUserStatusInput
  ) {
    if (id === actingUserId) {
      throw new AppError(
        400,
        "You cannot deactivate your own account."
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new AppError(404, "User not found.");
    }

    const updated = await prisma.user.update({
      where: {
        id,
      },
      data: {
        isActive: data.isActive,
      },
    });

    return sanitizeUser(updated);
  }
}

export const userService = new UserService();
