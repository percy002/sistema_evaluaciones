import { Form, Head, Link } from '@inertiajs/react';
import CollaboratorController from '@/actions/App/Http/Controllers/CollaboratorController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    create as collaboratorsCreate,
    index as collaboratorsIndex,
} from '@/routes/collaborators';

type CollaboratorItem = {
    id: number;
    name: string;
    position: string;
    role: string;
    immediate_supervisor: string;
    created_at: string;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedCollaborators = {
    data: CollaboratorItem[];
    from: number | null;
    to: number | null;
    total: number;
    links: PaginationLink[];
};

export default function CollaboratorsIndex({
    collaborators,
}: {
    collaborators: PaginatedCollaborators;
}) {
    return (
        <>
            <Head title="Collaborators" />

            <div className="space-y-6 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <Heading
                        title="Colaboradores"
                        description="Gestiona los registros de colaboradores por rol y posición"
                    />

                    <Button asChild>
                        <Link href={collaboratorsCreate()}>
                            Crear colaborador
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Lista de colaboradores</CardTitle>
                        <CardDescription>
                            {collaborators.total} colaboradores registrados
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-180 text-sm">
                                <thead>
                                    <tr className="border-b text-left text-muted-foreground">
                                        <th className="px-3 py-2 font-medium">
                                            Nombre
                                        </th>
                                        <th className="px-3 py-2 font-medium">
                                            Posición
                                        </th>
                                        <th className="px-3 py-2 font-medium">
                                            Rol
                                        </th>
                                        <th className="px-3 py-2 font-medium">
                                            Supervisor inmediato
                                        </th>
                                        <th className="px-3 py-2 text-right font-medium">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {collaborators.data.map((collaborator) => (
                                        <tr
                                            key={collaborator.id}
                                            className="border-b last:border-none"
                                        >
                                            <td className="px-3 py-3 font-medium">
                                                {collaborator.name}
                                            </td>
                                            <td className="px-3 py-3">
                                                {collaborator.position}
                                            </td>
                                            <td className="px-3 py-3">
                                                {collaborator.role === 'ti'
                                                    ? 'TI'
                                                    : collaborator.role === 'operaciones'
                                                    ? 'Operaciones'
                                                    : collaborator.role === 'administracion'
                                                    ? 'Administración'
                                                    : 'Ventas'}
                                            </td>
                                            <td className="px-3 py-3">
                                                {
                                                    collaborator.immediate_supervisor
                                                }
                                            </td>
                                            <td className="px-3 py-3">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={CollaboratorController.edit(
                                                                collaborator.id,
                                                            )}
                                                        >
                                                            Editar
                                                        </Link>
                                                    </Button>

                                                    <Form
                                                        {...CollaboratorController.destroy.form(
                                                            collaborator.id,
                                                        )}
                                                    >
                                                        {({ processing }) => (
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                disabled={
                                                                    processing
                                                                }
                                                            >
                                                                Eliminar
                                                            </Button>
                                                        )}
                                                    </Form>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                            <p>
                                Mostrando {collaborators.from ?? 0} a{' '}
                                {collaborators.to ?? 0} de {collaborators.total} colaboradores
                            </p>

                            <div className="flex items-center gap-2">
                                {collaborators.links.map((link, index) => (
                                    <Button
                                        key={`${link.label}-${index}`}
                                        variant={
                                            link.active ? 'default' : 'outline'
                                        }
                                        size="sm"
                                        disabled={!link.url}
                                        asChild={Boolean(link.url)}
                                    >
                                        {link.url ? (
                                            <Link
                                                href={link.url}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        ) : (
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        )}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

CollaboratorsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Colaboradores',
            href: collaboratorsIndex(),
        },
    ],
};
