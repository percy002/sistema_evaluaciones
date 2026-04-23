<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['evaluation_type_id', 'evaluation_category_id', 'name', 'description', 'sort_order'])]
class Competency extends Model
{
    use SoftDeletes;

    public function type(): BelongsTo
    {
        return $this->belongsTo(EvaluationType::class, 'evaluation_type_id')->withTrashed();
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(EvaluationCategory::class, 'evaluation_category_id')->withTrashed();
    }

    public function questions(): HasMany
    {
        return $this->hasMany(EvaluationQuestion::class);
    }
}
