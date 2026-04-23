<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\CollaboratorController;
use App\Http\Controllers\PeriodController;
use App\Http\Controllers\EvaluationTypeController;
use App\Http\Controllers\EvaluationCategoryController;
use App\Http\Controllers\CompetencyController;
use App\Http\Controllers\EvaluationQuestionController;
use App\Http\Controllers\EvaluationController;
use App\Http\Controllers\EvaluationScoringController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::middleware('role:administrator,evaluator')->group(function () {
        Route::resource('evaluations', EvaluationController::class)->except(['show']);
        Route::resource('evaluation-scoring', EvaluationScoringController::class)
            ->parameters(['evaluation-scoring' => 'evaluation'])
            ->except(['show']);
        Route::resource('reports', ReportController::class)
            ->parameters(['reports' => 'report'])
            ->only(['index', 'show']);
    });

    Route::middleware('role:administrator')->group(function () {
        Route::resource('users', UserController::class)->except(['show']);
        Route::resource('collaborators', CollaboratorController::class)->except(['show']);
        Route::resource('periods', PeriodController::class)->except(['show']);
        Route::resource('evaluation-types', EvaluationTypeController::class)->except(['show']);
        Route::resource('evaluation-categories', EvaluationCategoryController::class)->except(['show']);
        Route::resource('competencies', CompetencyController::class)->except(['show']);
        Route::resource('evaluation-questions', EvaluationQuestionController::class)->except(['show']);
    });
});

require __DIR__.'/settings.php';
