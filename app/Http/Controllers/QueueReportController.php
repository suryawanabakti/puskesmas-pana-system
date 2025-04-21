<?php

namespace App\Http\Controllers;

use App\Models\Queue;
use App\Models\QueueSetting;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class QueueReportController extends Controller
{
    public function index(Request $request)
    {
        $dateRange = $request->input('dateRange', 'week');

        // Menentukan tanggal awal berdasarkan filter
        $startDate = $this->getStartDate($dateRange);

        // Statistik dasar
        $todayPatients = Queue::whereDate('created_at', Carbon::today())->count();
        $yesterdayPatients = Queue::whereDate('created_at', Carbon::yesterday())->count();
        $percentChange = $yesterdayPatients > 0
            ? round((($todayPatients - $yesterdayPatients) / $yesterdayPatients) * 100)
            : 0;

        // Antrian aktif
        $activeQueues = Queue::where('status', 'waiting')
            ->whereDate('created_at', Carbon::today())
            ->count();

        // Waktu tunggu rata-rata (dalam menit)

        // $averageWaitTime = Queue::whereNotNull('called_at')
        //     ->select(DB::raw('AVG(TIMESTAMPDIFF(MINUTE, created_at, called_at)) as avg_wait_time'))
        //     ->first();
        // Ganti dengan kode yang kompatibel dengan SQLite
        $averageWaitTime = Queue::whereNotNull('called_at')
            ->select(DB::raw('AVG((julianday(called_at) - julianday(created_at)) * 24 * 60) as avg_wait_time'))
            ->first();

        // Poli tersibuk (asumsi ada kolom poli_id di tabel queues)
        // Karena tidak ada di migrasi, kita buat data dummy
        $busiestPoli = 'Poli Umum';

        // Data untuk grafik per jam
        $hourlyData = [];
        for ($i = 8; $i <= 16; $i++) {
            $hour = str_pad($i, 2, '0', STR_PAD_LEFT) . ':00';
            $count = Queue::whereDate('created_at', Carbon::today())
                ->whereRaw("CAST(strftime('%H', created_at) AS INTEGER) = $i")
                ->count();

            $hourlyData[] = [
                'name' => $hour,
                'total' => $count
            ];
        }

        // Data untuk grafik mingguan
        $weeklyData = [];
        $dayNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

        for ($i = 0; $i < 7; $i++) {
            $day = Carbon::now()->startOfWeek()->addDays($i);
            $count = Queue::whereDate('created_at', $day)->count();

            $weeklyData[] = [
                'name' => $dayNames[$i],
                'total' => $count
            ];
        }

        // Data untuk grafik distribusi poli
        // Karena tidak ada di migrasi, kita buat data dummy
        $poliData = [
            ['name' => 'Poli Umum', 'value' => 45],
            ['name' => 'Poli Gigi', 'value' => 20],
            ['name' => 'Poli KIA', 'value' => 25],
            ['name' => 'Poli Mata', 'value' => 10],
        ];

        // Data untuk grafik waktu tunggu per poli
        // Karena tidak ada di migrasi, kita buat data dummy
        $waitTimeData = [
            ['name' => 'Poli Umum', 'value' => 25],
            ['name' => 'Poli Gigi', 'value' => 35],
            ['name' => 'Poli KIA', 'value' => 15],
            ['name' => 'Poli Mata', 'value' => 40],
        ];

        // Antrian terbaru
        $recentQueues = Queue::with('user')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($queue) {
                return [
                    'id' => 'Q-' . str_pad($queue->id, 4, '0', STR_PAD_LEFT),
                    'number' => $queue->number,
                    'patient' => $queue->user->name ?? 'Pasien',
                    'created_at' => $queue->created_at->format('H:i'),
                    'called_at' => $queue->called_at ? Carbon::parse($queue->called_at)->format('H:i') : null,
                    'completed_at' => $queue->completed_at ? Carbon::parse($queue->completed_at)->format('H:i') : null,
                    'status' => $queue->status,
                    'statusName' => $this->getStatusName($queue->status),
                    'waitTime' => $queue->called_at
                        ? $this->calculateTimeDiff($queue->created_at, $queue->called_at)
                        : '-',
                    'serviceTime' => ($queue->called_at && $queue->completed_at)
                        ? $this->calculateTimeDiff($queue->called_at, $queue->completed_at)
                        : '-',
                ];
            });

        // Pengaturan antrian hari ini
        $queueSettings = QueueSetting::whereDate('date', Carbon::today())->first();

        return Inertia::render('Admin/QueueReport', [
            'stats' => [
                'todayPatients' => $todayPatients,
                'percentChange' => $percentChange,
                'activeQueues' => $activeQueues,
                'averageWaitTime' => $averageWaitTime ? round($averageWaitTime->avg_wait_time) : 0,
                'busiestPoli' => $busiestPoli,
                'hourlyData' => $hourlyData,
                'weeklyData' => $weeklyData,
                'poliData' => $poliData,
                'waitTimeData' => $waitTimeData,
                'recentQueues' => $recentQueues,
                'queueSettings' => $queueSettings ? [
                    'status' => $queueSettings->status,
                    'startTime' => $queueSettings->start_time->format('H:i:s'),
                    'endTime' => $queueSettings->end_time->format('H:i:s'),
                    'averageServiceTime' => $queueSettings->average_service_time,
                ] : [
                    'status' => 'closed',
                    'startTime' => '08:00:00',
                    'endTime' => '16:00:00',
                    'averageServiceTime' => 15,
                ],
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

    private function getStatusName($status)
    {
        $statuses = [
            'waiting' => 'Menunggu',
            'serving' => 'Dilayani',
            'completed' => 'Selesai',
            'cancelled' => 'Dibatalkan'
        ];

        return $statuses[$status] ?? $status;
    }

    private function calculateTimeDiff($startTime, $endTime)
    {
        $start = Carbon::parse($startTime);
        $end = Carbon::parse($endTime);

        $diffInMinutes = $start->diffInMinutes($end);

        return  number_format($diffInMinutes, 2) . ' menit';
    }
}
