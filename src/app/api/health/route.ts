export const runtime = 'edge';

export async function GET(): Promise<Response> {
  return new Response('ok');
}
