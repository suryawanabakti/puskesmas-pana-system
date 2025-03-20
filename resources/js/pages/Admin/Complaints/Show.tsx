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
            <Head title={`Complaint: ${complaint.title}`} />
            <div className="container mx-auto">
                <div className="mb-6 flex items-center">
                    <Button variant="ghost" size="sm" asChild className="mr-4">
                        <Link href={route('admin.complaints.index')}>
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
                                    {getStatusBadge(status)}
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

                        <Card>
                            <CardHeader>
                                <CardTitle>Response to Patient</CardTitle>
                                <CardDescription>
                                    This response will be sent to the patient via email and will be visible in their complaint details
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    placeholder="Enter your response to the patient..."
                                    value={response}
                                    onChange={(e) => setResponse(e.target.value)}
                                    rows={6}
                                    disabled={isProcessing}
                                />
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <div className="text-muted-foreground text-sm">
                                    {status === 'resolved' ? (
                                        <span className="text-green-600">This complaint has been resolved</span>
                                    ) : (
                                        <span>Consider updating the status after responding</span>
                                    )}
                                </div>
                                <Button onClick={handleSaveResponse} disabled={!response.trim() || isProcessing}>
                                    Save & Send Response
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Admin Notes</CardTitle>
                                <CardDescription>
                                    These notes are only visible to administrators and will not be shared with the patient
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    placeholder="Enter internal notes about this complaint..."
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    rows={4}
                                    disabled={isProcessing}
                                />
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button onClick={handleSaveNotes} disabled={isProcessing}>
                                    Save Notes
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Patient Information</CardTitle>
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
                                        {/* <Link href={route('admin.patients.show', complaint.patient_id)}>View Patient Profile</Link> */}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Update Status</CardTitle>
                                <CardDescription>Change the current status of this complaint</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Select value={status} onValueChange={setStatus} disabled={isProcessing}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                        <SelectItem value="resolved">Resolved</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Button className="w-full" onClick={handleUpdateStatus} disabled={status === complaint.status || isProcessing}>
                                    Update Status
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="outline" size="sm" className="w-full" asChild>
                                    {/* <Link href={route('admin.complaints.print', complaint.id)} target="_blank">
                                        Print Complaint
                                    </Link> */}
                                </Button>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm" className="w-full">
                                            Delete Complaint
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete the complaint and remove the data from our
                                                servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => {
                                                    setIsProcessing(true);
                                                    router.delete(route('admin.complaints.destroy', complaint.id), {
                                                        onSuccess: () => {
                                                            toast({
                                                                title: 'Complaint deleted',
                                                                description: 'The complaint has been permanently deleted',
                                                                variant: 'success',
                                                            });
                                                        },
                                                        onError: () => {
                                                            toast({
                                                                title: 'Error',
                                                                description: 'Failed to delete complaint. Please try again.',
                                                                variant: 'destructive',
                                                            });
                                                            setIsProcessing(false);
                                                        },
                                                    });
                                                }}
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
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
                                                <div className="text-sm font-medium">Last Updated</div>
                                                <div className="text-muted-foreground text-xs">
                                                    {new Date(complaint.updated_at).toLocaleDateString()} at{' '}
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
                                                <div className="text-sm font-medium">Response Sent</div>
                                                <div className="text-muted-foreground text-xs">
                                                    {new Date(complaint.updated_at).toLocaleDateString()} at{' '}
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
