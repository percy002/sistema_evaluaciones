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
                        title="Collaborators"
                        description="Manage collaborator records by role and position"
                    />

                    <Button asChild>
                        <Link href={collaboratorsCreate()}>
                            Create collaborator
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Collaborator list</CardTitle>
                        <CardDescription>
                            {collaborators.total} collaborators registered
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-180 text-sm">
                                <thead>
                                    <tr className="border-b text-left text-muted-foreground">
                                        <th className="px-3 py-2 font-medium">
                                            Name
                                        </th>
                                        <th className="px-3 py-2 font-medium">
                                            Position
                                        </th>
                                        <th className="px-3 py-2 font-medium">
                                            Role
                                        </th>
                                        <th className="px-3 py-2 font-medium">
                                            Immediate supervisor
                                        </th>
                                        <th className="px-3 py-2 text-right font-medium">
                                            Actions
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
                                                            Edit
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
                                                                Delete
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
                                Showing {collaborators.from ?? 0} to{' '}
                                {collaborators.to ?? 0}
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
            title: 'Collaborators',
            href: collaboratorsIndex(),
        },
    ],
};
