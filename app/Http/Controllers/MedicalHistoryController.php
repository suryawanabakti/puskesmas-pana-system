<?php

namespace App\Http\Controllers;

use App\Models\MedicalHistory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MedicalHistoryController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $medicalHistories = MedicalHistory::where('user_id', $user->id)
            ->orderBy('visit_date', 'desc')
            ->paginate(10);

        return Inertia::render('Patient/MedicalHistory/Index', [
            'medicalHistories' => $medicalHistories,
        ]);
    }
}
