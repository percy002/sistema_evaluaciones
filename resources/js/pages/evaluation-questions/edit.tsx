import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import EvaluationQuestionController from '@/actions/App/Http/Controllers/EvaluationQuestionController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { index as indexQuestion } from '@/routes/evaluation-questions';

type CompetencyOption = { id: number; name: string };
type Payload = { id: number; competency_id: number; statement: string; sort_order: number };

export default function EvaluationQuestionsEdit({ evaluationQuestion, competencies }: { evaluationQuestion: Payload; competencies: CompetencyOption[] }) {
    const { data, setData, patch, processing, errors } = useForm({
        competency_id: String(evaluationQuestion.competency_id),
        statement: evaluationQuestion.statement,
        sort_order: evaluationQuestion.sort_order,
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        patch(EvaluationQuestionController.update.url(evaluationQuestion.id));
    };

    return (
        <>
            <Head title="Editar pregunta de evaluación" />
            <div className="space-y-6 p-4">
                <Card>
                    <CardHeader><CardTitle>Editar pregunta</CardTitle><CardDescription>Actualiza los detalles de la pregunta.</CardDescription></CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-2"><Label htmlFor="competency_id">Competencia</Label><Select value={data.competency_id} onValueChange={(value) => setData('competency_id', value)}><SelectTrigger id="competency_id" className="w-full"><SelectValue /></SelectTrigger><SelectContent>{competencies.map((competency) => <SelectItem key={competency.id} value={String(competency.id)}>{competency.name}</SelectItem>)}</SelectContent></Select><InputError message={errors.competency_id} /></div>
                            <div className="grid gap-2"><Label htmlFor="statement">Enunciado</Label><Input id="statement" value={data.statement} onChange={(e) => setData('statement', e.target.value)} required /><InputError message={errors.statement} /></div>
                            <div className="grid gap-2"><Label htmlFor="sort_order">Orden</Label><Input id="sort_order" type="number" value={data.sort_order} onChange={(e) => setData('sort_order', Number(e.target.value))} min={0} required /><InputError message={errors.sort_order} /></div>
                            <div className="flex flex-wrap gap-2"><Button type="submit" disabled={processing}>Actualizar pregunta</Button><Button variant="outline" asChild><Link href={indexQuestion()}>Cancelar</Link></Button></div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

EvaluationQuestionsEdit.layout = {
    breadcrumbs: [
        { title: 'Evaluation questions', href: indexQuestion() },
        { title: 'Edit', href: indexQuestion() },
    ],
};
