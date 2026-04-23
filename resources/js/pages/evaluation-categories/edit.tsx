import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import EvaluationCategoryController from '@/actions/App/Http/Controllers/EvaluationCategoryController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { index as indexCategory } from '@/routes/evaluation-categories';

type TypeOption = { id: number; name: string };
type Payload = { id: number; evaluation_type_id: number; name: string; description: string | null; sort_order: number; role: string };

export default function EvaluationCategoriesEdit({ evaluationCategory, types }: { evaluationCategory: Payload; types: TypeOption[] }) {
    const { data, setData, patch, processing, errors } = useForm({
        evaluation_type_id: String(evaluationCategory.evaluation_type_id),
        role: evaluationCategory.role ?? 'ventas',
        name: evaluationCategory.name,
        description: evaluationCategory.description ?? '',
        sort_order: evaluationCategory.sort_order,
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        patch(EvaluationCategoryController.update.url(evaluationCategory.id));
    };

    return (
        <>
            <Head title="Edit category" />
            <div className="space-y-6 p-4">
                <Card>
                    <CardHeader><CardTitle>Edit category</CardTitle><CardDescription>Update category details.</CardDescription></CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="evaluation_type_id">Type</Label>
                                <Select value={data.evaluation_type_id} onValueChange={(value) => setData('evaluation_type_id', value)}>
                                    <SelectTrigger id="evaluation_type_id" className="w-full"><SelectValue /></SelectTrigger>
                                    <SelectContent>{types.map((type) => <SelectItem key={type.id} value={String(type.id)}>{type.name}</SelectItem>)}</SelectContent>
                                </Select>
                                <InputError message={errors.evaluation_type_id} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="role">Role</Label>
                                <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                                    <SelectTrigger id="role" className="w-full"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ventas">Ventas</SelectItem>
                                        <SelectItem value="operaciones">Operaciones</SelectItem>
                                        <SelectItem value="ti">TI</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.role} />
                            </div>
                            <div className="grid gap-2"><Label htmlFor="name">Name</Label><Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required /><InputError message={errors.name} /></div>
                            <div className="grid gap-2"><Label htmlFor="description">Description</Label><Input id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} /><InputError message={errors.description} /></div>
                            <div className="grid gap-2"><Label htmlFor="sort_order">Order</Label><Input id="sort_order" type="number" value={data.sort_order} onChange={(e) => setData('sort_order', Number(e.target.value))} min={0} required /><InputError message={errors.sort_order} /></div>
                            <div className="flex flex-wrap gap-2"><Button type="submit" disabled={processing}>Update category</Button><Button variant="outline" asChild><Link href={indexCategory()}>Cancel</Link></Button></div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

EvaluationCategoriesEdit.layout = {
    breadcrumbs: [
        { title: 'Evaluation categories', href: indexCategory() },
        { title: 'Edit', href: indexCategory() },
    ],
};
