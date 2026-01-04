import { useNavigate } from 'react-router-dom';
import { Button } from '../../shared/ui/buttons/Button';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-6xl md:text-8xl font-bold text-primary">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-[var(--color-text-dark)]">
          Page Not Found
        </h2>
        <p className="text-body-md text-gray-700 dark:text-[var(--color-text-secondary-dark)]">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="pt-4">
          <Button
            text="Go to Dashboard"
            variant="primary"
            onClick={() => navigate('/dashboard')}
            className="max-w-xs mx-auto"
          />
        </div>
      </div>
    </div>
  );
}
