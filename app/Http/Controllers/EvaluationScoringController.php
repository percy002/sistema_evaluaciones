<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEvaluationScoringRequest;
use App\Http\Requests\UpdateEvaluationScoringRequest;
use App\Models\Evaluation;
use App\Models\EvaluationAnswer;
use App\Models\EvaluationQuestion;
use App\Services\EvaluationCalculationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class EvaluationScoringController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('evaluation-scoring/index', [
            'evaluations' => Evaluation::query()
                ->with([
                    'collaborator:id,name,area,position',
                    'period:id,name',
                ])
                ->withCount('answers')
                ->select(['id', 'collaborator_id', 'period_id', 'evaluation_date', 'total_score', 'average_score'])
                ->latest()
                ->paginate(10)
                ->withQueryString(),
            'questionCount' => EvaluationQuestion::query()->count(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {
        $evaluationId = $request->integer('evaluation_id');

        abort_unless($evaluationId > 0, 404);

        $evaluation = Evaluation::query()
            ->with([
                'collaborator:id,name,area,position,immediate_supervisor',
                'period:id,name,start_date,end_date',
            ])
            ->findOrFail($evaluationId);

        $answers = $evaluation->answers()
            ->pluck('score', 'evaluation_question_id')
            ->map(fn ($score) => (int) $score)
            ->all();

        $summary = app(EvaluationCalculationService::class)->calculate($evaluation);

        return Inertia::render('evaluation-scoring/create', [
            'evaluation' => $evaluation,
            'rows' => $this->questionRows(),
            'answers' => $answers,
            'summary' => $summary,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEvaluationScoringRequest $request): RedirectResponse
    {
        $evaluation = Evaluation::query()->findOrFail($request->integer('evaluation_id'));

        $this->persistAnswers($evaluation, $request->validated('answers'));

        app(EvaluationCalculationService::class)->calculateAndPersist($evaluation);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Scoring saved.')]);

        return to_route('evaluation-scoring.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Evaluation $evaluation): Response
    {
        $summary = app(EvaluationCalculationService::class)->calculate($evaluation);

        return Inertia::render('evaluation-scoring/edit', [
            'evaluation' => $evaluation->load([
                'collaborator:id,name,area,position,immediate_supervisor',
                'period:id,name,start_date,end_date',
            ]),
            'rows' => $this->questionRows(),
            'answers' => $evaluation->answers()
                ->pluck('score', 'evaluation_question_id')
                ->map(fn ($score) => (int) $score)
                ->all(),
            'summary' => $summary,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEvaluationScoringRequest $request, Evaluation $evaluation): RedirectResponse
    {
        $this->persistAnswers($evaluation, $request->validated('answers'));

        app(EvaluationCalculationService::class)->calculateAndPersist($evaluation);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Scoring updated.')]);

        return to_route('evaluation-scoring.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Evaluation $evaluation): RedirectResponse
    {
        $evaluation->answers()->delete();

        $evaluation->update([
            'total_score' => null,
            'average_score' => null,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Scoring deleted.')]);

        return to_route('evaluation-scoring.index');
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function questionRows(): array
    {
        return EvaluationQuestion::query()
            ->with([
                'competency:id,evaluation_type_id,evaluation_category_id,name',
                'competency.type:id,name,code',
                'competency.category:id,name',
            ])
            ->select(['id', 'competency_id', 'statement', 'sort_order'])
            ->get()
            ->map(function (EvaluationQuestion $question): array {
                return [
                    'id' => $question->id,
                    'statement' => $question->statement,
                    'competency' => [
                        'name' => $question->competency?->name,
                        'type_name' => $question->competency?->type?->name,
                        'type_code' => $question->competency?->type?->code,
                        'category' => $question->competency?->category?->name,
                    ],
                    'sort_order' => $question->sort_order,
                ];
            })
            ->sortBy(function (array $row): array {
                return [
                    $row['competency']['type_code'] === 'qualitative' ? 0 : 1,
                    $row['competency']['type_name'] ?? '',
                    $row['sort_order'],
                ];
            })
            ->values()
            ->all();
    }

    /**
     * @param array<string, int|string> $answers
     */
    protected function persistAnswers(Evaluation $evaluation, array $answers): void
    {
        $questionIds = collect(array_keys($answers))
            ->map(fn ($id) => (int) $id)
            ->filter(fn ($id) => $id > 0)
            ->values();

        $validCount = EvaluationQuestion::query()
            ->whereIn('id', $questionIds)
            ->count();

        abort_if($validCount !== $questionIds->count(), 422);

        $rows = $questionIds->map(fn (int $questionId) => [
            'evaluation_id' => $evaluation->id,
            'evaluation_question_id' => $questionId,
            'score' => (int) $answers[(string) $questionId],
            'created_at' => now(),
            'updated_at' => now(),
        ])->all();

        DB::transaction(function () use ($evaluation, $rows, $questionIds): void {
            $evaluation->answers()
                ->whereNotIn('evaluation_question_id', $questionIds)
                ->delete();

            EvaluationAnswer::query()->upsert(
                $rows,
                ['evaluation_id', 'evaluation_question_id'],
                ['score', 'updated_at'],
            );
        });
    }
}
