<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminComplaintController extends Controller
{
    public function destroy(Complaint $complaint)
    {
        $complaint->delete();
        return redirect('/admin/complaints');
    }
    public function respond(Request $request, Complaint $complaint)
    {
        $complaint->update($request->all());
        return redirect('/admin/complaints');
    }
    public function index(Request $request)
    {
        $query = Complaint::with('user');

        // Apply status filter
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Apply category filter
        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        // Apply search filter
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $complaints = $query->orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('Admin/Complaints/Index', [
            'complaints' => $complaints,
            'filters' => $request->only(['status', 'category', 'search']),
        ]);
    }

    public function show(Complaint $complaint)
    {
        $complaint->load('user', 'responder');

        return Inertia::render('Admin/Complaints/Show', [
            'complaint' => $complaint,
        ]);
    }

    public function update(Request $request, Complaint $complaint)
    {

        $request->validate([
            'status' => 'required',
            'response' => 'nullable',
        ]);

        $complaint->status = $request->status;

        if ($request->filled('response')) {
            $complaint->response = $request->response;
            $complaint->responded_by = $request->user()->id;
            $complaint->responded_at = Carbon::now();
        }

        $complaint->save();

        return redirect()->route('admin.complaints.index')->with('success', 'Complaint updated successfully.');
    }
}
