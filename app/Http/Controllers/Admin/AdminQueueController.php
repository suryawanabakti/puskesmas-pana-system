<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Queue;
use App\Models\QueueSetting;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminQueueController extends Controller
{
    public function manage()
    {
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

        // Get all queue items for today
        $queueItems = Queue::with('user')
            ->whereDate('created_at', Carbon::today())
            ->orderBy('number')
            ->get()
            ->map(function ($queue) {
                return [
                    'id' => $queue->id,
                    'number' => $queue->number,
                    'patient_name' => $queue->user->name,
                    'patient_id' => $queue->user_id,
                    'status' => $queue->status,
                    'created_at' => $queue->created_at->toDateTimeString(),
                    'estimated_time' => $this->calculateEstimatedTime($queue),
                ];
            });

        $currentQueue = [
            'number' => $queueSetting->current_number,
            'status' => $queueSetting->status,
        ];

        return Inertia::render('Admin/Queue/Manage', [
            'currentQueue' => $currentQueue,
            'queueItems' => $queueItems,
        ]);
    }

    public function next(Request $request)
    {

        // Get today's queue settings

        $queueSetting = QueueSetting::whereDate('date', Carbon::today()->toDateString())->first();

        if (!$queueSetting) {
            return redirect()->back()->with('error', 'Queue settings not found.');
        }

        // Get the next waiting queue
        $nextQueue = Queue::where('status', 'waiting')
            ->whereDate('created_at', Carbon::today())
            ->orderBy('number')
            ->first();

        if (!$nextQueue) {
            return redirect()->back()->with('error', 'No patients waiting in queue.');
        }

        // Update current queue if exists
        if ($queueSetting->current_number) {
            $currentQueue = Queue::where('number', $queueSetting->current_number)
                ->whereDate('created_at', Carbon::today())
                ->where('status', 'serving')
                ->first();

            if ($currentQueue) {
                $currentQueue->status = 'completed';
                $currentQueue->completed_at = Carbon::now();
                $currentQueue->save();
            }
        }

        // Update next queue
        $nextQueue->status = 'serving';
        $nextQueue->called_at = Carbon::now();
        $nextQueue->save();

        // Update queue settings
        $queueSetting->current_number = $nextQueue->number;
        $queueSetting->save();

        return redirect()->back()->with('success', 'Called next patient successfully.');
    }

    public function toggleStatus(Request $request)
    {
        $request->validate([
            'status' => 'required|in:active,paused,closed',
        ]);

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

        $queueSetting->status = $request->status;
        $queueSetting->save();

        return redirect()->back()->with('success', 'Queue status updated successfully.');
    }

    public function announce(Request $request)
    {
        $request->validate([
            'announcement' => 'required|string|max:255',
        ]);

        // In a real application, this would send the announcement to waiting patients
        // For example, via WebSockets, SMS, or a notification system

        return redirect()->back()->with('success', 'Announcement sent successfully.');
    }

    private function calculateEstimatedTime(Queue $queue)
    {
        if ($queue->status !== 'waiting') {
            return null;
        }

        $queueSetting = QueueSetting::where('date', Carbon::today()->toDateString())->first();

        if (!$queueSetting || !$queueSetting->current_number) {
            return null;
        }

        $peopleAhead = $queue->number - $queueSetting->current_number;

        if ($peopleAhead <= 0) {
            return 'Next in line';
        }

        $avgTime = $queueSetting->average_service_time;
        $waitMinutes = $peopleAhead * $avgTime;

        $now = Carbon::now();
        $estimatedTime = $now->copy()->addMinutes($waitMinutes);

        return $estimatedTime->format('H:i');
    }
}
