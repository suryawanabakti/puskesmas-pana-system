import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Clock, Users } from 'lucide-react';

interface QueueData {
    currentNumber: number;
    totalWaiting: number;
    userNumber: number | null;
    estimatedWaitTime: string | null;
    queueStatus: 'active' | 'closed';
    lastUpdated: string;
}

interface QueueViewProps {
    queueData: QueueData;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Beranda',
        href: route('dashboard'),
    },
    {
        title: 'Status Antrian',
        href: route('queue.view'),
    },
];

export default function QueueView({ queueData }: QueueViewProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Status Antrian" />
            <div className="container mx-auto">
                <div className="mx-auto max-w-4xl">
                    <h1 className="mb-6 text-3xl font-bold">Status Antrian</h1>

                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                        <Card className="bg-primary text-primary-foreground">
                            <CardHeader>
                                <CardTitle className="text-2xl">Sedang Dilayani</CardTitle>
                                <CardDescription className="text-primary-foreground/80">Nomor antrian saat ini</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-center">
                                    <span className="text-7xl font-bold">{queueData.currentNumber}</span>
                                </div>
                                <p className="text-primary-foreground/80 mt-4 text-sm">Terakhir diperbarui: {queueData.lastUpdated}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Users className="mr-2 h-5 w-5" />
                                    Informasi Antrian
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Status Antrian:</span>
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                queueData.queueStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {queueData.queueStatus === 'active' ? 'Aktif' : 'Tutup'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Jumlah Menunggu:</span>
                                        <span className="text-lg font-semibold">{queueData.totalWaiting}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Rata-rata Waktu Tunggu:</span>
                                        <span className="flex items-center">
                                            <Clock className="mr-1 h-4 w-4" />
                                            <span>~15 menit per pasien</span>
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {queueData.userNumber ? (
                        <Card className="border-primary mb-8 border-2">
                            <CardHeader>
                                <CardTitle>Nomor Antrian Anda</CardTitle>
                                <CardDescription>Posisi Anda dalam antrian</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col items-center justify-center py-4">
                                    <span className="text-primary mb-4 text-6xl font-bold">{queueData.userNumber}</span>
                                    <div className="space-y-2 text-center">
                                        <p className="text-sm">
                                            Terdapat <span className="font-bold">{queueData.userNumber - queueData.currentNumber}</span> orang di
                                            depan Anda
                                        </p>
                                        {queueData.estimatedWaitTime && (
                                            <p className="text-sm">
                                                Estimasi waktu tunggu: <span className="font-bold">{queueData.estimatedWaitTime}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="mb-8">
                            <CardContent className="pt-6">
                                <div className="py-4 text-center">
                                    <p className="mb-4">Anda belum memiliki nomor antrian aktif</p>
                                    <Button asChild variant={'primary'} className="w-full">
                                        <a href={route('queue.take')}>Ambil Nomor Antrian</a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="bg-muted rounded-lg p-4">
                        <h3 className="mb-2 font-medium">Informasi Penting</h3>
                        <ul className="list-inside list-disc space-y-1 text-sm">
                            <li>Harap datang minimal 10 menit sebelum estimasi waktu Anda</li>
                            <li>Jika Anda melewatkan nomor antrian, Anda harus mengambil nomor antrian baru</li>
                            <li>Jam pelayanan antrian: Senin–Jumat, 08:00 - 16:00</li>
                            <li>Untuk kondisi darurat, silakan langsung menuju unit gawat darurat</li>
                        </ul>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
