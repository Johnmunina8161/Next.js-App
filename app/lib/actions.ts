'use server';

import { FormSchema } from "./definitions";
import postgres from "postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ⬅️ Correct login import
import { signIn } from "@/auth";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// --- INVOICE ACTIONS ---

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = FormSchema.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = FormSchema.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  const amountInCents = amount * 100;

  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath("/dashboard/invoices");
}

// --- AUTHENTICATION ACTION ---

function formDataToObject(formData: FormData) {
  const obj: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (typeof value === "string") obj[key] = value;
  });
  return obj;
}

export async function authenticate(formData: FormData, redirectTo?: string) {
  const data = formDataToObject(formData);
  const callbackUrl = redirectTo || data.redirectTo || "/dashboard";

  // ⬅️ Correct server-side signIn call
  const result = await signIn("credentials", {
    redirect: false,
    ...data,
  });

  if (result?.error) {
    throw new Error(result.error);
  }

  return { ...result, callbackUrl };
}
