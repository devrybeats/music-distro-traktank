import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { verifyEMail } from "@/server/services/mail";
import { generateEmailVerificationToken } from "@/server/services/token/generateToken";

export const registerRouter = createTRPCRouter({
  registerUser: publicProcedure
    .input(
      z.object({
        email: z.string(),
        name: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { email, name, password } = input;
      const { db } = ctx;
      const existingUserByEmail = await db.user.findUnique({
        where: { email },
      });

      if (existingUserByEmail) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User with Email already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await db.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
        },
      });

      // Generate email verification token
      const token = await generateEmailVerificationToken(email);

      // Send verification email
      await verifyEMail(email, name, token);

      // Omit password from response
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...rest } = newUser;

      // Return user data
      return rest;
    }),
});
