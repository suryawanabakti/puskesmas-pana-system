<?php

use App\Exports\ComplaintsExport;
use App\Http\Controllers\Admin\AdminComplaintController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminPatientController;
use App\Http\Controllers\Admin\AdminQueueController;
use App\Http\Controllers\Admin\AdminReportController;
use App\Http\Controllers\ComplaintController;
use App\Http\Controllers\ComplaintReportController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MedicalHistoryController;
use App\Http\Controllers\QueueController;
use App\Http\Controllers\QueueReportController;
use App\Models\Queue;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

Route::get('/', function () {
    $queue = Queue::orderBy('created_at', 'DESC')->first();
    return Inertia::render('welcome', ["queue" => $queue]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Queue routes
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/queue', [QueueController::class, 'view'])->name('queue.view');
    Route::get('/queue/take', [QueueController::class, 'take'])->name('queue.take');

    // Complaint routes
    Route::get('/complaints', [ComplaintController::class, 'index'])->name('complaints.index');
    Route::get('/complaints/create', [ComplaintController::class, 'create'])->name('complaints.create');
    Route::post('/complaints', [ComplaintController::class, 'store'])->name('complaints.store');
    Route::get('/complaints/{complaint}', [ComplaintController::class, 'show'])->name('complaints.show');

    // Medical history routes
    Route::get('/medical-history', [MedicalHistoryController::class, 'index'])->name('medical-history');

    Route::prefix('admin')->name('admin.')->group(function () {
        // Patient management
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

        Route::get('/patients', [AdminPatientController::class, 'index'])->name('patients.index');
        Route::get('/patients/create', [AdminPatientController::class, 'create'])->name('patients.create');
        Route::post('/patients', [AdminPatientController::class, 'store'])->name('patients.store');
        Route::get('/patients/{user}', [AdminPatientController::class, 'show'])->name('patients.show');
        Route::get('/patients/{user}/edit', [AdminPatientController::class, 'edit'])->name('patients.edit');
        Route::put('/patients/{user}', [AdminPatientController::class, 'update'])->name('patients.update');
        Route::delete('/patients/{user}', [AdminPatientController::class, 'destroy'])->name('patients.destroy');
        Route::get('/patients/export', [AdminPatientController::class, 'export'])->name('patients.export');

        // Queue management
        Route::get('/queue/manage', [AdminQueueController::class, 'manage'])->name('queue.manage');
        Route::post('/queue/next', [AdminQueueController::class, 'next'])->name('queue.next');
        Route::post('/queue/toggle-status', [AdminQueueController::class, 'toggleStatus'])->name('queue.toggle-status');
        Route::post('/queue/announce', [AdminQueueController::class, 'announce'])->name('queue.announce');
        Route::get('/reports/queue', [QueueReportController::class, 'index'])->name('reports.queue');

        // Complaint management
        Route::get('/complaints', [AdminComplaintController::class, 'index'])->name('complaints.index');
        Route::get('/complaints/export', [AdminComplaintController::class, 'export'])->name('complaints.export');
        Route::get('/complaints/{complaint}', [AdminComplaintController::class, 'show'])->name('complaints.show');
        Route::patch('/complaints/{complaint}', [AdminComplaintController::class, 'update'])->name('complaints.update-status');
        Route::post('/complaints/{complaint}/respond', [AdminComplaintController::class, 'respond'])->name('complaints.respond');
        Route::delete('/complaints/{complaint}', [AdminComplaintController::class, 'destroy'])->name('complaints.destroy');
        Route::get('/reports/complaints', [ComplaintReportController::class, 'index'])->name('reports.complaints');

        // Reports
        Route::get('/reports', [AdminReportController::class, 'index'])->name('reports');
        Route::post('/reports/generate', [AdminReportController::class, 'generate'])->name('reports.generate');
    });
});



require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
