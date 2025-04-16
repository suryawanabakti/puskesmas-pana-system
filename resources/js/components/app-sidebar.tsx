// resources/js/layouts/app-sidebar.tsx
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, CalendarClock, FileText, LayoutGrid, Users } from 'lucide-react';

const getMainNavItems = (isAdmin: boolean): NavItem[] => {
    if (isAdmin) {
        return [
            {
                title: 'Dashboard',
                href: route('admin.dashboard'),
                icon: LayoutGrid,
            },
            {
                title: 'Patients',
                href: route('admin.patients.index'),
                icon: Users,
            },
            {
                title: 'Queue Management',
                href: route('admin.queue.manage'),
                icon: CalendarClock,
            },
            {
                title: 'Complaints',
                href: route('admin.complaints.index'),
                icon: FileText,
            },
        ];
    } else {
        return [
            {
                title: 'Dashboard',
                href: route('dashboard'),
                icon: LayoutGrid,
            },
            {
                title: 'Queue',
                href: route('queue.view'),
                icon: CalendarClock,
            },
            {
                title: 'Complaints',
                href: route('complaints.index'),
                icon: FileText,
            },
        ];
    }
};

const footerNavItems: NavItem[] = [
    {
        title: 'Documentation',
        href: 'https://puskesmas-pana.com/docs',
        icon: BookOpen,
        external: true,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const isAdmin = auth.user.role === 'admin';
    const mainNavItems = getMainNavItems(isAdmin);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="font-bold">
                            <Link href={isAdmin ? route('admin.dashboard') : route('dashboard')} prefetch>
                                <img src="/loho.png" className="h-6 w-6" /> Puskesmas Pana
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
