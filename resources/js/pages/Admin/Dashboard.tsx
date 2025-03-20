// resources/js/Pages/Admin/Dashboard.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ArrowUpRight, BarChart, Clock, FileText, Users } from 'lucide-react';

interface DashboardStats {
    totalPatients: number;
    todayPatients: number;
    activeQueue: number;
    pendingComplaints: number;
    dailyStats: {
        date: string;
        count: number;
    }[];
}

interface AdminDashboardProps {
    stats: DashboardStats;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: route('admin.dashboard'),
    },
    {
        title: 'Dashboard',
        href: route('admin.dashboard'),
    },
];

export default function AdminDashboard({ stats }: AdminDashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="container mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                            Export Data
                        </Button>
                        <Button size="sm">Manage Queue</Button>
                    </div>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Total Patients</CardDescription>
                            <CardTitle className="text-3xl">{stats.totalPatients}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-muted-foreground flex items-center text-sm">
                                <Users className="mr-1 h-4 w-4" />
                                <span>Registered patients</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Today's Patients</CardDescription>
                            <CardTitle className="text-3xl">{stats.todayPatients}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-muted-foreground flex items-center text-sm">
                                <Clock className="mr-1 h-4 w-4" />
                                <span>Patients today</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Active Queue</CardDescription>
                            <CardTitle className="text-3xl">{stats.activeQueue}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-muted-foreground flex items-center text-sm">
                                <ArrowUpRight className="mr-1 h-4 w-4" />
                                <span>Currently waiting</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Pending Complaints</CardDescription>
                            <CardTitle className="text-3xl">{stats.pendingComplaints}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-muted-foreground flex items-center text-sm">
                                <FileText className="mr-1 h-4 w-4" />
                                <span>Unresolved complaints</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Patient Activity</CardTitle>
                            <CardDescription>Patient visits over the last 7 days</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex h-[300px] items-center justify-center">
                                <BarChart className="text-muted-foreground h-16 w-16" />
                                <span className="text-muted-foreground ml-2">Chart visualization would go here</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Common administrative tasks</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Button className="w-full justify-start" variant="outline" asChild>
                                    <a href={route('admin.patients.index')}>
                                        <Users className="mr-2 h-4 w-4" />
                                        Manage Patients
                                    </a>
                                </Button>
                                <Button className="w-full justify-start" variant="outline" asChild>
                                    <a href={route('admin.queue.manage')}>
                                        <Clock className="mr-2 h-4 w-4" />
                                        Manage Queue
                                    </a>
                                </Button>
                                <Button className="w-full justify-start" variant="outline" asChild>
                                    <a href={route('admin.complaints.index')}>
                                        <FileText className="mr-2 h-4 w-4" />
                                        View Complaints
                                    </a>
                                </Button>
                                <Button className="w-full justify-start" variant="outline" asChild>
                                    <a href={route('admin.reports')}>
                                        <BarChart className="mr-2 h-4 w-4" />
                                        Generate Reports
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
