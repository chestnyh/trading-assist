import { ReactNode } from "react";
import PagesLayout from "./PagesLayout";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const isAuthenticated = true;

    if (isAuthenticated) {
        return <PagesLayout>{children}</PagesLayout>;
    }

    return children;
};

export default ProtectedRoute;
