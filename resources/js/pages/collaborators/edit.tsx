import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import CollaboratorController from '@/actions/App/Http/Controllers/CollaboratorController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index as collaboratorsIndex } from '@/routes/collaborators';

type CollaboratorPayload = {
    id: number;
    name: string;
    area: string;
    position: string;
    immediate_supervisor: string;
};

export default function CollaboratorsEdit({
    collaborator,
}: {
    collaborator: CollaboratorPayload;
}) {
    const { data, setData, patch, processing, errors } = useForm({
        name: collaborator.name,
        area: collaborator.area,
        position: collaborator.position,
        immediate_supervisor: collaborator.immediate_supervisor,
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        patch(CollaboratorController.update.url(collaborator.id));
    };

    return (
        <>
            <Head title="Edit collaborator" />

            <div className="space-y-6 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit collaborator</CardTitle>
                        <CardDescription>
                            Update collaborator information.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(event) =>
                                        setData('name', event.target.value)
                                    }
                                    required
                                    autoFocus
                                    placeholder="Collaborator full name"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="area">Area</Label>
                                <Input
                                    id="area"
                                    value={data.area}
                                    onChange={(event) =>
                                        setData('area', event.target.value)
                                    }
                                    required
                                    placeholder="Sales, Operations, Marketing..."
                                />
                                <InputError message={errors.area} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="position">Position</Label>
                                <Input
                                    id="position"
                                    value={data.position}
                                    onChange={(event) =>
                                        setData('position', event.target.value)
                                    }
                                    required
                                    placeholder="Travel advisor"
                                />
                                <InputError message={errors.position} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="immediate_supervisor">
                                    Immediate supervisor
                                </Label>
                                <Input
                                    id="immediate_supervisor"
                                    value={data.immediate_supervisor}
                                    onChange={(event) =>
                                        setData(
                                            'immediate_supervisor',
                                            event.target.value,
                                        )
                                    }
                                    required
                                    placeholder="Supervisor name"
                                />
                                <InputError
                                    message={errors.immediate_supervisor}
                                />
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Button type="submit" disabled={processing}>
                                    Update collaborator
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={collaboratorsIndex()}>Cancel</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

CollaboratorsEdit.layout = {
    breadcrumbs: [
        {
            title: 'Collaborators',
            href: collaboratorsIndex(),
        },
        {
            title: 'Edit',
            href: collaboratorsIndex(),
        },
    ],
};
