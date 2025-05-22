// resources/js/Pages/Admin/Complaints/Show.tsx
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, Download, Tag, User } from 'lucide-react';
import { useState } from 'react';

interface Complaint {
    id: number;
    title: string;
    category: string;
    description: string;
    status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
    patient_name: string;
    patient_id: number;
    patient_email: string;
    created_at: string;
    updated_at: string;
    attachment_url: string | null;
    user: any;
    admin_notes: string | null;
    response: string | null;
}

interface ComplaintShowProps {
    complaint: Complaint;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: route('admin.dashboard'),
    },
    {
        title: 'Complaints',
        href: route('admin.complaints.index'),
    },
    {
        title: 'View Complaint',
        href: '#',
    },
];

export default function ComplaintShow({ complaint }: ComplaintShowProps) {
    const { toast } = useToast();
    const [status, setStatus] = useState(complaint.status);
    const [response, setResponse] = useState(complaint.response || '');
    const [adminNotes, setAdminNotes] = useState(complaint.admin_notes || '');
    const [isProcessing, setIsProcessing] = useState(false);

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'service':
                return 'Service Quality';
            case 'facility':
                return 'Facility';
            case 'staff':
                return 'Staff Behavior';
            case 'waiting':
                return 'Waiting Time';
            case 'treatment':
                return 'Treatment';
            case 'other':
                return 'Other';
            default:
                return category;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
            case 'in_progress':
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>;
            case 'resolved':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Resolved</Badge>;
            case 'rejected':
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const handleUpdateStatus = () => {
        setIsProcessing(true);

        router.patch(
            route('admin.complaints.update-status', complaint.id),
            {
                status: status,
            },
            {
                onSuccess: () => {
                    toast({
                        title: 'Status updated',
                        description: 'Complaint status has been updated successfully',
                        variant: 'success',
                    });
                    setIsProcessing(false);
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description: 'Failed to update status. Please try again.',
                        variant: 'destructive',
                    });
                    setIsProcessing(false);
                },
            },
        );
    };

    const handleSaveResponse = () => {
        setIsProcessing(true);
        router.post(
            route('admin.complaints.respond', complaint.id),
            {
                response: response,
            },
            {
                onSuccess: () => {
                    toast({
                        title: 'Response saved',
                        description: 'Your response has been saved and sent to the patient',
                        variant: 'success',
                    });
                    setIsProcessing(false);
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description: 'Failed to save response. Please try again.',
                        variant: 'destructive',
                    });
                    setIsProcessing(false);
                },
            },
        );
    };

    const handleSaveNotes = () => {
        setIsProcessing(true);
        router.post(
            route('admin.complaints.update-notes', complaint.id),
            {
                admin_notes: adminNotes,
            },
            {
                onSuccess: () => {
                    toast({
                        title: 'Notes saved',
                        description: 'Admin notes have been saved successfully',
                        variant: 'success',
                    });
                    setIsProcessing(false);
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description: 'Failed to save notes. Please try again.',
                        variant: 'destructive',
                    });
                    setIsProcessing(false);
                },
            },
        );
    };

   return (
    <AppLayout breadcrumbs={breadcrumbs}>
        <Head title={`Keluhan: ${complaint.title}`} />
        <div className="container mx-auto">
            <div className="mb-6 flex items-center">
                <Button variant="ghost" size="sm" asChild className="mr-4">
                    <Link href={route('admin.complaints.index')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Daftar Keluhan
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold">Detail Keluhan</h1>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-xl">{complaint.title}</CardTitle>
                                    <CardDescription className="mt-1 flex items-center">
                                        <Calendar className="mr-1 h-4 w-4" />
                                        Diajukan pada {new Date(complaint.created_at).toLocaleDateString()} pukul{' '}
                                        {new Date(complaint.created_at).toLocaleTimeString()}
                                    </CardDescription>
                                </div>
                                {getStatusBadge(status)}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-muted-foreground mb-1 text-sm font-medium">Kategori</h3>
                                    <div className="flex items-center">
                                        <Tag className="text-muted-foreground mr-2 h-4 w-4" />
                                        <span>{getCategoryLabel(complaint.category)}</span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-muted-foreground mb-1 text-sm font-medium">Deskripsi</h3>
                                    <div className="bg-muted rounded-md p-4 whitespace-pre-wrap">{complaint.description}</div>
                                </div>

                                {complaint.attachment_url && (
                                    <div>
                                        <h3 className="text-muted-foreground mb-1 text-sm font-medium">Lampiran</h3>
                                        <Button variant="outline" size="sm" asChild>
                                            <a href={complaint.attachment_url} target="_blank" rel="noopener noreferrer">
                                                <Download className="mr-2 h-4 w-4" />
                                                Unduh Lampiran
                                            </a>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Respon ke Pasien</CardTitle>
                            <CardDescription>
                                Respon ini akan dikirim ke pasien melalui email dan akan terlihat dalam detail keluhan mereka
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                placeholder="Masukkan respon Anda kepada pasien..."
                                value={response}
                                onChange={(e) => setResponse(e.target.value)}
                                rows={6}
                                disabled={isProcessing}
                            />
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <div className="text-muted-foreground text-sm">
                                {status === 'resolved' ? (
                                    <span className="text-green-600">Keluhan ini telah diselesaikan</span>
                                ) : (
                                    <span>Pertimbangkan untuk memperbarui status setelah memberikan respon</span>
                                )}
                            </div>
                            <Button onClick={handleSaveResponse} disabled={!response.trim() || isProcessing}>
                                Simpan & Kirim Respon
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Catatan Admin</CardTitle>
                            <CardDescription>
                                Catatan ini hanya terlihat oleh admin dan tidak akan dibagikan kepada pasien
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                placeholder="Masukkan catatan internal mengenai keluhan ini..."
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                rows={4}
                                disabled={isProcessing}
                            />
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button onClick={handleSaveNotes} disabled={isProcessing}>
                                Simpan Catatan
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Pasien</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <User className="text-muted-foreground mr-2 h-4 w-4" />
                                    <span className="font-medium">{complaint.user.name}</span>
                                </div>
                                <div className="text-sm">
                                    <div className="text-muted-foreground mb-1">Email:</div>
                                    <div>{complaint.user.email}</div>
                                </div>
                                <Button variant="outline" size="sm" asChild className="w-full">
                                    {/* <Link href={route('admin.patients.show', complaint.patient_id)}>Lihat Profil Pasien</Link> */}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Perbarui Status</CardTitle>
                            <CardDescription>Ubah status keluhan ini saat ini</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Select value={status} onValueChange={setStatus} disabled={isProcessing}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Menunggu</SelectItem>
                                    <SelectItem value="in_progress">Sedang Diproses</SelectItem>
                                    <SelectItem value="resolved">Selesai</SelectItem>
                                    <SelectItem value="rejected">Ditolak</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button className="w-full" onClick={handleUpdateStatus} disabled={status === complaint.status || isProcessing}>
                                Perbarui Status
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Aksi</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" size="sm" className="w-full" asChild>
                                {/* <Link href={route('admin.complaints.print', complaint.id)} target="_blank">
                                    Cetak Keluhan
                                </Link> */}
                            </Button>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm" className="w-full">
                                        Hapus Keluhan
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus keluhan secara permanen dan menghapus data dari server kami.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => {
                                                setIsProcessing(true);
                                                router.delete(route('admin.complaints.destroy', complaint.id), {
                                                    onSuccess: () => {
                                                        toast({
                                                            title: 'Keluhan dihapus',
                                                            description: 'Keluhan telah dihapus secara permanen',
                                                            variant: 'success',
                                                        });
                                                    },
                                                    onError: () => {
                                                        toast({
                                                            title: 'Terjadi Kesalahan',
                                                            description: 'Gagal menghapus keluhan. Silakan coba lagi.',
                                                            variant: 'destructive',
                                                        });
                                                        setIsProcessing(false);
                                                    },
                                                });
                                            }}
                                        >
                                            Hapus
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Lini Waktu</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="mt-0.5 mr-2">
                                        <Clock className="text-muted-foreground h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium">Keluhan Diajukan</div>
                                        <div className="text-muted-foreground text-xs">
                                            {new Date(complaint.created_at).toLocaleDateString()} pukul{' '}
                                            {new Date(complaint.created_at).toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>

                                {complaint.updated_at !== complaint.created_at && (
                                    <div className="flex items-start">
                                        <div className="mt-0.5 mr-2">
                                            <Clock className="text-muted-foreground h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium">Terakhir Diperbarui</div>
                                            <div className="text-muted-foreground text-xs">
                                                {new Date(complaint.updated_at).toLocaleDateString()} pukul{' '}
                                                {new Date(complaint.updated_at).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {complaint.response && (
                                    <div className="flex items-start">
                                        <div className="mt-0.5 mr-2">
                                            <Clock className="text-muted-foreground h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium">Respon Dikirim</div>
                                            <div className="text-muted-foreground text-xs">
                                                {new Date(complaint.updated_at).toLocaleDateString()} pukul{' '}
                                                {new Date(complaint.updated_at).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </AppLayout>
);

}
