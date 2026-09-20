import { ReactNode } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import PagesLayout from '../../features/layout/PagesLayout';

interface AppProvidersProps {
    children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
    return (
        <AuthProvider>
                <PagesLayout>
                    {children}
                </PagesLayout>
        </AuthProvider>
    );
}
