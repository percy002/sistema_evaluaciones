import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import CompetencyController from '@/actions/App/Http/Controllers/CompetencyController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { create as createCompetency, index as indexCompetency } from '@/routes/competencies';

type TypeOption = { id: number; name: string };
type CategoryOption = { id: number; evaluation_type_id: number; name: string };

export default function CompetenciesCreate({ types, categories }: { types: TypeOption[]; categories: CategoryOption[] }) {
    const { data, setData, post, processing, errors } = useForm({
        evaluation_type_id: types[0]?.id.toString() ?? '',
        evaluation_category_id: '',
        name: '',
        description: '',
        sort_order: 0,
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post(CompetencyController.store.url());
    };

    const filteredCategories = categories.filter((item) => String(item.evaluation_type_id) === data.evaluation_type_id);

    return (
        <>
            <Head title="Create competency" />
            <div className="space-y-6 p-4">
                <Card>
                    <CardHeader><CardTitle>Create competency</CardTitle><CardDescription>Define a competency and link optional category.</CardDescription></CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="evaluation_type_id">Type</Label>
                                <Select value={data.evaluation_type_id} onValueChange={(value) => { setData('evaluation_type_id', value); setData('evaluation_category_id', ''); }}>
                                    <SelectTrigger id="evaluation_type_id" className="w-full"><SelectValue /></SelectTrigger>
                                    <SelectContent>{types.map((type) => <SelectItem key={type.id} value={String(type.id)}>{type.name}</SelectItem>)}</SelectContent>
                                </Select>
                                <InputError message={errors.evaluation_type_id} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="evaluation_category_id">Category (optional)</Label>
                                <Select value={data.evaluation_category_id || 'none'} onValueChange={(value) => setData('evaluation_category_id', value === 'none' ? '' : value)}>
                                    <SelectTrigger id="evaluation_category_id" className="w-full"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">No category</SelectItem>
                                        {filteredCategories.map((category) => <SelectItem key={category.id} value={String(category.id)}>{category.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.evaluation_category_id} />
                            </div>
                            <div className="grid gap-2"><Label htmlFor="name">Name</Label><Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required /><InputError message={errors.name} /></div>
                            <div className="grid gap-2"><Label htmlFor="description">Description</Label><Input id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} /><InputError message={errors.description} /></div>
                            <div className="grid gap-2"><Label htmlFor="sort_order">Order</Label><Input id="sort_order" type="number" value={data.sort_order} onChange={(e) => setData('sort_order', Number(e.target.value))} min={0} required /><InputError message={errors.sort_order} /></div>
                            <div className="flex flex-wrap gap-2"><Button type="submit" disabled={processing}>Save competency</Button><Button variant="outline" asChild><Link href={indexCompetency()}>Cancel</Link></Button></div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

CompetenciesCreate.layout = {
    breadcrumbs: [
        { title: 'Competencies', href: indexCompetency() },
        { title: 'Create', href: createCompetency() },
    ],
};
