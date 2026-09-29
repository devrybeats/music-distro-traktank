import { db } from "@/server/db";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export const generateEmailVerificationToken = async (email: string) => {
  const token = crypto.randomBytes(20).toString("hex");
  const expiresAfter = new Date();
  expiresAfter.setMinutes(expiresAfter.getMinutes() + 30);
  await db.user.update({
    where: {
      email,
    },
    data: {
      emailVerificationToken: token,
      emailVerificationTokenExpiration: expiresAfter,
    },
  });
  return token;
};

export const generatePasswordResetToken = async (id: string) => {
  const token = crypto.randomBytes(20).toString("hex");
  const hashedResetToken = await bcrypt.hash(token, 10);
  const expiresAfter = new Date();
  expiresAfter.setMinutes(expiresAfter.getMinutes() + 15);

  await db.passwordResetToken.create({
    data: {
      userId: id,
      token: hashedResetToken,
      expires: expiresAfter,
    },
  });

  return token;
};
