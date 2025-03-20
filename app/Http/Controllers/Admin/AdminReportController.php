<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use App\Models\Queue;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminReportController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Reports/Index');
    }

    public function generate(Request $request)
    {
        $request->validate([
            'report_type' => 'required|in:patient,queue,complaint',
            'date_from' => 'required|date',
            'date_to' => 'required|date|after_or_equal:date_from',
        ]);

        $dateFrom = Carbon::parse($request->date_from);
        $dateTo = Carbon::parse($request->date_to);

        $reportData = [];

        switch ($request->report_type) {
            case 'patient':
                $reportData = $this->generatePatientReport($dateFrom, $dateTo);
                break;
            case 'queue':
                $reportData = $this->generateQueueReport($dateFrom, $dateTo);
                break;
            case 'complaint':
                $reportData = $this->generateComplaintReport($dateFrom, $dateTo);
                break;
        }

        return Inertia::render('Admin/Reports/Show', [
            'reportType' => $request->report_type,
            'dateFrom' => $dateFrom->format('Y-m-d'),
            'dateTo' => $dateTo->format('Y-m-d'),
            'reportData' => $reportData,
        ]);
    }

    private function generatePatientReport($dateFrom, $dateTo)
    {
        $totalPatients = User::where('role', 'patient')
            ->whereBetween('created_at', [$dateFrom, $dateTo->endOfDay()])
            ->count();

        $patientsByGender = User::where('role', 'patient')
            ->whereBetween('created_at', [$dateFrom, $dateTo->endOfDay()])
            ->selectRaw('gender, count(*) as count')
            ->groupBy('gender')
            ->get();

        $patientsByDay = User::where('role', 'patient')
            ->whereBetween('created_at', [$dateFrom, $dateTo->endOfDay()])
            ->selectRaw('DATE(created_at) as date, count(*) as count')
            ->groupBy('date')
            ->get();

        return [
            'totalPatients' => $totalPatients,
            'patientsByGender' => $patientsByGender,
            'patientsByDay' => $patientsByDay,
        ];
    }

    private function generateQueueReport($dateFrom, $dateTo)
    {
        $totalQueues = Queue::whereBetween('created_at', [$dateFrom, $dateTo->endOfDay()])
            ->count();

        $queuesByStatus = Queue::whereBetween('created_at', [$dateFrom, $dateTo->endOfDay()])
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->get();

        $queuesByDay = Queue::whereBetween('created_at', [$dateFrom, $dateTo->endOfDay()])
            ->selectRaw('DATE(created_at) as date, count(*) as count')
            ->groupBy('date')
            ->get();

        $avgWaitTime = Queue::whereBetween('created_at', [$dateFrom, $dateTo->endOfDay()])
            ->whereNotNull('called_at')
            ->selectRaw('AVG(TIMESTAMPDIFF(MINUTE, created_at, called_at)) as avg_wait_time')
            ->first();

        return [
            'totalQueues' => $totalQueues,
            'queuesByStatus' => $queuesByStatus,
            'queuesByDay' => $queuesByDay,
            'avgWaitTime' => $avgWaitTime ? round($avgWaitTime->avg_wait_time, 2) : 0,
        ];
    }

    private function generateComplaintReport($dateFrom, $dateTo)
    {
        $totalComplaints = Complaint::whereBetween('created_at', [$dateFrom, $dateTo->endOfDay()])
            ->count();

        $complaintsByStatus = Complaint::whereBetween('created_at', [$dateFrom, $dateTo->endOfDay()])
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->get();

        $complaintsByCategory = Complaint::whereBetween('created_at', [$dateFrom, $dateTo->endOfDay()])
            ->selectRaw('category, count(*) as count')
            ->groupBy('category')
            ->get();

        $complaintsByDay = Complaint::whereBetween('created_at', [$dateFrom, $dateTo->endOfDay()])
            ->selectRaw('DATE(created_at) as date, count(*) as count')
            ->groupBy('date')
            ->get();

        $avgResponseTime = Complaint::whereBetween('created_at', [$dateFrom, $dateTo->endOfDay()])
            ->whereNotNull('responded_at')
            ->selectRaw('AVG(TIMESTAMPDIFF(HOUR, created_at, responded_at)) as avg_response_time')
            ->first();

        return [
            'totalComplaints' => $totalComplaints,
            'complaintsByStatus' => $complaintsByStatus,
            'complaintsByCategory' => $complaintsByCategory,
            'complaintsByDay' => $complaintsByDay,
            'avgResponseTime' => $avgResponseTime ? round($avgResponseTime->avg_response_time, 2) : 0,
        ];
    }
}
