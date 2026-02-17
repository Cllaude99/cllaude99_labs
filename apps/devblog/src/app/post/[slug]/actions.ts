'use server';

import { verifyPostPassword } from '@/lib/posts';

export async function verifyPassword(
  password: string,
): Promise<{ success: boolean }> {
  const isValid = verifyPostPassword(password);
  return { success: isValid };
}
