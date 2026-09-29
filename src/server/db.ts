import { PrismaClient } from "@prisma/client";
import { env } from "@/env";

const noOp: Record<string, (...args: unknown[]) => Promise<unknown>> = {
  findMany: async () => [],
  findFirst: async () => null,
  findUnique: async () => null,
  create: async (d: unknown) => ({ id: "mock-id", ...((d as { data?: object })?.data ?? {}) }),
  update: async (d: unknown) => ({ id: "mock-id", ...((d as { data?: object })?.data ?? {}) }),
  delete: async () => ({}),
  deleteMany: async () => ({ count: 0 }),
  count: async () => 0,
};

const createMockProxy = () => {
  return new Proxy({}, {
    get: (_target, _modelProp) => {
      return new Proxy({}, {
        get: (_mTarget, methodProp) => {
          if (typeof methodProp === "string" && methodProp in noOp) {
            return noOp[methodProp];
          }
          return async () => null;
        },
      });
    },
  });
};

const createSafePrismaClient = () => {
  let client: PrismaClient;
  try {
    client = new PrismaClient({
      log:
        env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  } catch {
    console.warn("[AI Studio] Database not connected — using mock");
    return createMockProxy() as unknown as PrismaClient;
  }

  return new Proxy(client, {
    get(target, prop, receiver) {
      const orig = Reflect.get(target, prop, receiver) as unknown;
      if (
        typeof prop === "symbol" ||
        prop === "$connect" ||
        prop === "$disconnect" ||
        prop === "$on" ||
        prop === "$transaction"
      ) {
        return orig;
      }
      if (typeof orig === "object" && orig !== null) {
        return new Proxy(orig, {
          get(mTarget, mProp) {
            const mMethod = Reflect.get(mTarget, mProp) as unknown;
            if (typeof mMethod === "function") {
              return async (...args: unknown[]) => {
                try {
                  return await (mMethod as (...a: unknown[]) => Promise<unknown>).apply(mTarget, args);
                } catch (err: unknown) {
                  console.warn(
                    `[AI Studio] DB offline/error on ${String(prop)}.${String(mProp)}:`,
                    (err as Error)?.message ?? err,
                  );
                  if (mProp === "findMany") return [];
                  if (mProp === "findUnique" || mProp === "findFirst") return null;
                  if (mProp === "create" || mProp === "update") {
                    return { id: "mock-id", ...((args[0] as { data?: object })?.data ?? {}) };
                  }
                  if (mProp === "count") return 0;
                  return null;
                }
              };
            }
            return mMethod;
          },
        });
      }
      return orig;
    },
  });
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? (createSafePrismaClient() as unknown as PrismaClient);

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
