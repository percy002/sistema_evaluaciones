<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'code'])]
class EvaluationType extends Model
{
    use SoftDeletes;

    public function categories(): HasMany
    {
        return $this->hasMany(EvaluationCategory::class);
    }

    public function competencies(): HasMany
    {
        return $this->hasMany(Competency::class);
    }
}
