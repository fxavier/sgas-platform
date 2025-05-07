'use client';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface EntityListProps {
  items: Array<{ id: string; [key: string]: any }>;
  renderItem: (item: any) => React.ReactNode;
  onRemove: (id: string) => void;
}

export function EntityList({ items, renderItem, onRemove }: EntityListProps) {
  if (items.length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic">
        No items added yet
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
          <div className="flex-1">{renderItem(item)}</div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(item.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}