import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import EvaluationTypeController from '@/actions/App/Http/Controllers/EvaluationTypeController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { create as createType, index as indexType } from '@/routes/evaluation-types';

export default function EvaluationTypesCreate() {
    const { data, setData, post, processing, errors } = useForm({ name: '', code: 'qualitative' as 'qualitative' | 'quantitative' });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post(EvaluationTypeController.store.url());
    };

    return (
        <>
            <Head title="Create evaluation type" />
            <div className="space-y-6 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Create evaluation type</CardTitle>
                        <CardDescription>Add a type for qualitative or quantitative block.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required autoFocus placeholder="Qualitative evaluation" />
                                <InputError message={errors.name} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="code">Code</Label>
                                <Select value={data.code} onValueChange={(value) => setData('code', value as 'qualitative' | 'quantitative')}>
                                    <SelectTrigger id="code" className="w-full"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="qualitative">qualitative</SelectItem>
                                        <SelectItem value="quantitative">quantitative</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.code} />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button type="submit" disabled={processing}>Save type</Button>
                                <Button variant="outline" asChild><Link href={indexType()}>Cancel</Link></Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

EvaluationTypesCreate.layout = {
    breadcrumbs: [
        { title: 'Evaluation types', href: indexType() },
        { title: 'Create', href: createType() },
    ],
};
