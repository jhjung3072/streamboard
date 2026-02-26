import { setSession } from '@/server/auth/session';

export async function POST(request: Request): Promise<Response> {
  if (process.env.NODE_ENV === 'production') {
    return new Response('Not Found', { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const username = typeof body?.username === 'string' ? body.username : '';

  if (!username) {
    return new Response('Bad Request', { status: 400 });
  }

  const token = crypto.randomUUID();
  await setSession(token);

  return Response.json({ success: true });
}
