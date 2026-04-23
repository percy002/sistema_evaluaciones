<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCompetencyRequest;
use App\Http\Requests\UpdateCompetencyRequest;
use App\Models\Competency;
use App\Models\EvaluationCategory;
use App\Models\EvaluationType;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CompetencyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('competencies/index', [
            'competencies' => Competency::query()
                ->with([
                    'type:id,name',
                    'category:id,name',
                ])
                ->select([
                    'id',
                    'evaluation_type_id',
                    'evaluation_category_id',
                    'name',
                    'description',
                    'sort_order',
                    'created_at',
                ])
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
        return Inertia::render('competencies/create', [
            'types' => EvaluationType::query()->select(['id', 'name'])->orderBy('name')->get(),
            'categories' => EvaluationCategory::query()
                ->select(['id', 'evaluation_type_id', 'name'])
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCompetencyRequest $request): RedirectResponse
    {
        Competency::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Competency created.')]);

        return to_route('competencies.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Competency $competency): Response
    {
        return Inertia::render('competencies/edit', [
            'competency' => $competency->only([
                'id',
                'evaluation_type_id',
                'evaluation_category_id',
                'name',
                'description',
                'sort_order',
            ]),
            'types' => EvaluationType::query()->select(['id', 'name'])->orderBy('name')->get(),
            'categories' => EvaluationCategory::query()
                ->select(['id', 'evaluation_type_id', 'name'])
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCompetencyRequest $request, Competency $competency): RedirectResponse
    {
        $competency->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Competency updated.')]);

        return to_route('competencies.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Competency $competency): RedirectResponse
    {
        $competency->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Competency deleted.')]);

        return to_route('competencies.index');
    }
}
