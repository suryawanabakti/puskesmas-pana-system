<?php

namespace App\Http\Controllers;

use App\Models\Queue;
use App\Models\QueueSetting;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QueueController extends Controller
{
    public function view(Request $request)
    {
        $user = $request->user();

        // Get current queue settings
        $queueSetting = QueueSetting::whereDate('date', Carbon::today()->toDateString())->first();

        // Get user's queue if exists
        $userQueue = Queue::where('user_id', $user->id)
            ->whereDate('created_at', Carbon::today())
            ->whereIn('status', ['waiting', 'serving'])
            ->first();

        // Calculate estimated wait time
        $estimatedWaitTime = null;
        if ($userQueue && $queueSetting && $queueSetting->current_number) {
            $peopleAhead = $userQueue->number - $queueSetting->current_number;
            if ($peopleAhead > 0) {
                $avgTime = $queueSetting->average_service_time;
                $waitMinutes = $peopleAhead * $avgTime;

                if ($waitMinutes < 60) {
                    $estimatedWaitTime = $waitMinutes . ' minutes';
                } else {
                    $hours = floor($waitMinutes / 60);
                    $minutes = $waitMinutes % 60;
                    $estimatedWaitTime = $hours . ' hour' . ($hours > 1 ? 's' : '') .
                        ($minutes > 0 ? ' ' . $minutes . ' minute' . ($minutes > 1 ? 's' : '') : '');
                }
            } else {
                $estimatedWaitTime = 'You are next';
            }
        }

        $queueData = [
            'currentNumber' => $queueSetting ? $queueSetting->current_number : 0,
            'totalWaiting' => Queue::where('status', 'waiting')
                ->whereDate('created_at', Carbon::today())
                ->count(),
            'userNumber' => $userQueue ? $userQueue->number : null,
            'estimatedWaitTime' => $estimatedWaitTime,
            'queueStatus' => $queueSetting ? $queueSetting->status : 'closed',
            'lastUpdated' => $queueSetting ? $queueSetting->updated_at->format('H:i') : Carbon::now()->format('H:i'),
        ];

        return Inertia::render('Patient/Queue/View', [
            'queueData' => $queueData,
        ]);
    }

    public function take(Request $request)
    {
        $user = $request->user();

        // Check if user already has an active queue
        $existingQueue = Queue::where('user_id', $user->id)
            ->whereDate('created_at', Carbon::today())
            ->whereIn('status', ['waiting', 'serving'])
            ->first();

        if ($existingQueue) {
            return redirect()->route('queue.view')->with('error', 'You already have an active queue number.');
        }

        // Get or create today's queue settings
        $queueSetting = QueueSetting::firstOrCreate(
            ['date' => Carbon::today()->toDateString()],
            [
                'status' => 'active',
                'start_time' => '08:00:00',
                'end_time' => '16:00:00',
                'average_service_time' => 15,
            ]
        );

        // Check if queue is active
        if ($queueSetting->status === 'closed') {
            return redirect()->route('queue.view')->with('error', 'Queue is currently closed.');
        }

        // Get the last queue number for today
        $lastQueue = Queue::whereDate('created_at', Carbon::today())
            ->orderBy('number', 'desc')
            ->first();

        $nextNumber = $lastQueue ? $lastQueue->number + 1 : 1;

        // Create new queue
        Queue::create([
            'number' => $nextNumber,
            'user_id' => $user->id,
            'status' => 'waiting',
        ]);

        return redirect()->route('queue.view')->with('success', 'Queue number taken successfully.');
    }
}
