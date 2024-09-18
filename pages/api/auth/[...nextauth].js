import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import excuteQuery from "../../../lib/db";
import { verifyPassword } from "../../../lib/data-helper";

export default NextAuth({
  session: {
    strategy: "jwt"
  },
  providers: [
    CredentialsProvider({

      async authorize(credentials) {
        
        const username = credentials.username.trim();
        const password = credentials.password.trim();

        const result = await excuteQuery({
          query: 'SELECT * FROM users WHERE username = ?',
          values: [username]
        });

        if(result.length == 0) {
          throw new Error('No user found');
        }

        const isValid = await verifyPassword(password, result[0].password);     
        
        if(!isValid) {
          throw new Error('Invalid password');
        }

        return {
          ...result[0]
        }

      },
    
      
    })
  ],
  callbacks: {
    async jwt({ token, user }) {

      // console.log(user);
      // console.log(token);
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      // session.accessToken = token.accessToken
      // session.user.id = token.id
      session.user = {...session.user, ...token};

      return session;
    }
    
  },
  pages: {
    signIn: '/login'
  }
});