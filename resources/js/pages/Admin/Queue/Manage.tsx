// resources/js/Pages/Admin/Queue/Manage.tsx
'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { ArrowRight, Bell, Pause, Play, RefreshCw, SkipForward, XCircle } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

interface QueueItem {
    id: number;
    number: number;
    patient_name: string;
    patient_id: number;
    status: 'waiting' | 'serving' | 'completed' | 'cancelled';
    created_at: string;
    estimated_time: string | null;
    nobpjs: string;
    bpjs: boolean;
    nik: string;
}

interface QueueManageProps {
    currentQueue: {
        number: number | null;
        status: 'active' | 'paused';
    };
    queueItems: QueueItem[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: route('admin.dashboard'),
    },
    {
        title: 'Queue Management',
        href: route('admin.queue.manage'),
    },
];

export default function QueueManage({ currentQueue, queueItems }: QueueManageProps) {
    const [queueStatus, setQueueStatus] = useState(currentQueue.status);
    const [isProcessing, setIsProcessing] = useState(false);
    const { toast } = useToast();

    const { data, setData, post, processing } = useForm({
        announcement: '',
    });

    // Handler for calling the next patient in queue
    const handleNextQueue = () => {
        setIsProcessing(true);

        router.post(
            route('admin.queue.next'),
            {},
            {
                onSuccess: () => {
                    toast({
                        title: 'Queue updated',
                        description: 'Called the next patient in queue',
                        variant: 'success',
                    });
                    setIsProcessing(false);
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description: 'Failed to call the next patient. Please try again.',
                        variant: 'destructive',
                    });
                    setIsProcessing(false);
                },
            },
        );
    };

    // Handler for skipping the current patient
    const handleSkipCurrent = () => {
        if (!currentQueue.number) {
            toast({
                title: 'No active queue',
                description: 'There is no active queue to skip',
                variant: 'destructive',
            });
            return;
        }

        setIsProcessing(true);
        router.post(
            route('admin.queue.skip'),
            {},
            {
                onSuccess: () => {
                    toast({
                        title: 'Patient skipped',
                        description: 'Current patient has been skipped',
                        variant: 'success',
                    });
                    setIsProcessing(false);
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description: 'Failed to skip the current patient. Please try again.',
                        variant: 'destructive',
                    });
                    setIsProcessing(false);
                },
            },
        );
    };

    // Handler for toggling queue status (active/paused)
    const handleToggleQueueStatus = () => {
        const newStatus = queueStatus === 'active' ? 'paused' : 'active';
        setIsProcessing(true);

        router.post(
            route('admin.queue.toggle-status'),
            {
                status: newStatus,
            },
            {
                onSuccess: () => {
                    setQueueStatus(newStatus);
                    toast({
                        title: `Queue ${newStatus}`,
                        description: `Queue has been ${newStatus === 'active' ? 'activated' : 'paused'}`,
                        variant: 'success',
                    });
                    setIsProcessing(false);
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description: `Failed to ${newStatus === 'active' ? 'activate' : 'pause'} the queue. Please try again.`,
                        variant: 'destructive',
                    });
                    setIsProcessing(false);
                },
            },
        );
    };

    // Handler for starting the queue
    const handleStartQueue = () => {
        setIsProcessing(true);
        router.post(
            route('admin.queue.start'),
            {},
            {
                onSuccess: () => {
                    setQueueStatus('active');
                    toast({
                        title: 'Queue started',
                        description: 'Queue has been started successfully',
                        variant: 'success',
                    });
                    setIsProcessing(false);
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description: 'Failed to start the queue. Please try again.',
                        variant: 'destructive',
                    });
                    setIsProcessing(false);
                },
            },
        );
    };

    // Handler for pausing the queue
    const handlePauseQueue = () => {
        setIsProcessing(true);
        router.post(
            route('admin.queue.pause'),
            {},
            {
                onSuccess: () => {
                    setQueueStatus('paused');
                    toast({
                        title: 'Queue paused',
                        description: 'Queue has been paused successfully',
                        variant: 'success',
                    });
                    setIsProcessing(false);
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description: 'Failed to pause the queue. Please try again.',
                        variant: 'destructive',
                    });
                    setIsProcessing(false);
                },
            },
        );
    };

    // Handler for resetting the queue
    const handleResetQueue = () => {
        setIsProcessing(true);
        router.post(
            route('admin.queue.reset'),
            {},
            {
                onSuccess: () => {
                    toast({
                        title: 'Queue reset',
                        description: 'Queue has been reset successfully',
                        variant: 'success',
                    });
                    setIsProcessing(false);
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description: 'Failed to reset the queue. Please try again.',
                        variant: 'destructive',
                    });
                    setIsProcessing(false);
                },
            },
        );
    };

    // Handler for closing the queue
    const handleCloseQueue = () => {
        setIsProcessing(true);
        router.post(
            route('admin.queue.close'),
            {},
            {
                onSuccess: () => {
                    setQueueStatus('paused');
                    toast({
                        title: 'Queue closed',
                        description: 'Queue has been closed successfully',
                        variant: 'success',
                    });
                    setIsProcessing(false);
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description: 'Failed to close the queue. Please try again.',
                        variant: 'destructive',
                    });
                    setIsProcessing(false);
                },
            },
        );
    };

    // Handler for calling a specific patient
    const handleCallPatient = (queueId: number) => {
        setIsProcessing(true);
        router.post(
            route('admin.queue.call-specific'),
            {
                queue_id: queueId,
            },
            {
                onSuccess: () => {
                    toast({
                        title: 'Patient called',
                        description: 'Patient has been called successfully',
                        variant: 'success',
                    });
                    setIsProcessing(false);
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description: 'Failed to call the patient. Please try again.',
                        variant: 'destructive',
                    });
                    setIsProcessing(false);
                },
            },
        );
    };

    // Handler for cancelling a specific queue
    const handleCancelQueue = (queueId: number) => {
        setIsProcessing(true);
        router.post(
            route('admin.queue.cancel'),
            {
                queue_id: queueId,
            },
            {
                onSuccess: () => {
                    toast({
                        title: 'Queue cancelled',
                        description: 'Queue has been cancelled successfully',
                        variant: 'success',
                    });
                    setIsProcessing(false);
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description: 'Failed to cancel the queue. Please try again.',
                        variant: 'destructive',
                    });
                    setIsProcessing(false);
                },
            },
        );
    };

    // Handler for sending announcement
    const handleSendAnnouncement = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.announcement.trim()) {
            toast({
                title: 'Empty announcement',
                description: 'Please enter an announcement message',
                variant: 'destructive',
            });
            return;
        }

        setIsProcessing(true);
        router.post(
            route('admin.queue.announce'),
            {
                message: data.announcement,
            },
            {
                onSuccess: () => {
                    toast({
                        title: 'Announcement sent',
                        description: 'Your announcement has been sent to all waiting patients',
                        variant: 'success',
                    });
                    setData('announcement', '');
                    setIsProcessing(false);
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description: 'Failed to send announcement. Please try again.',
                        variant: 'destructive',
                    });
                    setIsProcessing(false);
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Antrian" />
            <div className="container mx-auto">
                <h1 className="mb-6 text-3xl font-bold">Manajemen Antrian</h1>

                <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Status Antrian Saat Ini</CardTitle>
                            <CardDescription>Kelola antrian saat ini dan panggil pasien berikutnya</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-6 flex flex-col items-center gap-6 md:flex-row">
                                <div className="bg-primary/10 w-full rounded-lg p-6 text-center md:w-auto">
                                    <div className="mb-1 text-sm font-medium">Sedang Dilayani</div>
                                    <div className="text-primary text-6xl font-bold">{currentQueue.number || '-'}</div>
                                </div>

                                <div className="flex w-full flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="queue-status"
                                                checked={queueStatus === 'active'}
                                                onCheckedChange={handleToggleQueueStatus}
                                                disabled={isProcessing}
                                            />
                                            <Label htmlFor="queue-status">Antrian {queueStatus === 'active' ? 'Aktif' : 'Dijeda'}</Label>
                                        </div>
                                        <div className="text-muted-foreground text-sm">
                                            {queueItems.filter((item) => item.status === 'waiting').length} pasien menunggu
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button className="flex-1" onClick={handleNextQueue} disabled={queueStatus !== 'active' || isProcessing}>
                                            <ArrowRight className="mr-2 h-4 w-4" />
                                            Panggil Pasien Berikutnya
                                        </Button>
                                        <Button variant="outline" onClick={handleSkipCurrent} disabled={!currentQueue.number || isProcessing}>
                                            <SkipForward className="mr-2 h-4 w-4" />
                                            Lewati Sekarang
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4 rounded-md border p-4">
                                <h3 className="mb-2 font-medium">Kontrol Antrian</h3>
                                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleStartQueue}
                                        disabled={queueStatus === 'active' || isProcessing}
                                    >
                                        <Play className="mr-2 h-4 w-4" />
                                        Mulai Antrian
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handlePauseQueue}
                                        disabled={queueStatus !== 'active' || isProcessing}
                                    >
                                        <Pause className="mr-2 h-4 w-4" />
                                        Jeda Antrian
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="outline" size="sm" disabled={isProcessing}>
                                                <RefreshCw className="mr-2 h-4 w-4" />
                                                Reset Antrian
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Reset Antrian</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Ini akan mereset seluruh sistem antrian. Semua nomor antrian yang ada akan hilang. Apakah Anda
                                                    yakin ingin melanjutkan?
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleResetQueue}>Lanjutkan</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="outline" size="sm" disabled={isProcessing}>
                                                <XCircle className="mr-2 h-4 w-4" />
                                                Tutup Antrian
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Tutup Antrian</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Ini akan menutup antrian untuk hari ini. Pasien tidak akan bisa mengambil nomor antrian baru.
                                                    Apakah Anda yakin ingin melanjutkan?
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleCloseQueue}>Lanjutkan</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>

                            <form onSubmit={handleSendAnnouncement} className="flex gap-2">
                                <Input
                                    placeholder="Kirim pengumuman kepada pasien yang menunggu..."
                                    value={data.announcement}
                                    onChange={(e) => setData('announcement', e.target.value)}
                                    className="flex-1"
                                    disabled={isProcessing}
                                />
                                <Button type="submit" variant="secondary" disabled={!data.announcement || isProcessing}>
                                    <Bell className="mr-2 h-4 w-4" />
                                    Umumkan
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Statistik Antrian</CardTitle>
                            <CardDescription>Kinerja antrian hari ini</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-sm">Total Dilayani:</span>
                                    <span className="font-medium">{queueItems.filter((item) => item.status === 'completed').length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">Sedang Menunggu:</span>
                                    <span className="font-medium">{queueItems.filter((item) => item.status === 'waiting').length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">Waktu Tunggu Rata-rata:</span>
                                    <span className="font-medium">15 menit</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">Dibatalkan:</span>
                                    <span className="font-medium">{queueItems.filter((item) => item.status === 'cancelled').length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">Antrian Dimulai:</span>
                                    <span className="font-medium">08:00 Pagi</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Antrian</CardTitle>
                        <CardDescription>Semua pasien dalam antrian hari ini</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No. Antrian</TableHead>
                                        <TableHead> Pasien</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Waktu Ditambahkan</TableHead>
                                        <TableHead>Waktu Estimasi</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {queueItems.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.number}</TableCell>
                                            <TableCell>Nama : {item.patient_name} <br /> NoBpjs: {item.nobpjs} <br /> Nik :{item.nik} </TableCell>
                                            <TableCell>
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                        item.status === 'waiting'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : item.status === 'serving'
                                                              ? 'bg-blue-100 text-blue-800'
                                                              : item.status === 'completed'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                    }`}
                                                >
                                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                </span>
                                            </TableCell>
                                            <TableCell>{new Date(item.created_at).toLocaleTimeString()}</TableCell>
                                            <TableCell>{item.estimated_time || '-'}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2 hidden">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        disabled={item.status !== 'waiting' || isProcessing}
                                                        onClick={() => handleCallPatient(item.id)}
                                                    >
                                                        Panggil Sekarang
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-destructive"
                                                                disabled={item.status !== 'waiting' || isProcessing}
                                                            >
                                                                Batalkan
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Batalkan Antrian</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Apakah Anda yakin ingin membatalkan nomor antrian {item.number} untuk{' '}
                                                                    {item.patient_name}? Tindakan ini tidak dapat dibatalkan.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Tidak, biarkan saja</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleCancelQueue(item.id)}>
                                                                    Ya, batalkan
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
