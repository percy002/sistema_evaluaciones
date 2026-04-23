import { Form, Head, Link } from '@inertiajs/react';
import EvaluationQuestionController from '@/actions/App/Http/Controllers/EvaluationQuestionController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { create as createQuestion, index as indexQuestion } from '@/routes/evaluation-questions';

type Item = { id: number; statement: string; sort_order: number; competency: { name: string } | null };
type Paginated = { data: Item[]; total: number };

export default function EvaluationQuestionsIndex({ evaluationQuestions }: { evaluationQuestions: Paginated }) {
    return (
        <>
            <Head title="Preguntas de evaluación" />
            <div className="space-y-6 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <Heading title="Preguntas de evaluación" description="Gestiona los indicadores/preguntas para cada competencia" />
                    <Button asChild><Link href={createQuestion()}>Crear pregunta</Link></Button>
                </div>
                <Card>
                    <CardHeader><CardTitle>Lista de preguntas</CardTitle><CardDescription>{evaluationQuestions.total} preguntas configuradas</CardDescription></CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-200 text-sm">
                                <thead>
                                    <tr className="border-b text-left text-muted-foreground">
                                        <th className="px-3 py-2 font-medium">Competencia</th>
                                        <th className="px-3 py-2 font-medium">Enunciado</th>
                                        <th className="px-3 py-2 font-medium">Orden</th>
                                        <th className="px-3 py-2 text-right font-medium">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {evaluationQuestions.data.map((item) => (
                                        <tr key={item.id} className="border-b last:border-none">
                                            <td className="px-3 py-3">{item.competency?.name ?? 'Competencia no disponible'}</td>
                                            <td className="px-3 py-3 font-medium">{item.statement}</td>
                                            <td className="px-3 py-3">{item.sort_order}</td>
                                            <td className="px-3 py-3"><div className="flex justify-end gap-2"><Button variant="outline" size="sm" asChild><Link href={EvaluationQuestionController.edit(item.id)}>Editar</Link></Button><Form {...EvaluationQuestionController.destroy.form(item.id)}>{({ processing }) => <Button variant="destructive" size="sm" disabled={processing}>Eliminar</Button>}</Form></div></td>
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

EvaluationQuestionsIndex.layout = {
    breadcrumbs: [{ title: 'Preguntas de evaluación', href: indexQuestion() }],
};
