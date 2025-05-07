import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message:
      'Your Prisma Client has been regenerated. Please restart your Next.js server to apply the changes.',
    instructions: [
      "1. Stop your Next.js server (press Ctrl+C in the terminal where it's running)",
      "2. Run 'npm run dev' to restart the server",
      '3. Try submitting the form again',
    ],
  });
}
