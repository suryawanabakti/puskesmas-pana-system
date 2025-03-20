// resources/js/Pages/Patient/Complaints/Show.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, Download, MessageSquare, Tag } from 'lucide-react';

interface Complaint {
    id: number;
    title: string;
    category: string;
    description: string;
    status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
    created_at: string;
    updated_at: string;
    attachment_url: string | null;
    response: string | null;
    response_at: string | null;
}

interface ComplaintShowProps {
    complaint: Complaint;
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
    {
        title: 'View Complaint',
        href: '#',
    },
];

export default function ComplaintShow({ complaint }: ComplaintShowProps) {
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
            <Head title={`Complaint: ${complaint.title}`} />
            <div className="container mx-auto">
                <div className="mb-6 flex items-center">
                    <Button variant="ghost" size="sm" asChild className="mr-4">
                        <Link href={route('complaints.index')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Complaints
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Complaint Details</h1>
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
                                            Submitted on {new Date(complaint.created_at).toLocaleDateString()} at{' '}
                                            {new Date(complaint.created_at).toLocaleTimeString()}
                                        </CardDescription>
                                    </div>
                                    {getStatusBadge(complaint.status)}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-muted-foreground mb-1 text-sm font-medium">Category</h3>
                                        <div className="flex items-center">
                                            <Tag className="text-muted-foreground mr-2 h-4 w-4" />
                                            <span>{getCategoryLabel(complaint.category)}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-muted-foreground mb-1 text-sm font-medium">Description</h3>
                                        <div className="bg-muted rounded-md p-4 whitespace-pre-wrap">{complaint.description}</div>
                                    </div>

                                    {complaint.attachment_url && (
                                        <div>
                                            <h3 className="text-muted-foreground mb-1 text-sm font-medium">Attachment</h3>
                                            <Button variant="outline" size="sm" asChild>
                                                <a href={complaint.attachment_url} target="_blank" rel="noopener noreferrer">
                                                    <Download className="mr-2 h-4 w-4" />
                                                    Download Attachment
                                                </a>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {complaint.response && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <MessageSquare className="mr-2 h-5 w-5" />
                                        Response from Staff
                                    </CardTitle>
                                    {complaint.response_at && (
                                        <CardDescription>
                                            Responded on {new Date(complaint.response_at).toLocaleDateString()} at{' '}
                                            {new Date(complaint.response_at).toLocaleTimeString()}
                                        </CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-muted rounded-md p-4 whitespace-pre-wrap">{complaint.response}</div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Status Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-muted-foreground mb-1 text-sm font-medium">Current Status</h3>
                                        <div className="flex items-center">{getStatusBadge(complaint.status)}</div>
                                    </div>

                                    <div>
                                        <h3 className="text-muted-foreground mb-1 text-sm font-medium">Status Description</h3>
                                        <p className="text-sm">
                                            {complaint.status === 'pending' &&
                                                'Your complaint has been received and is awaiting review by our staff.'}
                                            {complaint.status === 'in_progress' &&
                                                'Our staff is currently reviewing your complaint and working on a response.'}
                                            {complaint.status === 'resolved' &&
                                                'Your complaint has been resolved. Please check the response from our staff.'}
                                            {complaint.status === 'rejected' &&
                                                'Your complaint has been reviewed but could not be processed. Please check the response for details.'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Timeline</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="mt-0.5 mr-2">
                                            <Clock className="text-muted-foreground h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium">Complaint Submitted</div>
                                            <div className="text-muted-foreground text-xs">
                                                {new Date(complaint.created_at).toLocaleDateString()} at{' '}
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
                                                <div className="text-sm font-medium">Status Updated</div>
                                                <div className="text-muted-foreground text-xs">
                                                    {new Date(complaint.updated_at).toLocaleDateString()} at{' '}
                                                    {new Date(complaint.updated_at).toLocaleTimeString()}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {complaint.response_at && (
                                        <div className="flex items-start">
                                            <div className="mt-0.5 mr-2">
                                                <Clock className="text-muted-foreground h-4 w-4" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium">Response Received</div>
                                                <div className="text-muted-foreground text-xs">
                                                    {new Date(complaint.response_at).toLocaleDateString()} at{' '}
                                                    {new Date(complaint.response_at).toLocaleTimeString()}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href={route('complaints.create')}>Submit New Complaint</Link>
                                </Button>

                                {complaint.status === 'resolved' && (
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href={route('complaints.feedback', complaint.id)}>Provide Feedback</Link>
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
