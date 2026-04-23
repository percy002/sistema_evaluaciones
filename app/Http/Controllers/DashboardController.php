<?php

namespace App\Http\Controllers;

use App\Models\Collaborator;
use App\Models\Evaluation;
use App\Models\EvaluationQuestion;
use App\Models\Period;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = request()->user();

        abort_unless($user !== null, 403);

        $questionCount = EvaluationQuestion::query()->count();

        $baseQuery = Evaluation::query();

        if (! $user->isAdministrator()) {
            $baseQuery->where('evaluator_user_id', $user->id);
        }

        $totals = (clone $baseQuery)
            ->selectRaw('COUNT(*) as evaluations_total')
            ->selectRaw('AVG(average_score) as average_score')
            ->first();

        $completedCount = (clone $baseQuery)
            ->when($questionCount > 0, fn (Builder $query) => $query->has('answers', '=', $questionCount))
            ->count();

        $pendingCount = max(((int) ($totals?->evaluations_total ?? 0)) - $completedCount, 0);

        $byPeriod = (clone $baseQuery)
            ->join('periods', 'periods.id', '=', 'evaluations.period_id')
            ->selectRaw('periods.id as period_id')
            ->selectRaw('periods.name as period_name')
            ->selectRaw('COUNT(evaluations.id) as evaluations_count')
            ->selectRaw('AVG(evaluations.average_score) as average_score')
            ->groupBy('periods.id', 'periods.name')
            ->orderByDesc('periods.start_date')
            ->limit(8)
            ->get();

        $byArea = (clone $baseQuery)
            ->join('collaborators', 'collaborators.id', '=', 'evaluations.collaborator_id')
            ->selectRaw('collaborators.area as area_name')
            ->selectRaw('COUNT(evaluations.id) as evaluations_count')
            ->selectRaw('AVG(evaluations.average_score) as average_score')
            ->groupBy('collaborators.area')
            ->orderByDesc('evaluations_count')
            ->limit(8)
            ->get();

        $recentEvaluations = (clone $baseQuery)
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
                'total_score',
                'average_score',
            ])
            ->latest()
            ->limit(10)
            ->get()
            ->map(function (Evaluation $evaluation) use ($questionCount): array {
                $answersCount = (int) ($evaluation->answers_count ?? 0);

                return [
                    'id' => $evaluation->id,
                    'evaluation_date' => (string) $evaluation->evaluation_date,
                    'total_score' => $evaluation->total_score,
                    'average_score' => $evaluation->average_score,
                    'answers_count' => $answersCount,
                    'completion_percent' => $questionCount > 0
                        ? (int) min(round(($answersCount / $questionCount) * 100), 100)
                        : 0,
                    'collaborator' => [
                        'name' => $evaluation->collaborator?->name,
                        'area' => $evaluation->collaborator?->area,
                        'position' => $evaluation->collaborator?->position,
                    ],
                    'period' => [
                        'name' => $evaluation->period?->name,
                    ],
                    'evaluator' => [
                        'name' => $evaluation->evaluator?->name,
                    ],
                ];
            })
            ->values();

        return Inertia::render('dashboard', [
            'stats' => [
                'evaluations_total' => (int) ($totals?->evaluations_total ?? 0),
                'evaluations_completed' => $completedCount,
                'evaluations_pending' => $pendingCount,
                'average_score' => $totals?->average_score !== null
                    ? round((float) $totals->average_score, 2)
                    : null,
                'question_count' => $questionCount,
                'collaborators_total' => $user->isAdministrator() ? Collaborator::query()->count() : null,
                'periods_total' => $user->isAdministrator() ? Period::query()->count() : null,
                'evaluators_total' => $user->isAdministrator()
                    ? User::query()->where('role', 'evaluator')->count()
                    : null,
            ],
            'byPeriod' => $byPeriod,
            'byArea' => $byArea,
            'recentEvaluations' => $recentEvaluations,
        ]);
    }
}
