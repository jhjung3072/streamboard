import { clearSession } from '@/server/auth/session';

export async function POST(): Promise<Response> {
  if (process.env.NODE_ENV === 'production') {
    return new Response('Not Found', { status: 404 });
  }

  await clearSession();
  return Response.json({ success: true });
}
