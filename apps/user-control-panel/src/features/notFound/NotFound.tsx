import { useNavigate } from 'react-router-dom';
import { Button } from '../../shared/ui/buttons/Button';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 font-inter-tight">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-7xl md:text-8xl font-semibold tracking-tight text-forest-200 dark:text-brand-300">404</h1>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-950 dark:text-white">
          Page Not Found
        </h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="pt-4 max-w-xs mx-auto">
          <Button
            text="Go to Dashboard"
            variant="primary"
            onClick={() => navigate('/dashboard')}
          />
        </div>
      </div>
    </div>
  );
}
