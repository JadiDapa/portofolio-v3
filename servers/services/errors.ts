import { Prisma } from "@/generated/prisma";

/** `.catch()` handler turning a unique-constraint failure into a readable message. */
export function uniqueViolation(label: string) {
  return (err: unknown): never => {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw new Error(`A ${label} with this title already exists`);
    }
    throw err;
  };
}
