<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCollaboratorRequest;
use App\Http\Requests\UpdateCollaboratorRequest;
use App\Models\Collaborator;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CollaboratorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('collaborators/index', [
            'collaborators' => Collaborator::query()
                ->select(['id', 'name', 'position', 'role', 'immediate_supervisor', 'created_at'])
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
        return Inertia::render('collaborators/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCollaboratorRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['area'] = '';

        Collaborator::create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Collaborator created.')]);

        return to_route('collaborators.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Collaborator $collaborator): Response
    {
        return Inertia::render('collaborators/edit', [
            'collaborator' => $collaborator->only([
                'id',
                'name',
                'position',
                'immediate_supervisor',
                'role',
            ]),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCollaboratorRequest $request, Collaborator $collaborator): RedirectResponse
    {
        $collaborator->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Collaborator updated.')]);

        return to_route('collaborators.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Collaborator $collaborator): RedirectResponse
    {
        $collaborator->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Collaborator deleted.')]);

        return to_route('collaborators.index');
    }
}
