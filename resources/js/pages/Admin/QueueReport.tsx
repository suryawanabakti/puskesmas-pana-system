'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Calendar, ChevronDown, Download, FileText, Filter, Printer, RefreshCw, Search } from 'lucide-react';
import { useRef, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function QueueReport({ stats }) {
    const [dateRange, setDateRange] = useState(stats.dateRange || 'week');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPoli, setSelectedPoli] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const printRef = useRef(null);

    const breadcrumbs = [
        {
            title: 'Admin',
            href: route('admin.dashboard'),
        },
        {
            title: 'Laporan',
            href: route('admin.reports'),
        },
        {
            title: 'Laporan Antrian',
            href: route('admin.reports.queue'),
        },
    ];

    // Colors for charts
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    const STATUS_COLORS = {
        Selesai: '#4ade80',
        Dilayani: '#facc15',
        Menunggu: '#94a3b8',
        Dibatalkan: '#f87171',
    };

    const handleDateRangeChange = (value) => {
        setDateRange(value);
        setIsLoading(true);
        // Simulasi loading
        setTimeout(() => {
            setIsLoading(false);
        }, 800);
        // In a real app, you would reload the data with the new date range
        // window.location.href = route('admin.reports.queue', { dateRange: value })
    };

    const handleRefresh = () => {
        setIsLoading(true);
        // Simulasi loading
        setTimeout(() => {
            setIsLoading(false);
        }, 800);
        // In a real app, you would reload the data
    };

    const handlePrint = () => {
        if (printRef.current) {
            const printContents = printRef.current.innerHTML;
            const originalContents = document.body.innerHTML;
            document.body.innerHTML = `
        <html>
          <head>
            <title>Laporan Antrian - Puskesmas Pana</title>
            <style>
              body { font-family: Arial, sans-serif; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h1>Laporan Antrian - Puskesmas Pana</h1>
            ${printContents}
          </body>
        </html>
      `;
            window.print();
            document.body.innerHTML = originalContents;
        }
    };

    const handleExport = (format) => {
        // In a real app, you would implement export functionality
        alert(`Mengekspor laporan dalam format ${format}`);
    };

    const filteredQueues = stats.recentQueues.filter((queue) => {
        const matchesSearch =
            queue.patient.toLowerCase().includes(searchQuery.toLowerCase()) || queue.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPoli = selectedPoli === 'all' || true; // Assume all match since we don't have poli data
        const matchesStatus = selectedStatus === 'all' || queue.status === selectedStatus;

        return matchesSearch && matchesPoli && matchesStatus;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Antrian - Puskesmas Pana" />
            <div className="container mx-auto">
                <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Laporan Antrian</h1>
                        <p className="text-muted-foreground">Analisis dan statistik manajemen antrian</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>Filter Tanggal</span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-4" align="end">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <h4 className="font-medium">Rentang Tanggal</h4>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-col gap-1">
                                                <Label htmlFor="start-date">Tanggal Mulai</Label>
                                                <DatePicker date={startDate} setDate={setStartDate} />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <Label htmlFor="end-date">Tanggal Akhir</Label>
                                                <DatePicker date={endDate} setDate={setEndDate} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                // Apply date filter
                                                setIsLoading(true);
                                                setTimeout(() => setIsLoading(false), 800);
                                            }}
                                        >
                                            Terapkan Filter
                                        </Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="flex items-center gap-2">
                                    <Printer className="h-4 w-4" />
                                    <span>Cetak</span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-48" align="end">
                                <div className="space-y-2">
                                    <Button variant="ghost" className="w-full justify-start" onClick={handlePrint}>
                                        <Printer className="mr-2 h-4 w-4" />
                                        <span>Cetak Laporan</span>
                                    </Button>
                                    <Button variant="ghost" className="w-full justify-start" onClick={() => handleExport('pdf')}>
                                        <FileText className="mr-2 h-4 w-4" />
                                        <span>Ekspor PDF</span>
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="flex items-center gap-2">
                                    <Download className="h-4 w-4" />
                                    <span>Ekspor</span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-48" align="end">
                                <div className="space-y-2">
                                    <Button variant="ghost" className="w-full justify-start" onClick={() => handleExport('excel')}>
                                        <Download className="mr-2 h-4 w-4" />
                                        <span>Ekspor Excel</span>
                                    </Button>
                                    <Button variant="ghost" className="w-full justify-start" onClick={() => handleExport('csv')}>
                                        <Download className="mr-2 h-4 w-4" />
                                        <span>Ekspor CSV</span>
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>

                        <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={handleRefresh}>
                            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                            <span>Refresh</span>
                        </Button>
                    </div>
                </div>

                <div ref={printRef}>
                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Total Pasien Hari Ini</CardDescription>
                                <CardTitle className="text-3xl">{stats.todayPatients}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-muted-foreground flex items-center text-sm">
                                    <span>
                                        {stats.percentChange > 0 ? '+' : ''}
                                        {stats.percentChange}% dari kemarin
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Waktu Tunggu Rata-rata</CardDescription>
                                <CardTitle className="text-3xl">{stats.averageWaitTime} menit</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-muted-foreground flex items-center text-sm">
                                    <span>Berdasarkan antrian yang telah dipanggil</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Antrian Aktif</CardDescription>
                                <CardTitle className="text-3xl">{stats.activeQueues}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-muted-foreground flex items-center text-sm">
                                    <span>Sedang menunggu</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Poli Tersibuk</CardDescription>
                                <CardTitle className="text-3xl">{stats.busiestPoli}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-muted-foreground flex items-center text-sm">
                                    <span>Berdasarkan jumlah antrian</span>
                                </div>
                            </CardContent>
                        </Card> */}
                    </div>

                    <Tabs defaultValue="overview" className="mb-8">
                        <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                            <TabsList>
                                <TabsTrigger value="overview">Ikhtisar</TabsTrigger>
                                <TabsTrigger value="hourly">Per Jam</TabsTrigger>
                                <TabsTrigger value="weekly">Mingguan</TabsTrigger>
                            </TabsList>
                            <div className="flex items-center gap-2">
                                <Select value={dateRange} onValueChange={handleDateRangeChange} disabled={isLoading}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Pilih Rentang" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="week">7 Hari Terakhir</SelectItem>
                                        <SelectItem value="month">30 Hari Terakhir</SelectItem>
                                        <SelectItem value="quarter">3 Bulan Terakhir</SelectItem>
                                        <SelectItem value="year">1 Tahun Terakhir</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <TabsContent value="overview" className="space-y-6">
                            <Card>
                                <CardHeader className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                                    <div>
                                        <CardTitle>Antrian Terbaru</CardTitle>
                                        <CardDescription>Antrian terbaru hari ini</CardDescription>
                                    </div>
                                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                                        <div className="relative w-full sm:w-[250px]">
                                            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                                            <Input
                                                type="search"
                                                placeholder="Cari pasien atau ID..."
                                                className="pl-8"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" size="sm" className="flex items-center gap-2">
                                                    <Filter className="h-4 w-4" />
                                                    <span>Filter</span>
                                                    <ChevronDown className="h-4 w-4" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[200px]" align="end">
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <h4 className="font-medium">Status</h4>
                                                        <div className="space-y-1">
                                                            <div className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    id="status-all"
                                                                    checked={selectedStatus === 'all'}
                                                                    onCheckedChange={() => setSelectedStatus('all')}
                                                                />
                                                                <Label htmlFor="status-all">Semua</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    id="status-waiting"
                                                                    checked={selectedStatus === 'waiting'}
                                                                    onCheckedChange={() => setSelectedStatus('waiting')}
                                                                />
                                                                <Label htmlFor="status-waiting">Menunggu</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    id="status-serving"
                                                                    checked={selectedStatus === 'serving'}
                                                                    onCheckedChange={() => setSelectedStatus('serving')}
                                                                />
                                                                <Label htmlFor="status-serving">Dilayani</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    id="status-completed"
                                                                    checked={selectedStatus === 'completed'}
                                                                    onCheckedChange={() => setSelectedStatus('completed')}
                                                                />
                                                                <Label htmlFor="status-completed">Selesai</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    id="status-cancelled"
                                                                    checked={selectedStatus === 'cancelled'}
                                                                    onCheckedChange={() => setSelectedStatus('cancelled')}
                                                                />
                                                                <Label htmlFor="status-cancelled">Dibatalkan</Label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h4 className="font-medium">Poli</h4>
                                                        <Select value={selectedPoli} onValueChange={setSelectedPoli}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Pilih Poli" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="all">Semua Poli</SelectItem>
                                                                <SelectItem value="umum">Poli Umum</SelectItem>
                                                                <SelectItem value="gigi">Poli Gigi</SelectItem>
                                                                <SelectItem value="kia">Poli KIA</SelectItem>
                                                                <SelectItem value="mata">Poli Mata</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="py-3 text-left font-medium">Tanggal</th>
                                                    <th className="py-3 text-left font-medium">ID</th>
                                                    <th className="py-3 text-left font-medium">No.</th>
                                                    <th className="py-3 text-left font-medium">Pasien</th>
                                                    <th className="py-3 text-left font-medium">Waktu Daftar</th>
                                                    <th className="py-3 text-left font-medium">Waktu Tunggu</th>
                                                    <th className="py-3 text-left font-medium">Waktu Layanan</th>
                                                    <th className="py-3 text-left font-medium">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {isLoading ? (
                                                    Array(5)
                                                        .fill(0)
                                                        .map((_, index) => (
                                                            <tr key={index} className="border-b">
                                                                <td colSpan={7} className="py-3">
                                                                    <div className="h-6 animate-pulse rounded bg-gray-200"></div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                ) : filteredQueues.length > 0 ? (
                                                    filteredQueues.map((queue) => (
                                                        <tr key={queue.id} className="border-b hover:bg-gray-50">
                                                            <td className="py-3">{queue.tanggal}</td>
                                                            <td className="py-3">{queue.id}</td>
                                                            <td className="py-3">{queue.number}</td>
                                                            <td className="py-3">{queue.patient}</td>
                                                            <td className="py-3">{queue.created_at}</td>
                                                            <td className="py-3">{queue.waitTime}</td>
                                                            <td className="py-3">{queue.serviceTime}</td>
                                                            <td className="py-3">
                                                                <span
                                                                    className={`inline-block rounded-full px-2 py-1 text-xs ${
                                                                        queue.status === 'completed'
                                                                            ? 'bg-green-100 text-green-800'
                                                                            : queue.status === 'serving'
                                                                              ? 'bg-yellow-100 text-yellow-800'
                                                                              : queue.status === 'cancelled'
                                                                                ? 'bg-red-100 text-red-800'
                                                                                : 'bg-blue-100 text-blue-800'
                                                                    }`}
                                                                >
                                                                    {queue.statusName}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={7} className="text-muted-foreground py-6 text-center">
                                                            Tidak ada data antrian yang sesuai dengan filter
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <div className="text-muted-foreground text-sm">
                                        Menampilkan {filteredQueues.length} dari {stats.recentQueues.length} antrian
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" disabled>
                                            Sebelumnya
                                        </Button>
                                        <Button variant="outline" size="sm" disabled>
                                            Berikutnya
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        <TabsContent value="hourly">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Distribusi Antrian per Jam</CardTitle>
                                    <CardDescription>Jumlah pasien yang dilayani per jam</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[400px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart
                                                data={stats.hourlyData}
                                                margin={{
                                                    top: 20,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip formatter={(value) => [`${value} pasien`, 'Jumlah Pasien']} />
                                                <Legend />
                                                <Area
                                                    type="monotone"
                                                    dataKey="total"
                                                    name="Jumlah Pasien"
                                                    fill="#8884d8"
                                                    stroke="#8884d8"
                                                    activeDot={{ r: 8 }}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <div className="text-muted-foreground text-sm">Jam tersibuk: 10:00 dengan 25 pasien</div>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        <TabsContent value="weekly">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Distribusi Antrian per Hari</CardTitle>
                                    <CardDescription>Jumlah pasien yang dilayani per hari dalam seminggu</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[400px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={stats.weeklyData}
                                                margin={{
                                                    top: 20,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip formatter={(value) => [`${value} pasien`, 'Jumlah Pasien']} />
                                                <Legend />
                                                <Bar
                                                    dataKey="total"
                                                    name="Jumlah Pasien"
                                                    fill="#8884d8"
                                                    activeBar={{ stroke: '#4338ca', strokeWidth: 2 }}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <div className="text-muted-foreground text-sm">Hari tersibuk: Jumat dengan 85 pasien</div>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Pengaturan Antrian Hari Ini</CardTitle>
                            <CardDescription>Status dan konfigurasi antrian</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <div className="rounded-lg bg-gray-50 p-4">
                                    <p className="mb-1 text-sm text-gray-500">Status Antrian</p>
                                    <div className="flex items-center">
                                        <div
                                            className={`h-3 w-3 rounded-full ${
                                                stats.queueSettings.status === 'active'
                                                    ? 'bg-green-500'
                                                    : stats.queueSettings.status === 'paused'
                                                      ? 'bg-yellow-500'
                                                      : 'bg-red-500'
                                            } mr-2`}
                                        ></div>
                                        <p className="font-medium">
                                            {stats.queueSettings.status === 'active'
                                                ? 'Aktif'
                                                : stats.queueSettings.status === 'paused'
                                                  ? 'Dijeda'
                                                  : 'Tutup'}
                                        </p>
                                    </div>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-4">
                                    <p className="mb-1 text-sm text-gray-500">Jam Operasional</p>
                                    <p className="font-medium">
                                        {stats.queueSettings.startTime} - {stats.queueSettings.endTime}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-4">
                                    <p className="mb-1 text-sm text-gray-500">Rata-rata Waktu Layanan</p>
                                    <p className="font-medium">{stats.queueSettings.averageServiceTime} menit / pasien</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
