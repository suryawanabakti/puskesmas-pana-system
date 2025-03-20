<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use App\Models\Queue;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // Get statistics for dashboard
        $stats = [
            'totalPatients' => User::where('role', 'patient')->count(),
            'todayPatients' => Queue::whereDate('created_at', Carbon::today())
                ->distinct('user_id')
                ->count('user_id'),
            'activeQueue' => Queue::where('status', 'waiting')
                ->whereDate('created_at', Carbon::today())
                ->count(),
            'pendingComplaints' => Complaint::where('status', 'pending')->count(),
            'dailyStats' => $this->getDailyStats(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
        ]);
    }

    private function getDailyStats()
    {
        $stats = [];

        // Get patient counts for the last 7 days
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);

            $stats[] = [
                'date' => $date->format('Y-m-d'),
                'count' => Queue::whereDate('created_at', $date)
                    ->distinct('user_id')
                    ->count('user_id'),
            ];
        }

        return $stats;
    }
}
