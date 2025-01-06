import { Home, BookOpen, Users, GraduationCap, BarChart, LogOutIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "../ui/sidebar";
import { useState } from "react";

const menuItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/classes', label: 'Classes', icon: BookOpen },
    { href: '/teachers', label: 'Teachers', icon: Users },
    { href: '/students', label: 'Students', icon: GraduationCap },
    { href: '/analytics', label: 'Analytics', icon: BarChart },
    { href: '/logout', label: 'Logout', icon: LogOutIcon },
];

export function AppSidebar() {
    const [activePath, setActivePath] = useState('/');
    const navigate = useNavigate();

    const isActive = (path: string) => activePath === path;

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                <div className="flex items-center gap-2 px-4 py-3 mb-10">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <GraduationCap className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-bold text-lg">EduTrack</span>
                    </div>
                    <SidebarGroupContent>
                        <SidebarMenu className="flex-1">
                        {menuItems.map((item) => (
                                <SidebarMenuItem key={item.label}>
                                    <SidebarMenuButton asChild>
                                        <a 
                                            href={item.href} 
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setActivePath(item.href);
                                                navigate(item.href);
                                            }}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                                isActive(item.href) 
                                                    ? 'bg-blue-100 text-blue-600' 
                                                    : 'hover:bg-gray-100'
                                            }`}
                                        >
                                            <item.icon className={`h-4 w-4 ${
                                                isActive(item.href) ? 'text-blue-600' : 'text-gray-600'
                                            }`} />
                                            <span>{item.label}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}