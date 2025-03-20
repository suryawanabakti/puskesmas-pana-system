<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\QueueSetting;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminSettingController extends Controller
{
    public function index()
    {
        $queueSetting = QueueSetting::where('date', Carbon::today()->toDateString())->first();

        if (!$queueSetting) {
            $queueSetting = new QueueSetting([
                'status' => 'closed',
                'start_time' => '08:00:00',
                'end_time' => '16:00:00',
                'average_service_time' => 15,
                'date' => Carbon::today()->toDateString(),
            ]);
        }

        return Inertia::render('Admin/Settings/Index', [
            'queueSetting' => $queueSetting,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'average_service_time' => 'required|integer|min:1|max:60',
        ]);

        $queueSetting = QueueSetting::firstOrCreate(
            ['date' => Carbon::today()->toDateString()],
            ['status' => 'closed']
        );

        $queueSetting->start_time = $request->start_time . ':00';
        $queueSetting->end_time = $request->end_time . ':00';
        $queueSetting->average_service_time = $request->average_service_time;
        $queueSetting->save();

        return redirect()->back()->with('success', 'Settings updated successfully.');
    }
}
