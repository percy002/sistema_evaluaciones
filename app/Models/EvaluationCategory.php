<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['evaluation_type_id', 'name', 'description', 'sort_order'])]
class EvaluationCategory extends Model
{
    use SoftDeletes;

    public function type(): BelongsTo
    {
        return $this->belongsTo(EvaluationType::class, 'evaluation_type_id')->withTrashed();
    }

    public function competencies(): HasMany
    {
        return $this->hasMany(Competency::class);
    }
}
