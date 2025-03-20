// resources/js/Pages/Patient/Dashboard.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CalendarClock, FileText, Users } from 'lucide-react';

interface DashboardProps {
    queueCount: number;
    currentNumber: number | null;
    userNumber: number | null;
    estimatedTime: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
];

export default function Dashboard({ queueCount, currentNumber, userNumber, estimatedTime }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Patient Dashboard" />
            <div className="container mx-auto">
                <h1 className="mb-8 text-3xl font-bold">Patient Dashboard</h1>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center text-xl">
                                <CalendarClock className="mr-2 h-5 w-5" />
                                Current Queue Status
                            </CardTitle>
                            <CardDescription>Live queue information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Current Number:</span>
                                    <span className="text-2xl font-bold">{currentNumber || '-'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">People Waiting:</span>
                                    <span className="text-lg font-semibold">{queueCount}</span>
                                </div>
                                {userNumber && (
                                    <>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Your Number:</span>
                                            <span className="text-primary text-xl font-bold">{userNumber}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Estimated Wait:</span>
                                            <span className="text-lg font-semibold">{estimatedTime || 'Calculating...'}</span>
                                        </div>
                                    </>
                                )}
                                <Button className="mt-4 w-full" asChild>
                                    <a href={route('queue.take')}>Take Queue Number</a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center text-xl">
                                <FileText className="mr-2 h-5 w-5" />
                                Complaints
                            </CardTitle>
                            <CardDescription>Submit and track your complaints</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-sm">Submit a complaint or suggestion to help us improve our services.</p>
                                <Button className="w-full" asChild>
                                    <a href={route('complaints.create')}>Submit New Complaint</a>
                                </Button>
                                <Button variant="outline" className="w-full" asChild>
                                    <a href={route('complaints.index')}>View My Complaints</a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center text-xl">
                                <Users className="mr-2 h-5 w-5" />
                                My Profile
                            </CardTitle>
                            <CardDescription>Manage your personal information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-sm">Update your personal information and view your medical history.</p>
                                <Button className="w-full" asChild>
                                    <a href={route('profile.edit')}>Edit Profile</a>
                                </Button>
                                <Button variant="outline" className="w-full" asChild>
                                    <a href={route('medical-history')}>Medical History</a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
