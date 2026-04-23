<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEvaluationRequest;
use App\Http\Requests\UpdateEvaluationRequest;
use App\Models\Collaborator;
use App\Models\Evaluation;
use App\Models\Period;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class EvaluationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('evaluations/index', [
            'evaluations' => Evaluation::query()
                ->with([
                    'collaborator:id,name,area,position',
                    'period:id,name,start_date,end_date',
                    'evaluator:id,name',
                ])
                ->select([
                    'id',
                    'collaborator_id',
                    'period_id',
                    'evaluator_user_id',
                    'evaluation_date',
                    'general_comment',
                    'total_score',
                    'average_score',
                    'created_at',
                ])
                ->latest()
                ->paginate(10)
                ->withQueryString(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('evaluations/create', [
            'collaborators' => Collaborator::query()
                ->select(['id', 'name', 'area', 'position'])
                ->orderBy('name')
                ->get(),
            'periods' => Period::query()
                ->select(['id', 'name', 'start_date', 'end_date'])
                ->orderByDesc('start_date')
                ->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEvaluationRequest $request): RedirectResponse
    {
        Evaluation::create([
            ...$request->validated(),
            'evaluation_date' => now()->toDateString(),
            'evaluator_user_id' => $request->user()?->id,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Evaluation created.')]);

        return to_route('evaluations.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Evaluation $evaluation): Response
    {
        return Inertia::render('evaluations/edit', [
            'evaluation' => [
                'id' => $evaluation->id,
                'collaborator_id' => $evaluation->collaborator_id,
                'period_id' => $evaluation->period_id,
                'general_comment' => $evaluation->general_comment,
                'evaluation_date' => (string) $evaluation->evaluation_date,
            ],
            'collaborators' => Collaborator::query()
                ->select(['id', 'name', 'area', 'position'])
                ->orderBy('name')
                ->get(),
            'periods' => Period::query()
                ->select(['id', 'name', 'start_date', 'end_date'])
                ->orderByDesc('start_date')
                ->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEvaluationRequest $request, Evaluation $evaluation): RedirectResponse
    {
        $evaluation->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Evaluation updated.')]);

        return to_route('evaluations.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Evaluation $evaluation): RedirectResponse
    {
        $evaluation->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Evaluation deleted.')]);

        return to_route('evaluations.index');
    }
}
