<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ComplaintReportController extends Controller
{
    public function index(Request $request)
    {
        $dateRange = $request->input('dateRange', 'week');

        // Menentukan tanggal awal berdasarkan filter
        $startDate = $this->getStartDate($dateRange);

        // Statistik dasar
        $totalComplaints = Complaint::count();
        $resolvedComplaints = Complaint::where('status', 'resolved')->count();
        $inProgressComplaints = Complaint::where('status', 'in_progress')->count();

        // Menghitung waktu respons rata-rata (dalam jam)
        $averageResponseTime = Complaint::whereNotNull('responded_at')
            ->select(DB::raw('AVG(TIMESTAMPDIFF(HOUR, created_at, responded_at)) as avg_response_time'))
            ->first();

        // Data untuk grafik kategori
        $categoryData = Complaint::select('category', DB::raw('count(*) as value'))
            ->groupBy('category')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $this->getCategoryName($item->category),
                    'value' => $item->value,
                    'key' => $item->category
                ];
            });

        // Data untuk grafik status
        $statusData = Complaint::select('status', DB::raw('count(*) as value'))
            ->groupBy('status')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $this->getStatusName($item->status),
                    'value' => $item->value,
                    'key' => $item->status
                ];
            });

        // Data untuk grafik waktu respons
        $responseTimeData = [
            ['name' => '< 24 jam', 'value' => Complaint::whereNotNull('responded_at')
                ->whereRaw('TIMESTAMPDIFF(HOUR, created_at, responded_at) < 24')
                ->count()],
            ['name' => '1-2 hari', 'value' => Complaint::whereNotNull('responded_at')
                ->whereRaw('TIMESTAMPDIFF(HOUR, created_at, responded_at) >= 24')
                ->whereRaw('TIMESTAMPDIFF(HOUR, created_at, responded_at) < 48')
                ->count()],
            ['name' => '3-5 hari', 'value' => Complaint::whereNotNull('responded_at')
                ->whereRaw('TIMESTAMPDIFF(HOUR, created_at, responded_at) >= 48')
                ->whereRaw('TIMESTAMPDIFF(HOUR, created_at, responded_at) < 120')
                ->count()],
            ['name' => '> 5 hari', 'value' => Complaint::whereNotNull('responded_at')
                ->whereRaw('TIMESTAMPDIFF(HOUR, created_at, responded_at) >= 120')
                ->count()]
        ];

        // Data untuk grafik tren bulanan
        $monthlyData = [];
        for ($i = 0; $i < 12; $i++) {
            $month = Carbon::now()->subMonths($i);
            $count = Complaint::whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->count();

            $monthlyData[] = [
                'name' => $month->format('M'),
                'total' => $count
            ];
        }
        $monthlyData = array_reverse($monthlyData);

        // Pengaduan terbaru
        $recentComplaints = Complaint::with('user')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($complaint) {
                return [
                    'id' => 'C-' . str_pad($complaint->id, 4, '0', STR_PAD_LEFT),
                    'title' => $complaint->title,
                    'category' => $complaint->category,
                    'categoryName' => $this->getCategoryName($complaint->category),
                    'date' => $complaint->created_at->format('Y-m-d'),
                    'status' => $complaint->status,
                    'statusName' => $this->getStatusName($complaint->status),
                    'response_time' => $complaint->responded_at
                        ? $this->calculateResponseTime($complaint->created_at, $complaint->responded_at)
                        : '-'
                ];
            });

        return Inertia::render('Admin/ComplaintReport', [
            'stats' => [
                'totalComplaints' => $totalComplaints,
                'resolvedComplaints' => $resolvedComplaints,
                'inProgressComplaints' => $inProgressComplaints,
                'averageResponseTime' => $averageResponseTime ? round($averageResponseTime->avg_response_time / 24, 1) : 0,
                'categoryData' => $categoryData,
                'statusData' => $statusData,
                'responseTimeData' => $responseTimeData,
                'monthlyData' => $monthlyData,
                'recentComplaints' => $recentComplaints,
                'dateRange' => $dateRange
            ]
        ]);
    }

    private function getStartDate($dateRange)
    {
        switch ($dateRange) {
            case 'week':
                return Carbon::now()->subDays(7);
            case 'month':
                return Carbon::now()->subDays(30);
            case 'quarter':
                return Carbon::now()->subMonths(3);
            case 'year':
                return Carbon::now()->subYear();
            default:
                return Carbon::now()->subDays(7);
        }
    }

    private function getCategoryName($category)
    {
        $categories = [
            'service' => 'Pelayanan',
            'facility' => 'Fasilitas',
            'staff' => 'Staff',
            'waiting' => 'Waktu Tunggu',
            'treatment' => 'Pengobatan',
            'other' => 'Lainnya'
        ];

        return $categories[$category] ?? $category;
    }

    private function getStatusName($status)
    {
        $statuses = [
            'pending' => 'Tertunda',
            'in_progress' => 'Dalam Proses',
            'resolved' => 'Selesai',
            'rejected' => 'Ditolak'
        ];

        return $statuses[$status] ?? $status;
    }

    private function calculateResponseTime($createdAt, $respondedAt)
    {
        $diff = $createdAt->diff($respondedAt);

        if ($diff->days > 0) {
            return $diff->days . ' hari ' . $diff->h . ' jam';
        } else {
            return $diff->h . ' jam ' . $diff->i . ' menit';
        }
    }
}
