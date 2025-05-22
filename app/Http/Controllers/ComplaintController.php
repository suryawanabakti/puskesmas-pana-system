<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ComplaintController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $complaints = Complaint::where('user_id', $user->id)

            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Patient/Complaint/Index', [
            'complaints' => $complaints,
        ]);
    }

    public function create()
    {
        return Inertia::render('Patient/Complaint/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|in:service,facility,staff,waiting,treatment,other',
            'description' => 'required|string',
            'attachment' => 'nullable|file|max:5120', // 5MB max
        ]);

        $user = $request->user();

        $complaint = new Complaint([
            'user_id' => $user->id,
            'title' => $validated['title'],
            'category' => $validated['category'],
            'description' => $validated['description'],
        ]);

        if ($request->hasFile('attachment')) {
            $path = $request->file('attachment')->store('complaints', 'public');
            $complaint->attachment = $path;
        }

        $complaint->save();

        return redirect()->route('complaints.index')->with('success', 'Complaint submitted successfully.');
    }

    public function show(Complaint $complaint)
    {

        $complaint->load('responder');

        return Inertia::render('Patient/Complaint/Show', [
            'complaint' => $complaint,
        ]);
    }
}
