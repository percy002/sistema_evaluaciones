import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import EvaluationController from '@/actions/App/Http/Controllers/EvaluationController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { create as createEvaluation, index as indexEvaluation } from '@/routes/evaluations';
import { useState } from 'react';

type CollaboratorOption = { id: number; name: string; area: string; position: string };
type PeriodOption = { id: number; name: string; start_date: string; end_date: string };


export default function EvaluationsCreate({ collaborators, periods }: { collaborators: CollaboratorOption[]; periods: PeriodOption[] }) {
    const [useCustomDates, setUseCustomDates] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        collaborator_id: collaborators[0]?.id.toString() ?? '',
        period_id: periods[0]?.id.toString() ?? '',
        general_comment: '',
        custom_start_date: '',
        custom_end_date: '',
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post(EvaluationController.store.url());
    };

    return (
        <>
            <Head title="Crear evaluación" />
            <div className="space-y-6 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Crear evaluación</CardTitle>
                        <CardDescription>Asigna colaborador y periodo, o usa fechas personalizadas. El comentario general es obligatorio.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="collaborator_id">Colaborador</Label>
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

                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="date_mode"
                                        checked={!useCustomDates}
                                        onChange={() => setUseCustomDates(false)}
                                    />
                                    Usar periodo
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="date_mode"
                                        checked={useCustomDates}
                                        onChange={() => setUseCustomDates(true)}
                                    />
                                    Fechas personalizadas
                                </label>
                            </div>

                            {!useCustomDates ? (
                                <div className="grid gap-2">
                                    <Label htmlFor="period_id">Periodo</Label>
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
                            ) : (
                                <div className="grid gap-2 md:grid-cols-2">
                                    <div>
                                        <Label htmlFor="custom_start_date">Fecha inicio</Label>
                                        <Input
                                            id="custom_start_date"
                                            type="date"
                                            value={data.custom_start_date}
                                            onChange={e => setData('custom_start_date', e.target.value)}
                                        />
                                        <InputError message={errors.custom_start_date} />
                                    </div>
                                    <div>
                                        <Label htmlFor="custom_end_date">Fecha fin</Label>
                                        <Input
                                            id="custom_end_date"
                                            type="date"
                                            value={data.custom_end_date}
                                            onChange={e => setData('custom_end_date', e.target.value)}
                                        />
                                        <InputError message={errors.custom_end_date} />
                                    </div>
                                </div>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="general_comment">Comentario general</Label>
                                <Textarea
                                    id="general_comment"
                                    value={data.general_comment}
                                    onChange={(event) => setData('general_comment', event.target.value)}
                                    placeholder="Escribe un comentario general de la evaluación (opcional)"
                                />
                                <InputError message={errors.general_comment} />
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Button type="submit" disabled={processing}>Guardar evaluación</Button>
                                <Button variant="outline" asChild><Link href={indexEvaluation()}>Cancelar</Link></Button>
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
        { title: 'Evaluaciones', href: indexEvaluation() },
        { title: 'Crear', href: createEvaluation() },
    ],
};
