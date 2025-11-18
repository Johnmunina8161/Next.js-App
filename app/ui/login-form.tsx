'use client';

import { lusitana } from '@/app/ui/fonts';
import { AtSymbolIcon, KeyIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useState } from 'react';
import { authenticate } from '@/app/lib/actions';
import type { FormEvent } from 'react';

export default function LoginForm() {
  const callbackUrl = '/dashboard'; // ✅ always redirect to dashboard

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsPending(true);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await authenticate(formData, callbackUrl);
      if (result.callbackUrl) {
        window.location.href = result.callbackUrl; // ✅ full redirect
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Please log in to continue.
        </h1>

        <div className="w-full">
          <div>
            <label htmlFor="email" className="mb-3 mt-5 block text-xs font-medium text-gray-900">
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                required
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <AtSymbolIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="password" className="mb-3 mt-5 block text-xs font-medium text-gray-900">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                required
                minLength={6}
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <KeyIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        <input type="hidden" name="redirectTo" value={callbackUrl} />

        <Button type="submit" className="mt-4 w-full" aria-disabled={isPending}>
          Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>

        {errorMessage && (
          <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">{errorMessage}</p>
          </div>
        )}
      </div>
    </form>
  );
}

