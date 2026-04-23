<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEvaluationCategoryRequest;
use App\Http\Requests\UpdateEvaluationCategoryRequest;
use App\Models\EvaluationCategory;
use App\Models\EvaluationType;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class EvaluationCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('evaluation-categories/index', [
            'evaluationCategories' => EvaluationCategory::query()
                ->with('type:id,name')
                ->select(['id', 'evaluation_type_id', 'name', 'description', 'sort_order', 'created_at'])
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
        return Inertia::render('evaluation-categories/create', [
            'types' => EvaluationType::query()->select(['id', 'name'])->orderBy('name')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEvaluationCategoryRequest $request): RedirectResponse
    {
        EvaluationCategory::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Evaluation category created.')]);

        return to_route('evaluation-categories.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(EvaluationCategory $evaluationCategory): Response
    {
        return Inertia::render('evaluation-categories/edit', [
            'evaluationCategory' => $evaluationCategory->only([
                'id',
                'evaluation_type_id',
                'name',
                'description',
                'sort_order',
            ]),
            'types' => EvaluationType::query()->select(['id', 'name'])->orderBy('name')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEvaluationCategoryRequest $request, EvaluationCategory $evaluationCategory): RedirectResponse
    {
        $evaluationCategory->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Evaluation category updated.')]);

        return to_route('evaluation-categories.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EvaluationCategory $evaluationCategory): RedirectResponse
    {
        $evaluationCategory->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Evaluation category deleted.')]);

        return to_route('evaluation-categories.index');
    }
}
