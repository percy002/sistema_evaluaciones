import { Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { index as reportsIndex, show as reportsShow } from '@/routes/reports';

type Summary = {
    general: {
        total_score: number;
        average_score: number | null;
        answers_count: number;
    };
    by_competency: Array<{
        competency_id: number | null;
        competency_name: string | null;
        type_name: string | null;
        category_name: string | null;
        total_score: number;
        average_score: number | null;
        answers_count: number;
    }>;
    by_category: Array<{
        category_name: string;
        total_score: number;
        average_score: number | null;
        answers_count: number;
    }>;
};

type Report = {
    id: number;
    evaluation_date: string;
    general_comment: string;
    total_score: number | null;
    average_score: number | null;
    collaborator: {
        name: string;
        area: string;
        position: string;
        immediate_supervisor: string;
    };
    period: {
        name: string;
        start_date: string;
        end_date: string;
    };
    evaluator: {
        name: string;
        email: string;
    } | null;
    answers: Array<{
        id: number;
        score: number;
        question: {
            statement: string | null;
            sort_order: number | null;
            competency_name: string | null;
            type_name: string | null;
            category_name: string | null;
        };
    }>;
};

export default function ReportsShow({ report, summary }: { report: Report; summary: Summary }) {
    return (
        <>
            <Head title={`Reporte #${report.id}`} />

            <div className="space-y-6 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <Heading
                        title={`Reporte #${report.id}`}
                        description={`${report.collaborator.name} · ${report.period.name}`}
                    />
                    <Button variant="outline" asChild>
                        <Link href={reportsIndex()}>Volver a reportes</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Detalle de la evaluación</CardTitle>
                        <CardDescription>Información general del colaborador evaluado.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 text-sm">
                        <div>
                            <p className="text-xs text-muted-foreground">Colaborador</p>
                            <p className="font-medium">{report.collaborator.name}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Área / Cargo</p>
                            <p className="font-medium">{report.collaborator.area} / {report.collaborator.position}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Supervisor inmediato</p>
                            <p className="font-medium">{report.collaborator.immediate_supervisor}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Evaluador</p>
                            <p className="font-medium">{report.evaluator?.name ?? 'N/A'}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Resumen de puntuación</CardTitle>
                        <CardDescription>Cálculo automático por competencia y categoría.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-lg border p-3">
                                <p className="text-xs text-muted-foreground">Total</p>
                                <p className="text-2xl font-semibold">{summary.general.total_score}</p>
                            </div>
                            <div className="rounded-lg border p-3">
                                <p className="text-xs text-muted-foreground">Promedio general</p>
                                <p className="text-2xl font-semibold">{summary.general.average_score ?? 'N/A'}</p>
                            </div>
                            <div className="rounded-lg border p-3">
                                <p className="text-xs text-muted-foreground">Respuestas</p>
                                <p className="text-2xl font-semibold">{summary.general.answers_count}</p>
                            </div>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-2">
                            <div className="rounded-lg border">
                                <div className="border-b px-3 py-2 text-sm font-medium">Por categoría</div>
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-120 text-sm">
                                        <thead>
                                            <tr className="border-b text-left text-muted-foreground">
                                                <th className="px-3 py-2 font-medium">Categoría</th>
                                                <th className="px-3 py-2 font-medium">Total</th>
                                                <th className="px-3 py-2 font-medium">Promedio</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {summary.by_category.map((item) => (
                                                <tr key={item.category_name} className="border-b last:border-none">
                                                    <td className="px-3 py-2">{item.category_name}</td>
                                                    <td className="px-3 py-2">{item.total_score}</td>
                                                    <td className="px-3 py-2">{item.average_score ?? 'N/A'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="rounded-lg border">
                                <div className="border-b px-3 py-2 text-sm font-medium">Por competencia</div>
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-120 text-sm">
                                        <thead>
                                            <tr className="border-b text-left text-muted-foreground">
                                                <th className="px-3 py-2 font-medium">Competencia</th>
                                                <th className="px-3 py-2 font-medium">Total</th>
                                                <th className="px-3 py-2 font-medium">Promedio</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {summary.by_competency.map((item, index) => (
                                                <tr key={item.competency_id ?? `${item.competency_name ?? 'competency'}-${index}`} className="border-b last:border-none">
                                                    <td className="px-3 py-2">
                                                        {item.competency_name ?? 'N/A'}
                                                        <p className="text-xs text-muted-foreground">
                                                            {item.type_name ?? 'N/A'} / {item.category_name ?? 'N/A'}
                                                        </p>
                                                    </td>
                                                    <td className="px-3 py-2">{item.total_score}</td>
                                                    <td className="px-3 py-2">{item.average_score ?? 'N/A'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Preguntas calificadas</CardTitle>
                        <CardDescription>Puntuaciones detalladas por pregunta y competencia.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-220 text-sm">
                                <thead>
                                    <tr className="border-b text-left text-muted-foreground">
                                        <th className="px-3 py-2 font-medium">#</th>
                                        <th className="px-3 py-2 font-medium">Pregunta</th>
                                        <th className="px-3 py-2 font-medium">Competencia</th>
                                        <th className="px-3 py-2 font-medium">Tipo/Categoría</th>
                                        <th className="px-3 py-2 font-medium">Puntaje</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {report.answers.map((answer) => (
                                        <tr key={answer.id} className="border-b last:border-none">
                                            <td className="px-3 py-2">{answer.question.sort_order ?? '-'}</td>
                                            <td className="px-3 py-2">{answer.question.statement ?? 'N/A'}</td>
                                            <td className="px-3 py-2">{answer.question.competency_name ?? 'N/A'}</td>
                                            <td className="px-3 py-2">{answer.question.type_name ?? 'N/A'} / {answer.question.category_name ?? 'N/A'}</td>
                                            <td className="px-3 py-2 font-semibold">{answer.score}</td>
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

ReportsShow.layout = {
    breadcrumbs: [{ title: 'Reportes', href: reportsIndex() }],
};
