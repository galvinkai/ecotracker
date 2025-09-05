import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import Navbar from "@/components/Navbar";
import { AppSidebar } from "@/components/SidebarNav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Outlet, useLocation } from "react-router-dom";

export default function Layout() {
    const location = useLocation();
    const isHomePage = location.pathname === "/";

    return (
        <SidebarProvider>
            <div className="flex w-full bg-gray-50 dark:bg-gray-900">
                <AppSidebar />
                <main className="flex min-h-screen flex-1 flex-col">
                    <Toaster />
                    <Navbar />
                    <div className="flex-1 p-4">
                        {!isHomePage && (
                            <div className="mb-4">
                                <BreadcrumbNav />
                            </div>
                        )}
                        <div className="flex-1">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}
