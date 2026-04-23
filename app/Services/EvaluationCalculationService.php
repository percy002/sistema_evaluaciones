<?php

namespace App\Services;

use App\Models\Evaluation;
use App\Models\EvaluationAnswer;

class EvaluationCalculationService
{
    /**
     * @return array<string, mixed>
     */
    public function calculate(Evaluation $evaluation): array
    {
        $answers = $evaluation->answers()
            ->with([
                'question:id,competency_id,statement',
                'question.competency:id,evaluation_type_id,evaluation_category_id,name',
                'question.competency.type:id,name',
                'question.competency.category:id,name',
            ])
            ->get();

        $totalScore = (int) $answers->sum('score');
        $averageScore = $answers->count() > 0
            ? round($totalScore / $answers->count(), 2)
            : null;

        $byCompetency = $answers
            ->groupBy(fn (EvaluationAnswer $answer) => (string) $answer->question?->competency?->id)
            ->filter(fn ($group, $key) => $key !== '')
            ->map(function ($group): array {
                $first = $group->first();
                $competency = $first?->question?->competency;
                $sum = (int) $group->sum('score');
                $count = $group->count();

                return [
                    'competency_id' => $competency?->id,
                    'competency_name' => $competency?->name,
                    'type_name' => $competency?->type?->name,
                    'category_name' => $competency?->category?->name,
                    'total_score' => $sum,
                    'average_score' => $count > 0 ? round($sum / $count, 2) : null,
                    'answers_count' => $count,
                ];
            })
            ->values()
            ->all();

        $byCategory = $answers
            ->groupBy(fn (EvaluationAnswer $answer) =>
                (string) ($answer->question?->competency?->category?->name ?? 'Sin categoria'))
            ->map(function ($group, string $categoryName): array {
                $sum = (int) $group->sum('score');
                $count = $group->count();

                return [
                    'category_name' => $categoryName,
                    'total_score' => $sum,
                    'average_score' => $count > 0 ? round($sum / $count, 2) : null,
                    'answers_count' => $count,
                ];
            })
            ->values()
            ->all();

        return [
            'general' => [
                'total_score' => $totalScore,
                'average_score' => $averageScore,
                'answers_count' => $answers->count(),
            ],
            'by_competency' => $byCompetency,
            'by_category' => $byCategory,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function calculateAndPersist(Evaluation $evaluation): array
    {
        $summary = $this->calculate($evaluation);

        $evaluation->update([
            'total_score' => $summary['general']['total_score'],
            'average_score' => $summary['general']['average_score'],
        ]);

        return $summary;
    }
}
