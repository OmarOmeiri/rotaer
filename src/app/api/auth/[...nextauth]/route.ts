import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { toBoolean } from 'lullo-utils/Boolean';
import AuthService from '../Service';
import { MongoCollections } from '../../../../types/app/mongo';

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
        isGoogle: { label: '', type: 'text' },
      },
      async authorize(credentials) {
        const service = new AuthService();
        await service.withDb([MongoCollections.user]);

        if (toBoolean(credentials?.isGoogle)) {
          const user = await service.gAuth(credentials?.username);
          return user;
        }
        const user = await service.authenticate({
          username: credentials?.username,
          password: credentials?.password,
        });
        return user as any;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
