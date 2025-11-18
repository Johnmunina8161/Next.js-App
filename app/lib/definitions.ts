import { z } from "zod";

// Revenue table rows
export type Revenue = {
  month: string;
  revenue: number;
};

// Customer dropdown fields
export type CustomerField = {
  id: string;
  name: string;
};

// Invoice table rows
export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  amount: number;
  status: string;
  date: string;
};

// Latest invoice data
export type LatestInvoiceRaw = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  amount: number;
};

// Customer table
export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

// Invoice Form schema
export const FormSchema = z.object({
  id: z.string().optional(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(["pending", "paid"]),
});

export type InvoiceForm = z.infer<typeof FormSchema>;

// Auth User
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};
