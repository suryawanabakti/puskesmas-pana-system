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
            <Head title="Dashboard Pasien" />
            <div className="container mx-auto">
                <h1 className="mb-8 text-3xl font-bold">Dashboard Pasien</h1>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center text-xl">
                                <CalendarClock className="mr-2 h-5 w-5" />
                                Status Antrian Saat Ini
                            </CardTitle>
                            <CardDescription>Informasi antrian secara langsung</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Nomor Saat Ini:</span>
                                    <span className="text-2xl font-bold">{currentNumber || '-'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Jumlah Menunggu:</span>
                                    <span className="text-lg font-semibold">{queueCount}</span>
                                </div>
                                {userNumber && (
                                    <>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Nomor Anda:</span>
                                            <span className="text-primary text-xl font-bold">{userNumber}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Perkiraan Waktu Tunggu:</span>
                                            <span className="text-lg font-semibold">{estimatedTime || 'Sedang menghitung...'}</span>
                                        </div>
                                    </>
                                )}
                                <Button className="mt-4 w-full" asChild>
                                    <a href={route('queue.take')}>Ambil Nomor Antrian</a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center text-xl">
                                <FileText className="mr-2 h-5 w-5" />
                                Keluhan
                            </CardTitle>
                            <CardDescription>Kirim dan pantau keluhan Anda</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-sm">Sampaikan keluhan atau saran untuk membantu kami meningkatkan layanan.</p>
                                <Button className="w-full" asChild>
                                    <a href={route('complaints.create')}>Kirim Keluhan Baru</a>
                                </Button>
                                <Button variant="outline" className="w-full" asChild>
                                    <a href={route('complaints.index')}>Lihat Keluhan Saya</a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center text-xl">
                                <Users className="mr-2 h-5 w-5" />
                                Profil Saya
                            </CardTitle>
                            <CardDescription>Kelola informasi pribadi Anda</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-sm">Perbarui informasi pribadi dan lihat riwayat medis Anda.</p>
                                <Button className="w-full" asChild>
                                    <a href={route('profile.edit')}>Ubah Profil</a>
                                </Button>
                                <Button variant="outline" className="w-full" asChild>
                                    <a href={route('medical-history')}>Riwayat Medis</a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
