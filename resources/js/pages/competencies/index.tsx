import { Form, Head, Link } from '@inertiajs/react';
import CompetencyController from '@/actions/App/Http/Controllers/CompetencyController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { create as createCompetency, index as indexCompetency } from '@/routes/competencies';

type Item = {
    id: number;
    name: string;
    sort_order: number;
    type: { name: string } | null;
    category: { name: string } | null;
};
type Paginated = { data: Item[]; total: number };

export default function CompetenciesIndex({ competencies }: { competencies: Paginated }) {
    return (
        <>
            <Head title="Competencias" />
            <div className="space-y-6 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <Heading title="Competencias" description="Gestionar competencias vinculadas a tipos y categorías opcionales" />
                    <Button asChild><Link href={createCompetency()}>Crear competencia</Link></Button>
                </div>
                <Card>
                    <CardHeader><CardTitle>Lista de competencias</CardTitle><CardDescription>{competencies.total} competencias configuradas</CardDescription></CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-200 text-sm">
                                <thead>
                                    <tr className="border-b text-left text-muted-foreground">
                                        <th className="px-3 py-2 font-medium">Tipo</th>
                                        <th className="px-3 py-2 font-medium">Categoría</th>
                                        <th className="px-3 py-2 font-medium">Nombre</th>
                                        <th className="px-3 py-2 font-medium">Orden</th>
                                        <th className="px-3 py-2 text-right font-medium">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {competencies.data.map((item) => (
                                        <tr key={item.id} className="border-b last:border-none">
                                            <td className="px-3 py-3">{item.type?.name ?? 'Tipo no disponible'}</td>
                                            <td className="px-3 py-3">{item.category?.name ?? 'Categoría no disponible'}</td>
                                            <td className="px-3 py-3 font-medium">{item.name}</td>
                                            <td className="px-3 py-3">{item.sort_order}</td>
                                            <td className="px-3 py-3">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="sm" asChild><Link href={CompetencyController.edit(item.id)}>Editar</Link></Button>
                                                    <Form {...CompetencyController.destroy.form(item.id)}>
                                                        {({ processing }) => <Button variant="destructive" size="sm" disabled={processing}>Eliminar</Button>}
                                                    </Form>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

CompetenciesIndex.layout = {
    breadcrumbs: [{ title: 'Competencias', href: indexCompetency() }],
};
