import { Form, Head, Link } from '@inertiajs/react';
import EvaluationTypeController from '@/actions/App/Http/Controllers/EvaluationTypeController';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { create as createType, index as indexType } from '@/routes/evaluation-types';

type Item = { id: number; name: string; code: 'qualitative' | 'quantitative' };
type LinkItem = { url: string | null; label: string; active: boolean };
type Paginated = { data: Item[]; from: number | null; to: number | null; total: number; links: LinkItem[] };

export default function EvaluationTypesIndex({ evaluationTypes }: { evaluationTypes: Paginated }) {
    return (
        <>
            <Head title="Tipos de evaluación" />
            <div className="space-y-6 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <Heading title="Tipos de evaluación" description="Gestionar tipos cualitativos y cuantitativos" />
                    <Button asChild>
                        <Link href={createType()}>Crear tipo</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Lista de tipos</CardTitle>
                        <CardDescription>{evaluationTypes.total} tipos configurados</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-140 text-sm">
                                <thead>
                                    <tr className="border-b text-left text-muted-foreground">
                                        <th className="px-3 py-2 font-medium">Nombre</th>
                                        <th className="px-3 py-2 font-medium">Código</th>
                                        <th className="px-3 py-2 text-right font-medium">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {evaluationTypes.data.map((item) => (
                                        <tr key={item.id} className="border-b last:border-none">
                                            <td className="px-3 py-3 font-medium">{item.name}</td>
                                            <td className="px-3 py-3">
                                                <Badge variant={item.code === 'qualitative' ? 'default' : 'secondary'}>{item.code}</Badge>
                                            </td>
                                            <td className="px-3 py-3">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={EvaluationTypeController.edit(item.id)}>Editar</Link>
                                                    </Button>
                                                    <Form {...EvaluationTypeController.destroy.form(item.id)}>
                                                        {({ processing }) => (
                                                            <Button variant="destructive" size="sm" disabled={processing}>Eliminar</Button>
                                                        )}
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

EvaluationTypesIndex.layout = {
    breadcrumbs: [{ title: 'Tipos de evaluación', href: indexType() }],
};
