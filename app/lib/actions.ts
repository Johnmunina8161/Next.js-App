'use server';

import { signIn } from 'next-auth/react';

// Convert FormData to plain object
function formDataToObject(formData: FormData) {
  const obj: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (typeof value === 'string') obj[key] = value;
  });
  return obj;
}

// Login action
export async function authenticate(
  formData: FormData,
  redirectTo?: string // ✅ add second argument
) {
  const data = formDataToObject(formData);

  // Use redirectTo if provided, else fallback to formData value
  const callbackUrl = redirectTo || data.redirectTo || '/dashboard';

  const result = await signIn('credentials', {
    redirect: false,
    ...data,
  });

  if (!result?.ok) {
    throw new Error(result?.error || 'Login failed.');
  }

  return { ...result, callbackUrl };
}
