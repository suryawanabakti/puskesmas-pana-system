<?php

namespace App\Http\Controllers;

use App\Models\Queue;
use App\Models\QueueSetting;
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
}
