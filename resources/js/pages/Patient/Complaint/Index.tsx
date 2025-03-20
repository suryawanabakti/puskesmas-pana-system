// resources/js/Pages/Patient/Complaints/Index.tsx
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
import { Eye, FileText, Plus, Search } from 'lucide-react';
import { useState } from 'react';

interface Complaint {
    id: number;
    title: string;
    category: string;
    description: string;
    status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
    created_at: string;
    updated_at: string;
    has_attachment: boolean;
    has_response: boolean;
}

interface ComplaintsIndexProps {
    complaints: Complaint[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
    {
        title: 'My Complaints',
        href: route('complaints.index'),
    },
];

export default function ComplaintsIndex({ complaints }: ComplaintsIndexProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    const filteredComplaints = complaints.filter((complaint) => {
        const matchesSearch =
            complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            complaint.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus ? complaint.status === filterStatus : true;
        const matchesCategory = filterCategory ? complaint.category === filterCategory : true;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        Pending
                    </Badge>
                );
            case 'in_progress':
                return (
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                        In Progress
                    </Badge>
                );
            case 'resolved':
                return (
                    <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                        Resolved
                    </Badge>
                );
            case 'rejected':
                return (
                    <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
                        Rejected
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Complaints" />
            <div className="container mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold">My Complaints</h1>
                    <Button asChild>
                        <Link href={route('complaints.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Submit New Complaint
                        </Link>
                    </Button>
                </div>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Complaint History</CardTitle>
                        <CardDescription>View and track the status of your submitted complaints</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-6 flex flex-col gap-4 md:flex-row">
                            <div className="relative flex-1">
                                <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                                <Input
                                    placeholder="Search complaints..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={filterCategory} onValueChange={setFilterCategory}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    <SelectItem value="service">Service Quality</SelectItem>
                                    <SelectItem value="facility">Facility</SelectItem>
                                    <SelectItem value="staff">Staff Behavior</SelectItem>
                                    <SelectItem value="waiting">Waiting Time</SelectItem>
                                    <SelectItem value="treatment">Treatment</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {filteredComplaints.length > 0 ? (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Date Submitted</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredComplaints.map((complaint) => (
                                            <TableRow key={complaint.id}>
                                                <TableCell className="font-medium">
                                                    {complaint.title}
                                                    {complaint.has_attachment && <span className="ml-2 text-xs text-blue-500">[Attachment]</span>}
                                                    {complaint.has_response && <span className="ml-2 text-xs text-green-500">[Response]</span>}
                                                </TableCell>
                                                <TableCell>{getCategoryLabel(complaint.category)}</TableCell>
                                                <TableCell>{getStatusBadge(complaint.status)}</TableCell>
                                                <TableCell>{new Date(complaint.created_at).toLocaleDateString()}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={route('complaints.show', complaint.id)}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <FileText className="text-muted-foreground mb-4 h-12 w-12" />
                                <h3 className="mb-2 text-lg font-medium">No complaints found</h3>
                                <p className="text-muted-foreground mb-4">
                                    {searchTerm || filterStatus || filterCategory
                                        ? 'No complaints match your search criteria. Try adjusting your filters.'
                                        : "You haven't submitted any complaints yet."}
                                </p>
                                <Button asChild>
                                    <Link href={route('complaints.create')}>Submit New Complaint</Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
