// Server-only module. Do not import in client components.
import { getSession } from './session';

export async function requireSession(): Promise<void> {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
}
