// resources/js/Pages/Patient/Complaint/Create.tsx
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
        title: 'Dashboard',
        href: route('dashboard'),
    },
    {
        title: 'Complaints',
        href: route('complaints.index'),
    },
    {
        title: 'Submit Complaint',
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
                        title: 'Complaint submitted',
                        description: 'Your complaint has been submitted successfully',
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
            <Head title="Submit Complaint" />
            <div className="container mx-auto">
                <Card className="mx-auto max-w-2xl">
                    <CardHeader>
                        <CardTitle>Submit a Complaint</CardTitle>
                        <CardDescription>Please provide details about your complaint or suggestion</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Complaint Title</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Brief title of your complaint"
                                    required
                                />
                                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select value={data.category} onValueChange={(value) => setData('category', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="service">Service Quality</SelectItem>
                                        <SelectItem value="facility">Facility</SelectItem>
                                        <SelectItem value="staff">Staff Behavior</SelectItem>
                                        <SelectItem value="waiting">Waiting Time</SelectItem>
                                        <SelectItem value="treatment">Treatment</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Please provide detailed information about your complaint"
                                    rows={5}
                                    required
                                />
                                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="attachment">Attachment (Optional)</Label>
                                <Input id="attachment" type="file" onChange={handleFileChange} accept="image/*,.pdf,.doc,.docx" />
                                <p className="text-xs text-gray-500">You can attach photos or documents related to your complaint (Max 5MB)</p>
                                {errors.attachment && <p className="text-sm text-red-500">{errors.attachment}</p>}
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <Button type="button" variant="outline" onClick={() => reset()}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    Submit Complaint
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
