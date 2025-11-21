import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import postgres from 'postgres';

// Use DATABASE_URL from .env
const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' });

// Fetch a user by email
async function getUser(email: string): Promise<User | undefined> {
  const users = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
  return users[0];
}

// Create a new user in the database
async function createUser(email: string, password: string): Promise<User> {
  const hashedPassword = await bcrypt.hash(password, 10);
  const users = await sql<User[]>`
    INSERT INTO users (email, password, name) 
    VALUES (${email}, ${hashedPassword}, ${email}) 
    RETURNING *
  `;
  return users[0];
}

export const { auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        // Validate input
        const parsed = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsed.success) {
          console.log('Invalid input:', parsed.error.errors);
          return null;
        }

        const { email, password } = parsed.data;

        let user = await getUser(email);

        if (!user) {
          console.log('User not found, creating new user:', email);
          user = await createUser(email, password); // auto-create
        } else {
          const isValidPassword = await bcrypt.compare(password, user.password);
          if (!isValidPassword) {
            console.log('Password mismatch for user:', email);
            return null;
          }
        }

        return user;
      },
    }),
  ],
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET,
});
