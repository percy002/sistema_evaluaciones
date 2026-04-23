<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEvaluationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'collaborator_id' => ['required', 'exists:collaborators,id'],
            'period_id' => [
                'required',
                'exists:periods,id',
                Rule::unique('evaluations')
                    ->where(fn ($query) => $query
                        ->where('collaborator_id', $this->integer('collaborator_id'))
                        ->where('period_id', $this->integer('period_id'))
                        ->whereNull('deleted_at')),
            ],
            'general_comment' => ['required', 'string', 'max:2000'],
        ];
    }
}
