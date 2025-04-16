'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import type React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Beranda',
        href: route('dashboard'),
    },
    {
        title: 'Keluhan',
        href: route('complaints.index'),
    },
    {
        title: 'Kirim Keluhan',
        href: route('complaints.create'),
    },
];

export default function CreateComplaint() {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        category: '',
        description: '',
        attachment: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            route('complaints.store'),
            {
                ...data,
                attachment: data.attachment,
            },
            {
                onSuccess: () => {
                    toast({
                        title: 'Keluhan berhasil dikirim',
                        description: 'Keluhan Anda telah berhasil dikirim.',
                    });
                    reset();
                },
            },
        );
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('attachment', e.target.files[0]);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kirim Keluhan" />
            <div className="container mx-auto">
                <Card className="mx-auto max-w-2xl">
                    <CardHeader>
                        <CardTitle>Kirim Keluhan</CardTitle>
                        <CardDescription>Silakan berikan detail terkait keluhan atau saran Anda</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Judul Keluhan</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Judul singkat keluhan Anda"
                                    required
                                />
                                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Kategori</Label>
                                <Select value={data.category} onValueChange={(value) => setData('category', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="service">Kualitas Layanan</SelectItem>
                                        <SelectItem value="facility">Fasilitas</SelectItem>
                                        <SelectItem value="staff">Perilaku Staf</SelectItem>
                                        <SelectItem value="waiting">Waktu Tunggu</SelectItem>
                                        <SelectItem value="treatment">Pengobatan</SelectItem>
                                        <SelectItem value="other">Lainnya</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Silakan berikan informasi lengkap mengenai keluhan Anda"
                                    rows={5}
                                    required
                                />
                                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="attachment">Lampiran (Opsional)</Label>
                                <Input id="attachment" type="file" onChange={handleFileChange} accept="image/*,.pdf,.doc,.docx" />
                                <p className="text-xs text-gray-500">Anda dapat melampirkan foto atau dokumen terkait keluhan (Maks. 5MB)</p>
                                {errors.attachment && <p className="text-sm text-red-500">{errors.attachment}</p>}
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <Button type="button" variant="outline" onClick={() => reset()}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    Kirim Keluhan
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
