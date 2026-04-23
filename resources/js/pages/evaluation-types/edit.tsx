import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import EvaluationTypeController from '@/actions/App/Http/Controllers/EvaluationTypeController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { index as indexType } from '@/routes/evaluation-types';

type Payload = { id: number; name: string; code: 'qualitative' | 'quantitative' };

export default function EvaluationTypesEdit({ evaluationType }: { evaluationType: Payload }) {
    const { data, setData, patch, processing, errors } = useForm({ name: evaluationType.name, code: evaluationType.code });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        patch(EvaluationTypeController.update.url(evaluationType.id));
    };

    return (
        <>
            <Head title="Editar tipo de evaluación" />
            <div className="space-y-6 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Editar tipo de evaluación</CardTitle>
                        <CardDescription>Actualiza nombre y código.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required autoFocus />
                                <InputError message={errors.name} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="code">Código</Label>
                                <Select value={data.code} onValueChange={(value) => setData('code', value as 'qualitative' | 'quantitative')}>
                                    <SelectTrigger id="code" className="w-full"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="qualitative">cualitativa</SelectItem>
                                        <SelectItem value="quantitative">cuantitativa</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.code} />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button type="submit" disabled={processing}>Actualizar tipo</Button>
                                <Button variant="outline" asChild><Link href={indexType()}>Cancelar</Link></Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

EvaluationTypesEdit.layout = {
    breadcrumbs: [
        { title: 'Evaluation types', href: indexType() },
        { title: 'Edit', href: indexType() },
    ],
};
