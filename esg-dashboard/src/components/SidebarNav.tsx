import { ThemeToggle } from "@/components/ThemeToggle";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LayoutGrid } from "lucide-react";
import { Link } from "react-router-dom";

// Menu items with proper routes
const items = [
    {
        title: "Overview",
        url: "/",
        icon: LayoutGrid,
    },
    // {
    //   title: 'Reports',
    //   url: '/reports',
    //   icon: NotepadText,
    // },
    // {
    //   title: 'Settings',
    //   url: '#',
    //   icon: Settings,
    // },
];

export function AppSidebar() {
    return (
        <Sidebar className="border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="pt-6 pb-12 text-2xl font-bold text-green-700 dark:text-green-500">
                        ESG Verify Agent
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        className="hover:bg-green-50 hover:text-green-700 active:bg-green-100 dark:hover:bg-green-900/30 dark:hover:text-green-500 dark:active:bg-green-900/50"
                                    >
                                        <Link to={item.url}>
                                            <item.icon className="text-green-600 dark:text-green-500" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Theme toggle at the bottom of sidebar */}
                <SidebarGroup className="mt-auto">
                    <SidebarGroupContent className="border-t border-gray-200 px-3 py-4 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Toggle theme</span>
                            <ThemeToggle />
                        </div>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
