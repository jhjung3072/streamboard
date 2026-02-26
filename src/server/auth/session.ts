// Server-only module. Do not import in client components.
export interface Session {
  userId: string;
}

export async function getSession(): Promise<Session | null> {
  return null;
}
