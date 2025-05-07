import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FormActionsProps {
  onCancel?: () => void;
  isSubmitting?: boolean;
  className?: string;
  submitLabel?: string;
}

export function FormActions({
  onCancel,
  isSubmitting,
  className,
  submitLabel = 'Save',
}: FormActionsProps) {
  return (
    <div className={cn('flex items-center justify-end space-x-4', className)}>
      {onCancel && (
        <Button
          type='button'
          variant='outline'
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      )}
      <Button type='submit' disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : submitLabel}
      </Button>
    </div>
  );
}
