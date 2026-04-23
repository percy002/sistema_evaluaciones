<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEvaluationTypeRequest;
use App\Http\Requests\UpdateEvaluationTypeRequest;
use App\Models\EvaluationType;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class EvaluationTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('evaluation-types/index', [
            'evaluationTypes' => EvaluationType::query()
                ->select(['id', 'name', 'code', 'created_at'])
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
        return Inertia::render('evaluation-types/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEvaluationTypeRequest $request): RedirectResponse
    {
        EvaluationType::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Evaluation type created.')]);

        return to_route('evaluation-types.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(EvaluationType $evaluationType): Response
    {
        return Inertia::render('evaluation-types/edit', [
            'evaluationType' => $evaluationType->only(['id', 'name', 'code']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEvaluationTypeRequest $request, EvaluationType $evaluationType): RedirectResponse
    {
        $evaluationType->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Evaluation type updated.')]);

        return to_route('evaluation-types.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EvaluationType $evaluationType): RedirectResponse
    {
        $evaluationType->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Evaluation type deleted.')]);

        return to_route('evaluation-types.index');
    }
}
