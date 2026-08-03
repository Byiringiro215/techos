import { ReactNode } from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode | {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      {icon && (
        <div className="flex justify-center text-gray-500 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
      {description && (
        <p className="text-gray-400 mb-6 max-w-sm mx-auto">{description}</p>
      )}
      {action && (
        <>
          {typeof action === 'object' && 'label' in action ? (
            <Button onClick={action.onClick}>
              {action.label}
            </Button>
          ) : (
            action
          )}
        </>
      )}
    </div>
  );
}
