/**
 * Server-side Auth utilities for validating sessions in Server Actions
 */

import type { Session } from "next-auth";
import { UnauthorizedError } from "@/core/errors";

/**
 * Validates that a session exists and has a valid user ID.
 * Used to guard Server Actions before Prisma operations.
 *
 * @throws {UnauthorizedError} if session is invalid or user.id is missing
 * @returns The validated user ID
 */
export function getValidatedUserId(session: Session | null): string {
  if (!session?.user?.id) {
    throw new UnauthorizedError("Sessão inválida ou expirada");
  }
  return session.user.id;
}

/**
 * Asserts session is authenticated for TypeScript type narrowing.
 * After calling this, TypeScript guarantees session.user.id exists.
 *
 * @throws {UnauthorizedError} if session is invalid
 */
export function assertAuthenticated(
  session: Session | null
): asserts session is Session & { user: { id: string } } {
  if (!session?.user?.id) {
    throw new UnauthorizedError("Sessão inválida ou expirada");
  }
}
