<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class AdminPatientController extends Controller
{
    public function index(Request $request)
    {
        $users = User::latest()->paginate(10);

        return Inertia::render('Admin/Patients/Index', [
            'users' => $users
        ]);
    }


    public function create()
    {
        return Inertia::render('Users/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'nik' => 'required|string|max:255|unique:users',
            'phone' => 'required|string|max:255',
            'address' => 'required|string',
            'gender' => 'required|in:male,female',
            'birthdate' => 'required|date',
            'password' => 'required|string|min:8',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        User::create($validated);

        return redirect()->route('admin.patients.index')->with('success', 'User created successfully.');
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/Patients/Edit', [
            'user' => $user
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'nik' => ['required', 'string', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => 'required|string|max:255',
            'address' => 'required|string',
            'gender' => 'required|in:male,female',
            'birthdate' => 'required|date',
            'password' => 'nullable|string|min:8',
        ]);

        if (isset($validated['password']) && $validated['password']) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return redirect()->route('admin.patients.index')->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('admin.patients.index')->with('success', 'User deleted successfully.');
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
