import { Form, Head, Link } from '@inertiajs/react';
import EvaluationController from '@/actions/App/Http/Controllers/EvaluationController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { create as createEvaluation, index as indexEvaluation } from '@/routes/evaluations';

type Item = {
    id: number;
    evaluation_date: string;
    general_comment: string;
    total_score: number | null;
    average_score: number | null;
    collaborator: { name: string; area: string; position: string };
    period: { name: string };
    evaluator: { name: string } | null;
};

type Paginated = {
    data: Item[];
    total: number;
    from: number | null;
    to: number | null;
};

function formatDate(value: string): string {
    return new Date(value).toLocaleDateString();
}

export default function EvaluationsIndex({ evaluations }: { evaluations: Paginated }) {
    return (
        <>
            <Head title="Evaluations" />
            <div className="space-y-6 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <Heading
                        title="Evaluations"
                        description="Manage evaluations by collaborator and period"
                    />
                    <Button asChild>
                        <Link href={createEvaluation()}>Create evaluation</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Evaluation list</CardTitle>
                        <CardDescription>
                            Showing {evaluations.from ?? 0} to {evaluations.to ?? 0} of {evaluations.total}
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
                                        <th className="px-3 py-2 font-medium">Date</th>
                                        <th className="px-3 py-2 font-medium">Evaluator</th>
                                        <th className="px-3 py-2 font-medium">Total</th>
                                        <th className="px-3 py-2 font-medium">Average</th>
                                        <th className="px-3 py-2 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {evaluations.data.map((item) => (
                                        <tr key={item.id} className="border-b last:border-none">
                                            <td className="px-3 py-3 font-medium">{item.collaborator.name}</td>
                                            <td className="px-3 py-3">{item.collaborator.area} / {item.collaborator.position}</td>
                                            <td className="px-3 py-3">{item.period.name}</td>
                                            <td className="px-3 py-3">{formatDate(item.evaluation_date)}</td>
                                            <td className="px-3 py-3">{item.evaluator?.name ?? 'N/A'}</td>
                                            <td className="px-3 py-3">{item.total_score ?? 'N/A'}</td>
                                            <td className="px-3 py-3">{item.average_score ?? 'N/A'}</td>
                                            <td className="px-3 py-3">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={EvaluationController.edit(item.id)}>Edit</Link>
                                                    </Button>
                                                    <Form {...EvaluationController.destroy.form(item.id)}>
                                                        {({ processing }) => (
                                                            <Button variant="destructive" size="sm" disabled={processing}>
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
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

EvaluationsIndex.layout = {
    breadcrumbs: [{ title: 'Evaluations', href: indexEvaluation() }],
};
