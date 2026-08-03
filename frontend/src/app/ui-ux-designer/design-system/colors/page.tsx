'use client';

import { Card } from '@/components/UI/Card';

export default function ColorPalettePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Color Palette</h1>
        <p className="text-gray-600 mt-2">
          Color system and palette
        </p>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">Content for Color Palette will be displayed here</p>
      </Card>
    </div>
  );
}
