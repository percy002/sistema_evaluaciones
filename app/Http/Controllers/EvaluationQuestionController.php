<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEvaluationQuestionRequest;
use App\Http\Requests\UpdateEvaluationQuestionRequest;
use App\Models\Competency;
use App\Models\EvaluationQuestion;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class EvaluationQuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('evaluation-questions/index', [
            'evaluationQuestions' => EvaluationQuestion::query()
                ->with(['competency:id,name'])
                ->select(['id', 'competency_id', 'statement', 'sort_order', 'created_at'])
                ->orderBy('sort_order')
                ->orderByDesc('id')
                ->paginate(10)
                ->withQueryString(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('evaluation-questions/create', [
            'competencies' => Competency::query()
                ->select(['id', 'name'])
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEvaluationQuestionRequest $request): RedirectResponse
    {
        EvaluationQuestion::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Evaluation question created.')]);

        return to_route('evaluation-questions.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(EvaluationQuestion $evaluationQuestion): Response
    {
        return Inertia::render('evaluation-questions/edit', [
            'evaluationQuestion' => $evaluationQuestion->only([
                'id',
                'competency_id',
                'statement',
                'sort_order',
            ]),
            'competencies' => Competency::query()
                ->select(['id', 'name'])
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEvaluationQuestionRequest $request, EvaluationQuestion $evaluationQuestion): RedirectResponse
    {
        $evaluationQuestion->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Evaluation question updated.')]);

        return to_route('evaluation-questions.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EvaluationQuestion $evaluationQuestion): RedirectResponse
    {
        $evaluationQuestion->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Evaluation question deleted.')]);

        return to_route('evaluation-questions.index');
    }
}
