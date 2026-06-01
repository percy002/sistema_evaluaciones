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
    position: string;
    immediate_supervisor: string;
    role: string;
};

export default function CollaboratorsEdit({
    collaborator,
}: {
    collaborator: CollaboratorPayload;
}) {
    const { data, setData, patch, processing, errors } = useForm({
        name: collaborator.name,
        position: collaborator.position,
        immediate_supervisor: collaborator.immediate_supervisor,
        role: collaborator.role ?? 'ventas',
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        patch(CollaboratorController.update.url(collaborator.id));
    };

    return (
        <>
            <Head title="Editar colaborador" />

            <div className="space-y-6 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Editar colaborador</CardTitle>
                        <CardDescription>
                            Actualiza la información del colaborador.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(event) =>
                                        setData('name', event.target.value)
                                    }
                                    required
                                    autoFocus
                                    placeholder="Nombre completo del colaborador"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="position">Cargo</Label>
                                <Input
                                    id="position"
                                    value={data.position}
                                    onChange={(event) =>
                                        setData('position', event.target.value)
                                    }
                                    required
                                    placeholder="Ej: Asesor de ventas"
                                />
                                <InputError message={errors.position} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="role">Role</Label>
                                <select
                                    id="role"
                                    value={data.role}
                                    onChange={(event) => setData('role', event.target.value)}
                                    className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:border-ring focus-visible:ring-ring/50"
                                >
                                    <option value="ventas">Ventas</option>
                                    <option value="operaciones">Operaciones</option>
                                    <option value="ti">TI</option>
                                    <option value="administracion">Administración</option>
                                </select>
                                <InputError message={errors.role} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="immediate_supervisor">
                                    Supervisor inmediato
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
                                    placeholder="Nombre del supervisor"
                                />
                                <InputError
                                    message={errors.immediate_supervisor}
                                />
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Button type="submit" disabled={processing}>
                                    Actualizar colaborador
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={collaboratorsIndex()}>Cancelar</Link>
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
            title: 'Colaboradores',
            href: collaboratorsIndex(),
        },
        {
            title: 'Editar',
            href: collaboratorsIndex(),
        },
    ],
};
