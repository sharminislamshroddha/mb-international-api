import { AuthProvider, User } from "@prisma/client";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";

import { env } from "../../config/env";
import prisma from "../../database/prisma";

import { AppError } from "../../shared/errors/AppError";

import {
  FacebookAuthInput,
  GoogleAuthInput,
  LoginInput,
  RegisterInput,
} from "./auth.schema";

const SALT_ROUNDS = 10;

const googleClient = env.GOOGLE_CLIENT_ID
  ? new OAuth2Client(env.GOOGLE_CLIENT_ID)
  : null;

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

interface OAuthProfile {
  email: string;
  firstName: string;
  lastName: string;
  provider: AuthProvider;
  providerId: string;
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

    if (!user.password) {
      throw new AppError(
        401,
        `This account uses ${user.provider.toLowerCase()} sign-in. Please continue with that instead.`
      );
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

  async loginWithGoogle(data: GoogleAuthInput) {
    if (!env.GOOGLE_CLIENT_ID || !googleClient) {
      throw new AppError(500, "Google login is not configured.");
    }

    let payload;

    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: data.idToken,
        audience: env.GOOGLE_CLIENT_ID,
      });

      payload = ticket.getPayload();
    } catch {
      throw new AppError(401, "Invalid Google credential.");
    }

    if (!payload?.email || !payload.sub) {
      throw new AppError(
        401,
        "Google account did not provide an email."
      );
    }

    const user = await this.findOrCreateOAuthUser({
      email: payload.email,
      firstName: payload.given_name ?? payload.name ?? "Google",
      lastName: payload.family_name ?? "User",
      provider: AuthProvider.GOOGLE,
      providerId: payload.sub,
    });

    return sanitizeUser(user);
  }

  async loginWithFacebook(data: FacebookAuthInput) {
    if (!env.FACEBOOK_APP_ID || !env.FACEBOOK_APP_SECRET) {
      throw new AppError(500, "Facebook login is not configured.");
    }

    const debugResponse = await fetch(
      `https://graph.facebook.com/debug_token?input_token=${encodeURIComponent(data.accessToken)}&access_token=${encodeURIComponent(`${env.FACEBOOK_APP_ID}|${env.FACEBOOK_APP_SECRET}`)}`
    );

    const debugPayload = await debugResponse.json();

    if (
      !debugPayload?.data?.is_valid ||
      debugPayload.data.app_id !== env.FACEBOOK_APP_ID
    ) {
      throw new AppError(401, "Invalid Facebook credential.");
    }

    const profileResponse = await fetch(
      `https://graph.facebook.com/me?fields=id,email,first_name,last_name&access_token=${encodeURIComponent(data.accessToken)}`
    );

    const profile = await profileResponse.json();

    if (!profile?.email || !profile.id) {
      throw new AppError(
        401,
        "Facebook account did not provide an email."
      );
    }

    const user = await this.findOrCreateOAuthUser({
      email: profile.email,
      firstName: profile.first_name ?? "Facebook",
      lastName: profile.last_name ?? "User",
      provider: AuthProvider.FACEBOOK,
      providerId: profile.id,
    });

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

  private async findOrCreateOAuthUser(profile: OAuthProfile) {
    const existing = await prisma.user.findUnique({
      where: {
        email: profile.email,
      },
    });

    if (existing) {
      if (!existing.isActive) {
        throw new AppError(
          401,
          "This account has been deactivated."
        );
      }

      return existing;
    }

    return prisma.user.create({
      data: {
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        provider: profile.provider,
        providerId: profile.providerId,
      },
    });
  }
}

export const authService = new AuthService();
