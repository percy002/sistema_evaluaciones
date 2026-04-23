<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePeriodRequest;
use App\Http\Requests\UpdatePeriodRequest;
use App\Models\Period;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PeriodController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('periods/index', [
            'periods' => Period::query()
                ->select(['id', 'name', 'start_date', 'end_date', 'created_at'])
                ->latest()
                ->paginate(10)
                ->withQueryString(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('periods/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePeriodRequest $request): RedirectResponse
    {
        Period::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Period created.')]);

        return to_route('periods.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Period $period): Response
    {
        return Inertia::render('periods/edit', [
            'period' => [
                'id' => $period->id,
                'name' => $period->name,
                'start_date' => (string) $period->start_date,
                'end_date' => (string) $period->end_date,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePeriodRequest $request, Period $period): RedirectResponse
    {
        $period->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Period updated.')]);

        return to_route('periods.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Period $period): RedirectResponse
    {
        $period->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Period deleted.')]);

        return to_route('periods.index');
    }
}
