import { Head, Link } from '@inertiajs/react';
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
    index as scoringIndex,
    create as scoringCreate,
    edit as scoringEdit,
} from '@/routes/evaluation-scoring';

type Item = {
    id: number;
    evaluation_date: string;
    answers_count: number;
    total_score: number | null;
    average_score: number | null;
    collaborator: { name: string; area: string; position: string };
    period: { name: string };
};

type Paginated = {
    data: Item[];
    from: number | null;
    to: number | null;
    total: number;
};

export default function EvaluationScoringIndex({
    evaluations,
    questionCount,
}: {
    evaluations: Paginated;
    questionCount: number;
}) {
    return (
        <>
            <Head title="Formulario de calificación" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Formulario de calificación"
                    description="Selecciona una evaluación creada y completa las puntuaciones de 1 a 5 por pregunta"
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Evaluaciones para calificar</CardTitle>
                        <CardDescription>
                            Mostrando {evaluations.from ?? 0} a{' '}
                            {evaluations.to ?? 0} de {evaluations.total}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-220 text-sm">
                                <thead>
                                    <tr className="border-b text-left text-muted-foreground">
                                        <th className="px-3 py-2 font-medium">
                                            Colaborador
                                        </th>
                                        <th className="px-3 py-2 font-medium">
                                            Área/Posición
                                        </th>
                                        <th className="px-3 py-2 font-medium">
                                            Periodo
                                        </th>
                                        <th className="px-3 py-2 font-medium">
                                            Progreso
                                        </th>
                                        <th className="px-3 py-2 font-medium">
                                            Total
                                        </th>
                                        <th className="px-3 py-2 font-medium">
                                            Promedio
                                        </th>
                                        <th className="px-3 py-2 text-right font-medium">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {evaluations.data.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="border-b last:border-none"
                                        >
                                            <td className="px-3 py-3 font-medium">
                                                {item.collaborator.name}
                                            </td>
                                            <td className="px-3 py-3">
                                                {item.collaborator.area} /{' '}
                                                {item.collaborator.position}
                                            </td>
                                            <td className="px-3 py-3">
                                                {item.period ? item.period.name : 'Sin periodo'}
                                            </td>
                                            <td className="px-3 py-3">
                                                {item.answers_count} /{' '}
                                                {questionCount}
                                            </td>
                                            <td className="px-3 py-3">
                                                {item.total_score ?? 'N/A'}
                                            </td>
                                            <td className="px-3 py-3">
                                                {item.average_score ?? 'N/A'}
                                            </td>
                                            <td className="px-3 py-3">
                                                <div className="flex justify-end">
                                                    <Button asChild size="sm">
                                                        <Link
                                                            href={
                                                                item.answers_count >
                                                                0
                                                                    ? scoringEdit(
                                                                          item.id,
                                                                      )
                                                                    : scoringCreate(
                                                                          {
                                                                              query: {
                                                                                  evaluation_id:
                                                                                      item.id,
                                                                              },
                                                                          },
                                                                      )
                                                            }
                                                        >
                                                            {item.answers_count >
                                                            0
                                                                ? 'Editar calificación'
                                                                : 'Iniciar calificación'}
                                                        </Link>
                                                    </Button>
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

EvaluationScoringIndex.layout = {
    breadcrumbs: [
        { title: 'Formulario de calificación', href: scoringIndex() },
    ],
};
