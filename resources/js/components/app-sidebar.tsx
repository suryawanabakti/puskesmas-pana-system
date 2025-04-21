// resources/js/layouts/app-sidebar.tsx
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, CalendarClock, FileText, LayoutGrid, Users } from 'lucide-react';

const getMainNavItems = (isRole: any): any => {
    if (isRole === 'admin') {
        return [
            {
                title: 'Dashboard',
                href: route('admin.dashboard'),
                icon: LayoutGrid,
            },
            {
                title: 'Data Pasien',
                href: route('admin.patients.index'),
                icon: Users,
            },
            {
                title: 'Manajemen Antrian',
                href: route('admin.queue.manage'),
                icon: CalendarClock,
            },
            {
                title: 'Keluhan',
                href: route('admin.complaints.index'),
                icon: FileText,
            },
            {
                title: 'Laporan Antrian',
                href: route('admin.reports.queue'),
                icon: FileText,
            },
            // {
            //     title: 'Laporan Keluhan',
            //     href: route('admin.reports.complaints'),
            //     icon: FileText,
            // },
        ];
    }
    if (isRole === 'patient') {
        return [
            {
                title: 'Dashboard',
                href: route('dashboard'),
                icon: LayoutGrid,
            },
            {
                title: 'Antrian',
                href: route('queue.view'),
                icon: CalendarClock,
            },
            {
                title: 'Keluhan',
                href: route('complaints.index'),
                icon: FileText,
            },
        ];
    }
    if (isRole === 'kepala') {
        return [
            {
                title: 'Laporan Antrian',
                href: route('admin.reports.queue'),
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
    const isRole = auth.user.role;
    const mainNavItems = getMainNavItems(isRole);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="font-bold">
                            <Link href={isRole === 'admin' ? route('admin.dashboard') : route('dashboard')} prefetch>
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
