import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

interface PagesLayoutProps {
    children: ReactNode;
    isAuthenticated?: boolean;
}

const PagesLayout = ({ children, isAuthenticated = true }: PagesLayoutProps) => {
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