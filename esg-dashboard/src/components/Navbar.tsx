import { ThemeToggle } from "@/components/ThemeToggle";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Bell, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <div className="border-b bg-white dark:border-gray-800 dark:bg-gray-900">
            <div className="container mx-auto px-6">
                <NavigationMenu className="ml-auto">
                    <NavigationMenuList className="flex items-center gap-6 py-3">
                        <ThemeToggle />
                        <button className="hover:cursor-pointer hover:text-green-600">
                            <Bell className="h-5 w-5" />
                        </button>
                        <NavigationMenuItem>
                            <NavigationMenuLink>
                                <Link to="#" className="flex items-center gap-2 font-medium hover:text-green-600">
                                    <User className="h-5 w-5" />
                                    <span>John Doe</span>
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </div>
    );
}
