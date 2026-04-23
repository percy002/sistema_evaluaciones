<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['competency_id', 'statement', 'sort_order'])]
class EvaluationQuestion extends Model
{
    use SoftDeletes;

    public function competency(): BelongsTo
    {
        return $this->belongsTo(Competency::class)->withTrashed();
    }

    public function answers(): HasMany
    {
        return $this->hasMany(EvaluationAnswer::class, 'evaluation_question_id');
    }
}
