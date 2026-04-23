import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { index as reportsIndex, show as reportsShow } from '@/routes/reports';

type Option = {
    id: number;
    name: string;
};

type ReportItem = {
    id: number;
    evaluation_date: string;
    total_score: number | null;
    average_score: number | null;
    answers_count: number;
    collaborator: { name: string; area: string; position: string };
    period: { name: string };
    evaluator: { name: string } | null;
};

type PaginatedReports = {
    data: ReportItem[];
    from: number | null;
    to: number | null;
    total: number;
};

type Filters = {
    period_id: number | null;
    collaborator_id: number | null;
    evaluator_user_id: number | null;
    status: 'completed' | 'pending' | null;
    search: string;
};

export default function ReportsIndex({
    reports,
    filters,
    filterOptions,
    questionCount,
}: {
    reports: PaginatedReports;
    filters: Filters;
    filterOptions: {
        periods: Option[];
        collaborators: Option[];
        evaluators: Option[];
    };
    questionCount: number;
}) {
    const [localFilters, setLocalFilters] = useState({
        period_id: filters.period_id ? String(filters.period_id) : '',
        collaborator_id: filters.collaborator_id ? String(filters.collaborator_id) : '',
        evaluator_user_id: filters.evaluator_user_id ? String(filters.evaluator_user_id) : '',
        status: filters.status ?? '',
        search: filters.search ?? '',
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        router.get(
            reportsIndex(),
            {
                period_id: localFilters.period_id || undefined,
                collaborator_id: localFilters.collaborator_id || undefined,
                evaluator_user_id: localFilters.evaluator_user_id || undefined,
                status: localFilters.status || undefined,
                search: localFilters.search || undefined,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const clearFilters = () => {
        setLocalFilters({
            period_id: '',
            collaborator_id: '',
            evaluator_user_id: '',
            status: '',
            search: '',
        });

        router.get(reportsIndex(), {}, { preserveState: true, replace: true });
    };

    return (
        <>
            <Head title="Reportes" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Reportes"
                    description="Consulta el historial y resultados de evaluaciones con filtros"
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Filtros</CardTitle>
                        <CardDescription>Usa filtros para limitar los resultados del reporte.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                            <Input
                                value={localFilters.search}
                                onChange={(event) => setLocalFilters({ ...localFilters, search: event.target.value })}
                                placeholder="Buscar colaborador/área/cargo"
                            />

                            <select
                                value={localFilters.period_id}
                                onChange={(event) => setLocalFilters({ ...localFilters, period_id: event.target.value })}
                                className="h-9 rounded-md border bg-transparent px-3 text-sm"
                            >
                                <option value="">Todos los periodos</option>
                                {filterOptions.periods.map((period) => (
                                    <option key={period.id} value={period.id}>
                                        {period.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={localFilters.collaborator_id}
                                onChange={(event) => setLocalFilters({ ...localFilters, collaborator_id: event.target.value })}
                                className="h-9 rounded-md border bg-transparent px-3 text-sm"
                            >
                                <option value="">Todos los colaboradores</option>
                                {filterOptions.collaborators.map((collaborator) => (
                                    <option key={collaborator.id} value={collaborator.id}>
                                        {collaborator.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={localFilters.evaluator_user_id}
                                onChange={(event) => setLocalFilters({ ...localFilters, evaluator_user_id: event.target.value })}
                                className="h-9 rounded-md border bg-transparent px-3 text-sm"
                            >
                                <option value="">Todos los evaluadores</option>
                                {filterOptions.evaluators.map((evaluator) => (
                                    <option key={evaluator.id} value={evaluator.id}>
                                        {evaluator.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={localFilters.status}
                                onChange={(event) => setLocalFilters({ ...localFilters, status: event.target.value })}
                                className="h-9 rounded-md border bg-transparent px-3 text-sm"
                            >
                                <option value="">Todos los estados</option>
                                <option value="completed">Completado</option>
                                <option value="pending">Pendiente</option>
                            </select>

                            <div className="md:col-span-2 xl:col-span-5 flex flex-wrap gap-2">
                                <Button type="submit">Aplicar filtros</Button>
                                <Button type="button" variant="outline" onClick={clearFilters}>
                                    Limpiar filtros
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Resultados</CardTitle>
                        <CardDescription>
                            Mostrando {reports.from ?? 0} a {reports.to ?? 0} de {reports.total}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-220 text-sm">
                                <thead>
                                    <tr className="border-b text-left text-muted-foreground">
                                        <th className="px-3 py-2 font-medium">Collaborator</th>
                                        <th className="px-3 py-2 font-medium">Area/Position</th>
                                        <th className="px-3 py-2 font-medium">Period</th>
                                        <th className="px-3 py-2 font-medium">Progress</th>
                                        <th className="px-3 py-2 font-medium">Total</th>
                                        <th className="px-3 py-2 font-medium">Average</th>
                                        <th className="px-3 py-2 font-medium">Evaluator</th>
                                        <th className="px-3 py-2 text-right font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.data.map((item) => (
                                        <tr key={item.id} className="border-b last:border-none">
                                            <td className="px-3 py-3 font-medium">{item.collaborator.name}</td>
                                            <td className="px-3 py-3">{item.collaborator.area} / {item.collaborator.position}</td>
                                            <td className="px-3 py-3">{item.period.name}</td>
                                            <td className="px-3 py-3">{item.answers_count} / {questionCount}</td>
                                            <td className="px-3 py-3">{item.total_score ?? 'N/A'}</td>
                                            <td className="px-3 py-3">{item.average_score ?? 'N/A'}</td>
                                            <td className="px-3 py-3">{item.evaluator?.name ?? 'N/A'}</td>
                                            <td className="px-3 py-3">
                                                <div className="flex justify-end">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={reportsShow(item.id)}>Ver reporte</Link>
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

ReportsIndex.layout = {
    breadcrumbs: [{ title: 'Reportes', href: reportsIndex() }],
};
