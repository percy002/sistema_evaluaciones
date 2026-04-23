<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['name', 'area', 'position', 'immediate_supervisor', 'role'])]
class Collaborator extends Model
{
    use SoftDeletes;

    public function evaluations(): HasMany
    {
        return $this->hasMany(Evaluation::class);
    }
}
