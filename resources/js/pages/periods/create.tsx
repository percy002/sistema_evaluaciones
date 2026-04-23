import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import PeriodController from '@/actions/App/Http/Controllers/PeriodController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { create as periodsCreate, index as periodsIndex } from '@/routes/periods';

export default function PeriodsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        start_date: '',
        end_date: '',
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post(PeriodController.store.url());
    };

    return (
        <>
            <Head title="Crear periodo" />

            <div className="space-y-6 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Crear periodo</CardTitle>
                        <CardDescription>
                            Define un periodo de evaluación con fecha de inicio y fin.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(event) =>
                                        setData('name', event.target.value)
                                    }
                                    required
                                    autoFocus
                                    placeholder="2026 - Semestre 1"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="start_date">Fecha de inicio</Label>
                                <Input
                                    id="start_date"
                                    type="date"
                                    value={data.start_date}
                                    onChange={(event) =>
                                        setData('start_date', event.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.start_date} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="end_date">Fecha de fin</Label>
                                <Input
                                    id="end_date"
                                    type="date"
                                    value={data.end_date}
                                    onChange={(event) =>
                                        setData('end_date', event.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.end_date} />
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Button type="submit" disabled={processing}>
                                    Guardar periodo
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={periodsIndex()}>Cancelar</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

PeriodsCreate.layout = {
    breadcrumbs: [
        {
            title: 'Periods',
            href: periodsIndex(),
        },
        {
            title: 'Create',
            href: periodsCreate(),
        },
    ],
};
