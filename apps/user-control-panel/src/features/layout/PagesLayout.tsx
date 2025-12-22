import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "../../shared/components/sideBar/Sidebar";
import { Header } from "../../shared/components/Header";
import { Footer } from "../../shared/components/Footer";
import { useAuth } from "../../app/contexts/AuthContext";

interface PagesLayoutProps {
    children: ReactNode;
}

const AUTH_PAGES = ['/sign-in', '/sign-up', '/restore-password-1', '/restore-password-2', '/restore-password-3'];

const PagesLayout = ({ children }: PagesLayoutProps) => {
    const location = useLocation();
    const { isAuthenticated } = useAuth();

    if (AUTH_PAGES.includes(location.pathname)) {
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <div className="flex flex-1">
                {isAuthenticated && <Sidebar />}

                <div className="flex-1 flex flex-col min-w-0">
                    <Header />

                    <main className="flex-1">
                        {children}
                    </main>

                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default PagesLayout;