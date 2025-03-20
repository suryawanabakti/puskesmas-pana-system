<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class AdminPatientController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', 'patient');

        // Apply search filter
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('nik', 'like', "%{$search}%");
            });
        }

        // Apply gender filter
        if ($request->has('gender') && $request->gender !== 'all') {
            $query->where('gender', $request->gender);
        }

        $patients = $query->orderBy('name')->paginate(10);

        return Inertia::render('Admin/Patients/Index', [
            'patients' => $patients,
            'filters' => $request->only(['search', 'gender']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Patients/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'nik' => 'required|string|max:16|unique:users',
            'phone' => 'required|string|max:15',
            'address' => 'required|string',
            'gender' => 'required|in:male,female',
            'birthdate' => 'required|date',
            'password' => ['required', Rules\Password::defaults()],
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'nik' => $request->nik,
            'phone' => $request->phone,
            'address' => $request->address,
            'gender' => $request->gender,
            'birthdate' => $request->birthdate,
            'password' => Hash::make($request->password),
            'role' => 'patient',
        ]);

        return redirect()->route('admin.patients.index')->with('success', 'Patient created successfully.');
    }

    public function show(User $user)
    {
        // $this->authorize('viewAsAdmin', $user);

        $user->load(['queues' => function ($query) {
            $query->orderBy('created_at', 'desc')->limit(10);
        }, 'complaints' => function ($query) {
            $query->orderBy('created_at', 'desc')->limit(10);
        }]);

        return Inertia::render('Admin/Patients/Show', [
            'patient' => $user,
        ]);
    }

    public function edit(User $user)
    {
        $this->authorize('updateAsAdmin', $user);

        return Inertia::render('Admin/Patients/Edit', [
            'patient' => $user,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $this->authorize('updateAsAdmin', $user);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'nik' => 'required|string|max:16|unique:users,nik,' . $user->id,
            'phone' => 'required|string|max:15',
            'address' => 'required|string',
            'gender' => 'required|in:male,female',
            'birthdate' => 'required|date',
            'password' => ['nullable', Rules\Password::defaults()],
        ]);

        $user->name = $request->name;
        $user->email = $request->email;
        $user->nik = $request->nik;
        $user->phone = $request->phone;
        $user->address = $request->address;
        $user->gender = $request->gender;
        $user->birthdate = $request->birthdate;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return redirect()->route('admin.patients.index')->with('success', 'Patient updated successfully.');
    }

    public function destroy(User $user)
    {
        $this->authorize('deleteAsAdmin', $user);

        $user->delete();

        return redirect()->route('admin.patients.index')->with('success', 'Patient deleted successfully.');
    }

    public function export()
    {
        $patients = User::where('role', 'patient')->get();

        // Generate CSV or Excel file
        // This is a simplified example
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="patients.csv"',
        ];

        $callback = function () use ($patients) {
            $file = fopen('php://output', 'w');

            // Add headers
            fputcsv($file, ['Name', 'NIK', 'Gender', 'Birthdate', 'Phone', 'Email', 'Address', 'Registration Date']);

            // Add data
            foreach ($patients as $patient) {
                fputcsv($file, [
                    $patient->name,
                    $patient->nik,
                    $patient->gender,
                    $patient->birthdate->format('Y-m-d'),
                    $patient->phone,
                    $patient->email,
                    $patient->address,
                    $patient->created_at->format('Y-m-d'),
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
