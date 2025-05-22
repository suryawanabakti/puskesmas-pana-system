"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem } from "@/types"
import { Head, router } from "@inertiajs/react"
import {
  BarChart3,
  CalendarClock,
  FileText,
  Users,
  UserCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react"

interface User {
  id: number
  name: string
  email: string
  nik: string
  phone: string
  address: string
  gender: "male" | "female"
  birthdate: string
  role: "patient" | "admin" | "kepala"
  created_at: string
}

interface Complaint {
  id: number
  user_id: number
  title: string
  category: "service" | "facility" | "staff" | "waiting" | "treatment" | "other"
  description: string
  attachment: string | null
  status: "pending" | "in_progress" | "resolved" | "rejected"
  response: string | null
  responded_by: number | null
  responded_at: string | null
  created_at: string
  user: User
}

interface Queue {
  id: number
  number: number
  user_id: number
  status: "waiting" | "serving" | "completed" | "cancelled"
  called_at: string | null
  completed_at: string | null
  created_at: string
  user: User
}

interface QueueSetting {
  id: number
  current_number: number | null
  status: "active" | "paused" | "closed"
  start_time: string
  end_time: string
  average_service_time: number
  date: string
}

interface DashboardProps {
  stats: {
    totalUsers: number
    patientCount: number
    totalComplaints: number
    resolvedComplaints: number
    pendingComplaints: number
    waitingQueueCount: number
    averageServiceTime: number
    todayQueueCount: number
  }
  recentUsers: User[]
  recentComplaints: Complaint[]
  queueStatus: QueueSetting
  activeQueues: Queue[]
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Dashboard",
    href: route("dashboard"),
  },
]

// This would be replaced with actual data from your backend
const mockData: DashboardProps = {
  stats: {
    totalUsers: 1248,
    patientCount: 1205,
    totalComplaints: 156,
    resolvedComplaints: 124,
    pendingComplaints: 32,
    waitingQueueCount: 15,
    averageServiceTime: 12,
    todayQueueCount: 45,
  },
  recentUsers: [
    {
      id: 1,
      name: "Budi Santoso",
      email: "budi@example.com",
      nik: "3201234567890001",
      phone: "081234567890",
      address: "Jl. Merdeka No. 123, Jakarta",
      gender: "male",
      birthdate: "1990-05-15",
      role: "patient",
      created_at: "2023-05-15",
    },
    {
      id: 2,
      name: "Siti Rahayu",
      email: "siti@example.com",
      nik: "3201234567890002",
      phone: "081234567891",
      address: "Jl. Sudirman No. 45, Jakarta",
      gender: "female",
      birthdate: "1985-08-20",
      role: "patient",
      created_at: "2023-05-14",
    },
    {
      id: 3,
      name: "Ahmad Hidayat",
      email: "ahmad@example.com",
      nik: "3201234567890003",
      phone: "081234567892",
      address: "Jl. Gatot Subroto No. 67, Jakarta",
      gender: "male",
      birthdate: "1992-03-10",
      role: "admin",
      created_at: "2023-05-13",
    },
    {
      id: 4,
      name: "Dewi Putri",
      email: "dewi@example.com",
      nik: "3201234567890004",
      phone: "081234567893",
      address: "Jl. Thamrin No. 89, Jakarta",
      gender: "female",
      birthdate: "1988-11-25",
      role: "patient",
      created_at: "2023-05-12",
    },
  ],
  recentComplaints: [
    {
      id: 101,
      user_id: 1,
      title: "Layanan lambat di loket 3",
      category: "service",
      description: "Saya menunggu terlalu lama untuk dilayani di loket 3",
      attachment: null,
      status: "resolved",
      response: "Kami telah menambah petugas di loket 3",
      responded_by: 3,
      responded_at: "2023-05-16",
      created_at: "2023-05-15",
      user: {
        id: 1,
        name: "Budi Santoso",
        email: "budi@example.com",
        nik: "3201234567890001",
        phone: "081234567890",
        address: "Jl. Merdeka No. 123, Jakarta",
        gender: "male",
        birthdate: "1990-05-15",
        role: "patient",
        created_at: "2023-05-15",
      },
    },
    {
      id: 102,
      user_id: 2,
      title: "Sistem antrean tidak berfungsi",
      category: "facility",
      description: "Layar display antrean tidak menampilkan nomor yang benar",
      attachment: null,
      status: "in_progress",
      response: null,
      responded_by: null,
      responded_at: null,
      created_at: "2023-05-15",
      user: {
        id: 2,
        name: "Siti Rahayu",
        email: "siti@example.com",
        nik: "3201234567890002",
        phone: "081234567891",
        address: "Jl. Sudirman No. 45, Jakarta",
        gender: "female",
        birthdate: "1985-08-20",
        role: "patient",
        created_at: "2023-05-14",
      },
    },
    {
      id: 103,
      user_id: 4,
      title: "Dokumen hilang setelah diproses",
      category: "service",
      description: "Dokumen KTP saya hilang setelah diserahkan ke petugas",
      attachment: null,
      status: "pending",
      response: null,
      responded_by: null,
      responded_at: null,
      created_at: "2023-05-14",
      user: {
        id: 4,
        name: "Dewi Putri",
        email: "dewi@example.com",
        nik: "3201234567890004",
        phone: "081234567893",
        address: "Jl. Thamrin No. 89, Jakarta",
        gender: "female",
        birthdate: "1988-11-25",
        role: "patient",
        created_at: "2023-05-12",
      },
    },
    {
      id: 104,
      user_id: 1,
      title: "Staf tidak ramah saat melayani",
      category: "staff",
      description: "Petugas di loket 2 berbicara dengan nada tinggi",
      attachment: null,
      status: "rejected",
      response: "Setelah kami periksa, petugas sudah sesuai SOP",
      responded_by: 3,
      responded_at: "2023-05-14",
      created_at: "2023-05-13",
      user: {
        id: 1,
        name: "Budi Santoso",
        email: "budi@example.com",
        nik: "3201234567890001",
        phone: "081234567890",
        address: "Jl. Merdeka No. 123, Jakarta",
        gender: "male",
        birthdate: "1990-05-15",
        role: "patient",
        created_at: "2023-05-15",
      },
    },
  ],
  queueStatus: {
    id: 1,
    current_number: 23,
    status: "active",
    start_time: "08:00:00",
    end_time: "16:00:00",
    average_service_time: 15,
    date: "2023-05-17",
  },
  activeQueues: [
    {
      id: 201,
      number: 23,
      user_id: 1,
      status: "serving",
      called_at: "2023-05-17 10:15:00",
      completed_at: null,
      created_at: "2023-05-17 09:30:00",
      user: {
        id: 1,
        name: "Budi Santoso",
        email: "budi@example.com",
        nik: "3201234567890001",
        phone: "081234567890",
        address: "Jl. Merdeka No. 123, Jakarta",
        gender: "male",
        birthdate: "1990-05-15",
        role: "patient",
        created_at: "2023-05-15",
      },
    },
    {
      id: 202,
      number: 24,
      user_id: 2,
      status: "waiting",
      called_at: null,
      completed_at: null,
      created_at: "2023-05-17 09:35:00",
      user: {
        id: 2,
        name: "Siti Rahayu",
        email: "siti@example.com",
        nik: "3201234567890002",
        phone: "081234567891",
        address: "Jl. Sudirman No. 45, Jakarta",
        gender: "female",
        birthdate: "1985-08-20",
        role: "patient",
        created_at: "2023-05-14",
      },
    },
    {
      id: 203,
      number: 25,
      user_id: 4,
      status: "waiting",
      called_at: null,
      completed_at: null,
      created_at: "2023-05-17 09:40:00",
      user: {
        id: 4,
        name: "Dewi Putri",
        email: "dewi@example.com",
        nik: "3201234567890004",
        phone: "081234567893",
        address: "Jl. Thamrin No. 89, Jakarta",
        gender: "female",
        birthdate: "1988-11-25",
        role: "patient",
        created_at: "2023-05-12",
      },
    },
  ],
}

export default function DashboardKepala({
  stats = mockData.stats,
  recentUsers = mockData.recentUsers,
  recentComplaints = mockData.recentComplaints,
  queueStatus = mockData.queueStatus,
  activeQueues = mockData.activeQueues,
}: Partial<DashboardProps> = {}) {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "resolved":
        return "Selesai"
      case "in_progress":
        return "Diproses"
      case "pending":
        return "Menunggu"
      case "rejected":
        return "Ditolak"
      default:
        return status
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard Kepala" />
      <div className="container mx-auto p-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Dashboard Kepala</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => router.get("/admin/reports/queue")}>
                <FileText className="mr-2 h-4 w-4" />
                Laporan Antrian
              </Button>
              <Button size="sm" variant="outline" onClick={() => router.get("/admin/complaints")}>
              <FileText className="mr-2 h-4 w-4" />
              Laporan Keluhan
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +2.5%
                  </span>{" "}
                  dari bulan lalu
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Keluhan</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalComplaints}</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-green-500 flex items-center">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {stats.resolvedComplaints} selesai
                  </span>
                  <span className="text-yellow-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {stats.pendingComplaints} menunggu
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Antrean Saat Ini</CardTitle>
                <CalendarClock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.waitingQueueCount}</div>
                <p className="text-xs text-muted-foreground">
                  Rata-rata waktu layanan: {stats.averageServiceTime} menit
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pasien</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.patientCount}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +1.2%
                  </span>{" "}
                  dari minggu lalu
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Queue Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status Antrean</CardTitle>
              <CardDescription>
                Status:{" "}
                {queueStatus.status === "active" ? "Aktif" : queueStatus.status === "paused" ? "Dijeda" : "Tutup"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-4">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground">Nomor Saat Ini</span>
                  <span className="text-3xl font-bold">{queueStatus.current_number || "-"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground">Jam Operasional</span>
                  <span className="text-xl font-bold">
                    {queueStatus.start_time.substring(0, 5)} - {queueStatus.end_time.substring(0, 5)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground">Rata-rata Waktu Layanan</span>
                  <span className="text-3xl font-bold">{queueStatus.average_service_time} menit</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground">Tanggal</span>
                  <span className="text-xl font-bold">{queueStatus.date}</span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Antrean Aktif</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nomor</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Waktu Daftar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeQueues.map((queue) => (
                      <TableRow key={queue.id}>
                        <TableCell className="font-medium">{queue.number}</TableCell>
                        <TableCell>{queue.user.name}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              queue.status === "waiting"
                                ? "bg-yellow-100 text-yellow-800"
                                : queue.status === "serving"
                                  ? "bg-blue-100 text-blue-800"
                                  : queue.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                            }`}
                          >
                            {queue.status === "waiting"
                              ? "Menunggu"
                              : queue.status === "serving"
                                ? "Dilayani"
                                : queue.status === "completed"
                                  ? "Selesai"
                                  : "Dibatalkan"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(queue.created_at).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Recent Complaints */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Keluhan Terbaru</CardTitle>
                <CardDescription>Daftar keluhan yang baru masuk</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Judul</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tanggal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentComplaints.map((complaint) => (
                      <TableRow key={complaint.id}>
                        <TableCell className="font-medium">{complaint.title}</TableCell>
                        <TableCell>
                          {complaint.category === "service"
                            ? "Layanan"
                            : complaint.category === "facility"
                              ? "Fasilitas"
                              : complaint.category === "staff"
                                ? "Staf"
                                : complaint.category === "waiting"
                                  ? "Waktu Tunggu"
                                  : complaint.category === "treatment"
                                    ? "Perawatan"
                                    : "Lainnya"}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(complaint.status)}`}>
                            {getStatusText(complaint.status)}
                          </span>
                        </TableCell>
                        <TableCell>{complaint.created_at}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 flex justify-center">
                  <Button variant="outline" size="sm" onClick={() => router.visit("/admin/complaints")}>
                    Lihat Semua Keluhan
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Users */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Pengguna Terbaru</CardTitle>
                <CardDescription>Daftar pengguna yang baru terdaftar</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>NIK</TableHead>
                      <TableHead>Peran</TableHead>
                      <TableHead>Tanggal Daftar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.nik}</TableCell>
                        <TableCell>
                          {user.role === "patient" ? "Pasien" : user.role === "admin" ? "Admin" : "Kepala"}
                        </TableCell>
                        <TableCell>{user.created_at}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
               
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
