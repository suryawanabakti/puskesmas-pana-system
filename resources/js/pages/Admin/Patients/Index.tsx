// resources/js/Pages/Admin/Patients/Index.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Download, Edit, Eye, Search, Trash2, UserPlus } from 'lucide-react';
import { useState } from 'react';

interface Patient {
    id: number;
    name: string;
    nik: string;
    gender: string;
    birthdate: string;
    phone: string;
    email: string;
    address: string;
    created_at: string;
}

interface PatientsIndexProps {
    patients: {
        data: Patient[];
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
        title: 'Patients',
        href: route('admin.patients.index'),
    },
];

export default function PatientsIndex({ patients }: PatientsIndexProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGender, setFilterGender] = useState('');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Patients" />
            <div className="container mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Manage Patients</h1>
                    <div className="flex space-x-2">
                        <Button variant="outline" size="sm" asChild>
                            <a href={route('admin.patients.export')}>
                                <Download className="mr-2 h-4 w-4" />
                                Export
                            </a>
                        </Button>
                        <Button size="sm" asChild>
                            <a href={route('admin.patients.create')}>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Add Patient
                            </a>
                        </Button>
                    </div>
                </div>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Patient Records</CardTitle>
                        <CardDescription>Manage and view all registered patients</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-6 flex flex-col gap-4 md:flex-row">
                            <div className="relative flex-1">
                                <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                                <Input
                                    placeholder="Search by name, NIK, or email..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={filterGender} onValueChange={setFilterGender}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Genders</SelectItem>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>NIK</TableHead>
                                        <TableHead>Gender</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Registration Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {patients.data.map((patient) => (
                                        <TableRow key={patient.id}>
                                            <TableCell className="font-medium">{patient.name}</TableCell>
                                            <TableCell>{patient.nik}</TableCell>
                                            <TableCell>{patient.gender === 'male' ? 'Male' : 'Female'}</TableCell>
                                            <TableCell>{patient.phone}</TableCell>
                                            <TableCell>{new Date(patient.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={route('admin.patients.show', patient.id)}>
                                                            <Eye className="h-4 w-4" />
                                                            <span className="sr-only">View</span>
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={route('admin.patients.edit', patient.id)}>
                                                            <Edit className="h-4 w-4" />
                                                            <span className="sr-only">Edit</span>
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-destructive">
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="sr-only">Delete</span>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-muted-foreground text-sm">
                                Showing <span className="font-medium">{patients.data.length}</span> of{' '}
                                <span className="font-medium">{patients.total}</span> patients
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" disabled={patients.current_page === 1} asChild>
                                    <Link href={`?page=${patients.current_page - 1}`}>Previous</Link>
                                </Button>
                                <Button variant="outline" size="sm" disabled={patients.current_page === patients.last_page} asChild>
                                    <Link href={`?page=${patients.current_page + 1}`}>Next</Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
