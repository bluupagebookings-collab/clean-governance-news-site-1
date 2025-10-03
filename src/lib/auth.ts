import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer } from "better-auth/plugins";
import { NextRequest } from 'next/server';
import { headers } from "next/headers"
import { db } from "@/db";
 
export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "sqlite",
	}),
	emailAndPassword: {    
		enabled: true
	},
	// Allow all origins in development, specific origins in production
	trustedOrigins: process.env.NODE_ENV === 'development' 
		? ["*"]  // Allow all origins in development
		: [
			process.env.NEXT_PUBLIC_APP_URL,
			"https://yourdomain.com"
		].filter(Boolean) as string[],
	plugins: [bearer()]
});

// Session validation helper
export async function getCurrentUser(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user || null;
}