<?php

namespace App\Http\Controllers;

use App\Models\Collaborator;
use App\Models\Evaluation;
use App\Models\EvaluationQuestion;
use App\Models\Period;
use App\Models\User;
use App\Services\EvaluationCalculationService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        abort_unless($user !== null, 403);

        $filters = $request->validate([
            'period_id' => ['nullable', 'integer', 'exists:periods,id'],
            'collaborator_id' => ['nullable', 'integer', 'exists:collaborators,id'],
            'evaluator_user_id' => ['nullable', 'integer', 'exists:users,id'],
            'status' => ['nullable', 'string', 'in:completed,pending'],
            'search' => ['nullable', 'string', 'max:100'],
        ]);

        $questionCount = EvaluationQuestion::query()->count();

        $reportsQuery = Evaluation::query()
            ->with([
                'collaborator:id,name,area,position',
                'period:id,name',
                'evaluator:id,name',
            ])
            ->withCount('answers')
            ->select([
                'id',
                'collaborator_id',
                'period_id',
                'evaluator_user_id',
                'evaluation_date',
                'custom_start_date',
                'custom_end_date',
                'general_comment',
                'total_score',
                'average_score',
                'created_at',
            ]);

        if (!$user->isAdministrator()) {
            $reportsQuery->where('evaluator_user_id', $user->id);
        }

        $reportsQuery
            ->when(isset($filters['period_id']), fn(Builder $query) => $query->where('period_id', $filters['period_id']))
            ->when(isset($filters['collaborator_id']), fn(Builder $query) => $query->where('collaborator_id', $filters['collaborator_id']))
            ->when($user->isAdministrator() && isset($filters['evaluator_user_id']), fn(Builder $query) => $query->where('evaluator_user_id', $filters['evaluator_user_id']))
            ->when(($filters['search'] ?? null) !== null, function (Builder $query) use ($filters): void {
                $search = trim((string) $filters['search']);

                if ($search === '') {
                    return;
                }

                $query->whereHas('collaborator', function (Builder $innerQuery) use ($search): void {
                    $innerQuery->where('name', 'like', "%{$search}%")
                        ->orWhere('area', 'like', "%{$search}%")
                        ->orWhere('position', 'like', "%{$search}%");
                });
            })
            ->when(($filters['status'] ?? null) === 'completed' && $questionCount > 0, fn(Builder $query) => $query->has('answers', '=', $questionCount))
            ->when(($filters['status'] ?? null) === 'pending' && $questionCount > 0, fn(Builder $query) => $query->has('answers', '<', $questionCount))
            ->latest();

        return Inertia::render('reports/index', [
            'reports' => $reportsQuery->paginate(12)->withQueryString(),
            'questionCount' => $questionCount,
            'filters' => [
                'period_id' => isset($filters['period_id']) ? (int) $filters['period_id'] : null,
                'collaborator_id' => isset($filters['collaborator_id']) ? (int) $filters['collaborator_id'] : null,
                'evaluator_user_id' => $user->isAdministrator() && isset($filters['evaluator_user_id'])
                    ? (int) $filters['evaluator_user_id']
                    : null,
                'status' => $filters['status'] ?? null,
                'search' => $filters['search'] ?? '',
            ],
            'filterOptions' => [
                'periods' => Period::query()
                    ->select(['id', 'name'])
                    ->orderByDesc('start_date')
                    ->get(),
                'collaborators' => Collaborator::query()
                    ->select(['id', 'name'])
                    ->orderBy('name')
                    ->get(),
                'evaluators' => $user->isAdministrator()
                    ? User::query()
                        ->where('role', 'evaluator')
                        ->select(['id', 'name'])
                        ->orderBy('name')
                        ->get()
                    : [],
            ],
        ]);
    }

    public function show(Evaluation $report, EvaluationCalculationService $calculationService): Response
    {
        $user = request()->user();

        abort_unless($user !== null, 403);

        if (!$user->isAdministrator() && $report->evaluator_user_id !== $user->id) {
            abort(403);
        }

        $report->load([
            'collaborator:id,name,area,position,immediate_supervisor',
            'period:id,name,start_date,end_date',
            'evaluator:id,name,email',
            'answers.question:id,competency_id,statement,sort_order',
            'answers.question.competency:id,evaluation_type_id,evaluation_category_id,name',
            'answers.question.competency.type:id,name',
            'answers.question.competency.category:id,name',
        ]);

        $summary = $calculationService->calculate($report);

        return Inertia::render('reports/show', [
            'report' => [
                'id' => $report->id,
                'evaluation_date' => (string) $report->evaluation_date,
                'general_comment' => $report->general_comment,
                'total_score' => $report->total_score,
                'average_score' => $report->average_score,
                'collaborator' => $report->collaborator,
                'period' => $report->period,
                'evaluator' => $report->evaluator,
                'start_date' => $report->custom_start_date ?? $report->period?->start_date,
                'end_date' => $report->custom_end_date ?? $report->period?->end_date,
                'answers' => $report->answers
                    ->sortBy(fn($answer) => $answer->question?->sort_order)
                    ->values()
                    ->map(function ($answer): array {
                        return [
                            'id' => $answer->id,
                            'score' => (int) $answer->score,
                            'question' => [
                                'statement' => $answer->question?->statement,
                                'sort_order' => $answer->question?->sort_order,
                                'competency_name' => $answer->question?->competency?->name,
                                'type_name' => $answer->question?->competency?->type?->name,
                                'category_name' => $answer->question?->competency?->category?->name,
                            ],
                        ];
                    }),
            ],
            'summary' => $summary,
        ]);
    }
}
