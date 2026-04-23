import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';

type Stats = {
    evaluations_total: number;
    evaluations_completed: number;
    evaluations_pending: number;
    average_score: number | null;
    question_count: number;
    collaborators_total: number | null;
    periods_total: number | null;
    evaluators_total: number | null;
};

type GroupByPeriod = {
    period_id: number;
    period_name: string;
    evaluations_count: number;
    average_score: number | null;
};

type GroupByArea = {
    area_name: string;
    evaluations_count: number;
    average_score: number | null;
};

type RecentEvaluation = {
    id: number;
    evaluation_date: string;
    total_score: number | null;
    average_score: number | null;
    answers_count: number;
    completion_percent: number;
    collaborator: {
        name: string | null;
        area: string | null;
        position: string | null;
    };
    period: {
        name: string | null;
    };
    evaluator: {
        name: string | null;
    };
};

export default function Dashboard({
    stats,
    byPeriod,
    byArea,
    recentEvaluations,
}: {
    stats: Stats;
    byPeriod: GroupByPeriod[];
    byArea: GroupByArea[];
    recentEvaluations: RecentEvaluation[];
}) {
    return (
        <>
            <Head title="Panel" />
            <div className="space-y-6 p-4">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Evaluaciones</CardDescription>
                            <CardTitle className="text-2xl">{stats.evaluations_total}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Completadas</CardDescription>
                            <CardTitle className="text-2xl">{stats.evaluations_completed}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Pendientes</CardDescription>
                            <CardTitle className="text-2xl">{stats.evaluations_pending}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Promedio global</CardDescription>
                            <CardTitle className="text-2xl">{stats.average_score ?? 'N/A'}</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    {stats.collaborators_total !== null ? (
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Colaboradores</CardDescription>
                                <CardTitle className="text-2xl">{stats.collaborators_total}</CardTitle>
                            </CardHeader>
                        </Card>
                    ) : null}
                    {stats.periods_total !== null ? (
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Periodos</CardDescription>
                                <CardTitle className="text-2xl">{stats.periods_total}</CardTitle>
                            </CardHeader>
                        </Card>
                    ) : null}
                    {stats.evaluators_total !== null ? (
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Evaluadores</CardDescription>
                                <CardTitle className="text-2xl">{stats.evaluators_total}</CardTitle>
                            </CardHeader>
                        </Card>
                    ) : null}
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Rendimiento por periodo</CardTitle>
                            <CardDescription>Puntaje promedio y volumen por periodo</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-120 text-sm">
                                    <thead>
                                        <tr className="border-b text-left text-muted-foreground">
                                            <th className="px-3 py-2 font-medium">Periodo</th>
                                            <th className="px-3 py-2 font-medium">Evaluaciones</th>
                                            <th className="px-3 py-2 font-medium">Promedio</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {byPeriod.map((item) => (
                                            <tr key={item.period_id} className="border-b last:border-none">
                                                <td className="px-3 py-2">{item.period_name}</td>
                                                <td className="px-3 py-2">{item.evaluations_count}</td>
                                                <td className="px-3 py-2">{item.average_score ?? 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Rendimiento por área</CardTitle>
                            <CardDescription>Áreas con más evaluaciones y sus promedios</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-120 text-sm">
                                    <thead>
                                        <tr className="border-b text-left text-muted-foreground">
                                            <th className="px-3 py-2 font-medium">Área</th>
                                            <th className="px-3 py-2 font-medium">Evaluaciones</th>
                                            <th className="px-3 py-2 font-medium">Promedio</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {byArea.map((item) => (
                                            <tr key={item.area_name} className="border-b last:border-none">
                                                <td className="px-3 py-2">{item.area_name}</td>
                                                <td className="px-3 py-2">{item.evaluations_count}</td>
                                                <td className="px-3 py-2">{item.average_score ?? 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Evaluaciones recientes</CardTitle>
                        <CardDescription>Últimos registros evaluados con estado de avance</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-240 text-sm">
                                <thead>
                                    <tr className="border-b text-left text-muted-foreground">
                                        <th className="px-3 py-2 font-medium">Colaborador</th>
                                        <th className="px-3 py-2 font-medium">Área/Cargo</th>
                                        <th className="px-3 py-2 font-medium">Periodo</th>
                                        <th className="px-3 py-2 font-medium">Evaluador</th>
                                        <th className="px-3 py-2 font-medium">Avance</th>
                                        <th className="px-3 py-2 font-medium">Total</th>
                                        <th className="px-3 py-2 font-medium">Promedio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentEvaluations.map((item) => (
                                        <tr key={item.id} className="border-b last:border-none">
                                            <td className="px-3 py-2 font-medium">{item.collaborator.name ?? 'N/A'}</td>
                                            <td className="px-3 py-2">{item.collaborator.area ?? 'N/A'} / {item.collaborator.position ?? 'N/A'}</td>
                                            <td className="px-3 py-2">{item.period.name ?? 'N/A'}</td>
                                            <td className="px-3 py-2">{item.evaluator.name ?? 'N/A'}</td>
                                            <td className="px-3 py-2">{item.answers_count}/{stats.question_count} ({item.completion_percent}%)</td>
                                            <td className="px-3 py-2">{item.total_score ?? 'N/A'}</td>
                                            <td className="px-3 py-2">{item.average_score ?? 'N/A'}</td>
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

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Panel',
            href: dashboard(),
        },
    ],
};
