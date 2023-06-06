import NextAuth, { DefaultSession } from "next-auth"
import { WithStrId } from "./app/mongo"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: Expand<WithStrId<Omit<IUserSchema, 'password'>>> | null
  }

  type MySession = {
    isAuthenticated: boolean,
    isLoading: boolean,
    user: Session['user'],
    expires: string | null,
  };
}