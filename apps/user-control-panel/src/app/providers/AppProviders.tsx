import { ReactNode } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { RulesProvider } from '../contexts/RulesContext';
import PagesLayout from '../../features/layout/PagesLayout';

interface AppProvidersProps {
    children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
    return (
        <AuthProvider>
            <RulesProvider>
                <PagesLayout>
                    {children}
                </PagesLayout>
            </RulesProvider>
        </AuthProvider>
    );
}
