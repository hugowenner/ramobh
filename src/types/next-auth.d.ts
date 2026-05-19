import type { DefaultSession } from "next-auth";
import type { UserRole } from "@/generated/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Required — always populated by jwt callback
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role?: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string; // Required — validated in jwt callback
    role?: UserRole;
  }
}
