'use client';

import { useParams } from 'next/navigation';
import { Card } from '@/components/UI/Card';

export default function PrototypeDetailPage() {
  const params = useParams();
  const id = params.id;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Prototype Details</h1>
        <p className="text-gray-600 mt-2">
          Viewing details for ID: {id}
        </p>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">Details for Prototype #{id} will be displayed here</p>
      </Card>
    </div>
  );
}
