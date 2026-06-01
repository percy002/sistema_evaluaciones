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
        $useCustomDates = $this->boolean('custom_dates_mode') || ($this->filled('custom_start_date') || $this->filled('custom_end_date'));

        if ($useCustomDates) {
            return [
                'collaborator_id' => ['required', 'exists:collaborators,id'],
                'custom_start_date' => ['required', 'date'],
                'custom_end_date' => ['required', 'date', 'after_or_equal:custom_start_date'],
                'general_comment' => ['nullable', 'string', 'max:2000'],
            ];
        }

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
            'general_comment' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
