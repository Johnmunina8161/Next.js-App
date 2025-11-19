import { Metadata } from 'next';
import { useRouter } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Edit Invoice',
};

export default function EditInvoicePage() {
  const router = useRouter();

  return (
    <div>
      <h1>Edit Invoice</h1>
      {/* Your edit form here */}
    </div>
  );
}
