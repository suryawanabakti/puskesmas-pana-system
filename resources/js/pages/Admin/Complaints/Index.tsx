// resources/js/Pages/Admin/Complaints/Index.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Download, Eye, Search } from 'lucide-react';
import { useState } from 'react';

interface Complaint {
    id: number;
    title: string;
    category: string;
    description: string;
    status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
    patient_name: string;
    patient_id: number;
    created_at: string;
    updated_at: string;
    has_attachment: boolean;
}

interface ComplaintsIndexProps {
    complaints: {
        data: Complaint[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: route('admin.dashboard'),
    },
    {
        title: 'Keluhan',
        href: route('admin.complaints.index'),
    },
];

export default function ComplaintsIndex({ complaints }: ComplaintsIndexProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        Menunggu
                    </Badge>
                );
            case 'in_progress':
                return (
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                        Sedang Diproses
                    </Badge>
                );
            case 'resolved':
                return (
                    <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                        Selesai
                    </Badge>
                );
            case 'rejected':
                return (
                    <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
                        Ditolak
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'service':
                return 'Kualitas Layanan';
            case 'facility':
                return 'Fasilitas';
            case 'staff':
                return 'Perilaku Staf';
            case 'waiting':
                return 'Waktu Tunggu';
            case 'treatment':
                return 'Pengobatan';
            case 'other':
                return 'Lainnya';
            default:
                return category;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Keluhan" />
            <div className="container mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Kelola Keluhan</h1>
                    <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" asChild>
                            <a href={route('admin.complaints.export')}>
                                <Download className="mr-2 h-4 w-4" />
                                Ekspor
                            </a>
                        </Button>
                    </div>
                </div>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Data Keluhan</CardTitle>
                        <CardDescription>Kelola dan tanggapi keluhan pasien</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-6 flex flex-col gap-4 md:flex-row">
                            <div className="relative flex-1">
                                <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                                <Input
                                    placeholder="Cari berdasarkan judul atau nama pasien..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter berdasarkan status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="pending">Menunggu</SelectItem>
                                    <SelectItem value="in_progress">Sedang Diproses</SelectItem>
                                    <SelectItem value="resolved">Selesai</SelectItem>
                                    <SelectItem value="rejected">Ditolak</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={filterCategory} onValueChange={setFilterCategory}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter berdasarkan kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kategori</SelectItem>
                                    <SelectItem value="service">Kualitas Layanan</SelectItem>
                                    <SelectItem value="facility">Fasilitas</SelectItem>
                                    <SelectItem value="staff">Perilaku Staf</SelectItem>
                                    <SelectItem value="waiting">Waktu Tunggu</SelectItem>
                                    <SelectItem value="treatment">Pengobatan</SelectItem>
                                    <SelectItem value="other">Lainnya</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Judul</TableHead>
                                        <TableHead>Pasien</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Tanggal Masuk</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {complaints.data.map((complaint) => (
                                        <TableRow key={complaint.id}>
                                            <TableCell className="font-medium">
                                                {complaint.title}
                                                {complaint.has_attachment && <span className="ml-2 text-xs text-blue-500">[Lampiran]</span>}
                                            </TableCell>
                                            <TableCell>{complaint.user?.name}</TableCell>
                                            <TableCell>{getCategoryLabel(complaint.category)}</TableCell>
                                            <TableCell>{getStatusBadge(complaint.status)}</TableCell>
                                            <TableCell>{new Date(complaint.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={route('admin.complaints.show', complaint.id)}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Lihat
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-muted-foreground text-sm">
                                Menampilkan <span className="font-medium">{complaints.data.length}</span> dari{' '}
                                <span className="font-medium">{complaints.total}</span> keluhan
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" disabled={complaints.current_page === 1} asChild>
                                    <Link href={`?page=${complaints.current_page - 1}`}>Sebelumnya</Link>
                                </Button>
                                <Button variant="outline" size="sm" disabled={complaints.current_page === complaints.last_page} asChild>
                                    <Link href={`?page=${complaints.current_page + 1}`}>Berikutnya</Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
