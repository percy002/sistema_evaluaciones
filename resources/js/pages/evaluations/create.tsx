import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import EvaluationController from '@/actions/App/Http/Controllers/EvaluationController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { create as createEvaluation, index as indexEvaluation } from '@/routes/evaluations';

type CollaboratorOption = { id: number; name: string; area: string; position: string };
type PeriodOption = { id: number; name: string; start_date: string; end_date: string };

export default function EvaluationsCreate({ collaborators, periods }: { collaborators: CollaboratorOption[]; periods: PeriodOption[] }) {
    const { data, setData, post, processing, errors } = useForm({
        collaborator_id: collaborators[0]?.id.toString() ?? '',
        period_id: periods[0]?.id.toString() ?? '',
        general_comment: '',
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post(EvaluationController.store.url());
    };

    return (
        <>
            <Head title="Create evaluation" />
            <div className="space-y-6 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Create evaluation</CardTitle>
                        <CardDescription>Assign collaborator, period and add required general comment.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="collaborator_id">Collaborator</Label>
                                <Select value={data.collaborator_id} onValueChange={(value) => setData('collaborator_id', value)}>
                                    <SelectTrigger id="collaborator_id" className="w-full"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {collaborators.map((item) => (
                                            <SelectItem key={item.id} value={String(item.id)}>
                                                {item.name} - {item.area} / {item.position}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.collaborator_id} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="period_id">Period</Label>
                                <Select value={data.period_id} onValueChange={(value) => setData('period_id', value)}>
                                    <SelectTrigger id="period_id" className="w-full"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {periods.map((item) => (
                                            <SelectItem key={item.id} value={String(item.id)}>
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.period_id} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="general_comment">General comment</Label>
                                <Textarea
                                    id="general_comment"
                                    value={data.general_comment}
                                    onChange={(event) => setData('general_comment', event.target.value)}
                                    required
                                    placeholder="Write an overall evaluation comment"
                                />
                                <InputError message={errors.general_comment} />
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Button type="submit" disabled={processing}>Save evaluation</Button>
                                <Button variant="outline" asChild><Link href={indexEvaluation()}>Cancel</Link></Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

EvaluationsCreate.layout = {
    breadcrumbs: [
        { title: 'Evaluations', href: indexEvaluation() },
        { title: 'Create', href: createEvaluation() },
    ],
};
