import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { generatePasswordResetToken } from "@/server/services/token/generateToken";
import { passwordResetMail } from "@/server/services/mail/";
import bcrypt from "bcryptjs";

export const passwordRouter = createTRPCRouter({
  sendPasswordResetToken: publicProcedure
    .input(
      z.object({
        email: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { email } = input;
      const { db } = ctx;
      const existingUserByEmail = await db.user.findUnique({
        where: { email },
      });

      if (!existingUserByEmail) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User With Email Not Found",
        });
      }

      const token = await generatePasswordResetToken(existingUserByEmail.id);

      // Send email with token
      await passwordResetMail(email, token);
    }),
  resetPassword: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
        token: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { email, password, token } = input;
      const { db } = ctx;
      const existingUserByEmail = await db.user.findUnique({
        where: { email },
      });

      if (!existingUserByEmail) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User With Email Not Found",
        });
      }

      const isTokenValid = await db.passwordResetToken.findMany({
        where: {
          userId: existingUserByEmail.id,
          expires: {
            gte: new Date(),
          },
        },
        orderBy: {
          expires: "desc",
        },
        take: 1,
      });

      if (!isTokenValid) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Token not found or expired",
        });
      }

      const isTokenMatched = await bcrypt.compare(
        token,
        isTokenValid[0]!.token,
      );

      if (!isTokenMatched) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Token incorrect",
        });
      }

      const newPassword = await bcrypt.hash(password, 10);

      await db.user.update({
        where: {
          id: existingUserByEmail.id,
        },
        data: {
          password: newPassword,
        },
      });
    }),
});
