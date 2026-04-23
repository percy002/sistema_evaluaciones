import { Form, Head, Link } from '@inertiajs/react';
import EvaluationCategoryController from '@/actions/App/Http/Controllers/EvaluationCategoryController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { create as createCategory, index as indexCategory } from '@/routes/evaluation-categories';

type Item = { id: number; name: string; description: string | null; sort_order: number; type: { name: string } | null };
type Paginated = { data: Item[]; total: number };

export default function EvaluationCategoriesIndex({ evaluationCategories }: { evaluationCategories: Paginated }) {
    return (
        <>
            <Head title="Evaluation categories" />
            <div className="space-y-6 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <Heading title="Evaluation categories" description="Manage category groups per type" />
                    <Button asChild><Link href={createCategory()}>Create category</Link></Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Category list</CardTitle>
                        <CardDescription>{evaluationCategories.total} categories configured</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-180 text-sm">
                                <thead>
                                    <tr className="border-b text-left text-muted-foreground">
                                        <th className="px-3 py-2 font-medium">Type</th>
                                        <th className="px-3 py-2 font-medium">Name</th>
                                        <th className="px-3 py-2 font-medium">Order</th>
                                        <th className="px-3 py-2 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {evaluationCategories.data.map((item) => (
                                        <tr key={item.id} className="border-b last:border-none">
                                            <td className="px-3 py-3">{item.type?.name ?? 'Tipo no disponible'}</td>
                                            <td className="px-3 py-3 font-medium">{item.name}</td>
                                            <td className="px-3 py-3">{item.sort_order}</td>
                                            <td className="px-3 py-3">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={EvaluationCategoryController.edit(item.id)}>Edit</Link>
                                                    </Button>
                                                    <Form {...EvaluationCategoryController.destroy.form(item.id)}>
                                                        {({ processing }) => <Button variant="destructive" size="sm" disabled={processing}>Delete</Button>}
                                                    </Form>
                                                </div>
                                            </td>
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

EvaluationCategoriesIndex.layout = {
    breadcrumbs: [{ title: 'Evaluation categories', href: indexCategory() }],
};
