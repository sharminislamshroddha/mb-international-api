import { User } from "@prisma/client";
import bcrypt from "bcrypt";

import prisma from "../../database/prisma";

import { AppError } from "../../shared/errors/AppError";

import { LoginInput, RegisterInput } from "./auth.schema";

const SALT_ROUNDS = 10;

function sanitizeUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

class AuthService {
  async register(data: RegisterInput) {
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
      },
    });

    return sanitizeUser(user);
  }

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user || !user.isActive) {
      throw new AppError(401, "Invalid email or password.");
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new AppError(401, "Invalid email or password.");
    }

    return sanitizeUser(user);
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
}

export const authService = new AuthService();
