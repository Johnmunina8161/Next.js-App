import { CustomerField } from '@/app/lib/definitions';
import Form from '@/app/ui/invoices/create-form';

// Example async function to fetch customers
async function fetchCustomers(): Promise<CustomerField[]> {
  // Replace with real DB call
  return [
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
    { id: '3', name: 'Charlie' },
  ];
}

export default async function InvoicePage() {
  const customers = await fetchCustomers();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="mb-6 text-2xl font-semibold">Create New Invoice</h1>
      <Form customers={customers} />
    </div>
  );
}
