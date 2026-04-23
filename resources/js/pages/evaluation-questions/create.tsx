import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import EvaluationQuestionController from '@/actions/App/Http/Controllers/EvaluationQuestionController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { create as createQuestion, index as indexQuestion } from '@/routes/evaluation-questions';

type CompetencyOption = { id: number; name: string };

export default function EvaluationQuestionsCreate({ competencies }: { competencies: CompetencyOption[] }) {
    const { data, setData, post, processing, errors } = useForm({
        competency_id: competencies[0]?.id.toString() ?? '',
        statement: '',
        sort_order: 0,
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post(EvaluationQuestionController.store.url());
    };

    return (
        <>
            <Head title="Create evaluation question" />
            <div className="space-y-6 p-4">
                <Card>
                    <CardHeader><CardTitle>Create question</CardTitle><CardDescription>Add a new indicator/question for a competency.</CardDescription></CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-2"><Label htmlFor="competency_id">Competency</Label><Select value={data.competency_id} onValueChange={(value) => setData('competency_id', value)}><SelectTrigger id="competency_id" className="w-full"><SelectValue /></SelectTrigger><SelectContent>{competencies.map((competency) => <SelectItem key={competency.id} value={String(competency.id)}>{competency.name}</SelectItem>)}</SelectContent></Select><InputError message={errors.competency_id} /></div>
                            <div className="grid gap-2"><Label htmlFor="statement">Statement</Label><Input id="statement" value={data.statement} onChange={(e) => setData('statement', e.target.value)} required /><InputError message={errors.statement} /></div>
                            <div className="grid gap-2"><Label htmlFor="sort_order">Order</Label><Input id="sort_order" type="number" value={data.sort_order} onChange={(e) => setData('sort_order', Number(e.target.value))} min={0} required /><InputError message={errors.sort_order} /></div>
                            <div className="flex flex-wrap gap-2"><Button type="submit" disabled={processing}>Save question</Button><Button variant="outline" asChild><Link href={indexQuestion()}>Cancel</Link></Button></div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

EvaluationQuestionsCreate.layout = {
    breadcrumbs: [
        { title: 'Evaluation questions', href: indexQuestion() },
        { title: 'Create', href: createQuestion() },
    ],
};
