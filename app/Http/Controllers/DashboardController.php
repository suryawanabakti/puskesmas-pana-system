<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use App\Models\Queue;
use App\Models\QueueSetting;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Get current queue settings
        $queueSetting = QueueSetting::where('date', Carbon::today()->toDateString())->first();
        $currentNumber = $queueSetting ? $queueSetting->current_number : null;

        // Get queue count
        $queueCount = Queue::where('status', 'waiting')
            ->whereDate('created_at', Carbon::today())
            ->count();

        // Get user's queue if exists
        $userQueue = Queue::where('user_id', $user->id)
            ->whereDate('created_at', Carbon::today())
            ->whereIn('status', ['waiting', 'serving'])
            ->first();

        $userNumber = $userQueue ? $userQueue->number : null;

        // Calculate estimated time
        $estimatedTime = null;
        if ($userNumber && $currentNumber) {
            $peopleAhead = $userNumber - $currentNumber;
            if ($peopleAhead > 0) {
                $avgTime = $queueSetting ? $queueSetting->average_service_time : 15; // default 15 minutes
                $waitMinutes = $peopleAhead * $avgTime;

                if ($waitMinutes < 60) {
                    $estimatedTime = $waitMinutes . ' minutes';
                } else {
                    $hours = floor($waitMinutes / 60);
                    $minutes = $waitMinutes % 60;
                    $estimatedTime = $hours . ' hour' . ($hours > 1 ? 's' : '') .
                        ($minutes > 0 ? ' ' . $minutes . ' minute' . ($minutes > 1 ? 's' : '') : '');
                }
            } else {
                $estimatedTime = 'You are next';
            }
        }

        return Inertia::render('Patient/Dashboard', [
            'queueCount' => $queueCount,
            'currentNumber' => $currentNumber,
            'userNumber' => $userNumber,
            'estimatedTime' => $estimatedTime,
        ]);
    }

    public function dashboardKepala()
    {
        // Get today's date
        $today = Carbon::today()->toDateString();

        // Get current queue settings
        $queueSetting = QueueSetting::where('date', $today)->first();

        // If no queue settings exist for today, create a default one
        if (!$queueSetting) {
            $queueSetting = QueueSetting::create([
                'current_number' => 0,
                'status' => 'closed',
                'start_time' => '08:00:00',
                'end_time' => '16:00:00',
                'average_service_time' => 15,
                'date' => $today,
            ]);
        }

        // Calculate statistics
        $stats = [
            'totalUsers' => User::count(),
            'patientCount' => User::where('role', 'patient')->count(),
            'totalComplaints' => Complaint::count(),
            'resolvedComplaints' => Complaint::where('status', 'resolved')->count(),
            'pendingComplaints' => Complaint::whereIn('status', ['pending', 'in_progress'])->count(),
            'waitingQueueCount' => Queue::where('status', 'waiting')
                ->whereDate('created_at', $today)
                ->count(),
            'averageServiceTime' => $queueSetting->average_service_time,
            'todayQueueCount' => Queue::whereDate('created_at', $today)->count(),
        ];

        // Get recent users
        $recentUsers = User::latest()
            ->take(5)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'nik' => $user->nik,
                    'phone' => $user->phone,
                    'address' => $user->address,
                    'gender' => $user->gender,
                    'birthdate' => $user->birthdate,
                    'role' => $user->role,
                    'created_at' => $user->created_at->format('Y-m-d'),
                ];
            });

        // Get recent complaints with user relationship
        $recentComplaints = Complaint::with('user')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($complaint) {
                return [
                    'id' => $complaint->id,
                    'user_id' => $complaint->user_id,
                    'title' => $complaint->title,
                    'category' => $complaint->category,
                    'description' => $complaint->description,
                    'attachment' => $complaint->attachment,
                    'status' => $complaint->status,
                    'response' => $complaint->response,
                    'responded_by' => $complaint->responded_by,
                    'responded_at' => $complaint->responded_at ? Carbon::parse($complaint->responded_at)->format('Y-m-d') : null,
                    'created_at' => $complaint->created_at->format('Y-m-d'),
                    'user' => [
                        'id' => $complaint->user->id,
                        'name' => $complaint->user->name,
                        'email' => $complaint->user->email,
                        'nik' => $complaint->user->nik,
                        'phone' => $complaint->user->phone,
                        'address' => $complaint->user->address,
                        'gender' => $complaint->user->gender,
                        'birthdate' => $complaint->user->birthdate,
                        'role' => $complaint->user->role,
                        'created_at' => $complaint->user->created_at->format('Y-m-d'),
                    ],
                ];
            });

        // Get active queues for today
        $activeQueues = Queue::with('user')
            ->whereDate('created_at', $today)
            ->whereIn('status', ['waiting', 'serving'])
            ->orderBy('number')
            ->take(10)
            ->get()
            ->map(function ($queue) {
                return [
                    'id' => $queue->id,
                    'number' => $queue->number,
                    'user_id' => $queue->user_id,
                    'status' => $queue->status,
                    'called_at' => $queue->called_at ? Carbon::parse($queue->called_at)->format('Y-m-d H:i:s') : null,
                    'completed_at' => $queue->completed_at ? Carbon::parse($queue->completed_at)->format('Y-m-d H:i:s') : null,
                    'created_at' => $queue->created_at->format('Y-m-d H:i:s'),
                    'user' => [
                        'id' => $queue->user->id,
                        'name' => $queue->user->name,
                        'email' => $queue->user->email,
                        'nik' => $queue->user->nik,
                        'phone' => $queue->user->phone,
                        'address' => $queue->user->address,
                        'gender' => $queue->user->gender,
                        'birthdate' => $queue->user->birthdate,
                        'role' => $queue->user->role,
                        'created_at' => $queue->user->created_at->format('Y-m-d'),
                    ],
                ];
            });

        // Format queue settings for frontend
        $formattedQueueSetting = [
            'id' => $queueSetting->id,
            'current_number' => $queueSetting->current_number,
            'status' => $queueSetting->status,
            'start_time' => $queueSetting->start_time,
            'end_time' => $queueSetting->end_time,
            'average_service_time' => $queueSetting->average_service_time,
            'date' => $queueSetting->date,
        ];

        return Inertia::render('dashboard-kepala', [
            'stats' => $stats,
            'recentUsers' => $recentUsers,
            'recentComplaints' => $recentComplaints,
            'queueStatus' => $formattedQueueSetting,
            'activeQueues' => $activeQueues,
        ]);
    }
}
