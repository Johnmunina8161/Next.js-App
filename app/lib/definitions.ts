//'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// --- Revenue type for charts ---
export type Revenue = {
  month: string;
  revenue: number;
};

// --- InvoiceForm type ---
export type InvoiceForm = z.infer<typeof FormSchema>;

// Postgres connection
export const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// --- Types for forms ---
export type CustomerField = {
  id: string;
  name: string;
};

export const FormSchema = z.object({
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
});

// --- Server Actions ---
export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = FormSchema.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = FormSchema.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}

// --- User authentication ---
export type User = {
  id: string;
  name: string;
  email: string;
  password: string; // hashed
};
