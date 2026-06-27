/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    user:
      | (import('better-auth').User & {
          role?: 'admin' | 'user' | string;
          fullname?: string;
          username?: string;
          banned?: boolean | null;
        })
      | null;
    session: import('better-auth').Session | null;
  }
}
