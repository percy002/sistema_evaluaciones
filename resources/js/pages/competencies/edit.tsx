import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import CompetencyController from '@/actions/App/Http/Controllers/CompetencyController';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { index as indexCompetency } from '@/routes/competencies';

type TypeOption = { id: number; name: string };
type CategoryOption = { id: number; evaluation_type_id: number; name: string };
type Payload = {
    id: number;
    evaluation_type_id: number;
    evaluation_category_id: number | null;
    name: string;
    description: string | null;
    sort_order: number;
};

export default function CompetenciesEdit({
    competency,
    types,
    categories,
}: {
    competency: Payload;
    types: TypeOption[];
    categories: CategoryOption[];
}) {
    const { data, setData, patch, processing, errors } = useForm({
        evaluation_type_id: String(competency.evaluation_type_id),
        evaluation_category_id: competency.evaluation_category_id
            ? String(competency.evaluation_category_id)
            : '',
        name: competency.name,
        description: competency.description ?? '',
        sort_order: competency.sort_order,
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        patch(CompetencyController.update.url(competency.id));
    };

    const filteredCategories = categories.filter(
        (item) => String(item.evaluation_type_id) === data.evaluation_type_id,
    );

    return (
        <>
            <Head title="Editar competencia" />
            <div className="space-y-6 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Editar competencia</CardTitle>
                        <CardDescription>
                            Actualiza la configuración de la competencia.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="evaluation_type_id">Tipo</Label>
                                <Select
                                    value={data.evaluation_type_id}
                                    onValueChange={(value) => {
                                        setData('evaluation_type_id', value);
                                        setData('evaluation_category_id', '');
                                    }}
                                >
                                    <SelectTrigger
                                        id="evaluation_type_id"
                                        className="w-full"
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {types.map((type) => (
                                            <SelectItem
                                                key={type.id}
                                                value={String(type.id)}
                                            >
                                                {type.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError
                                    message={errors.evaluation_type_id}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="evaluation_category_id">
                                    Categoría (opcional)
                                </Label>
                                <Select
                                    value={
                                        data.evaluation_category_id || 'none'
                                    }
                                    onValueChange={(value) =>
                                        setData(
                                            'evaluation_category_id',
                                            value === 'none' ? '' : value,
                                        )
                                    }
                                >
                                    <SelectTrigger
                                        id="evaluation_category_id"
                                        className="w-full"
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            Sin categoría
                                        </SelectItem>
                                        {filteredCategories.map((category) => (
                                            <SelectItem
                                                key={category.id}
                                                value={String(category.id)}
                                            >
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError
                                    message={errors.evaluation_category_id}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Descripción</Label>
                                <Input
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                />
                                <InputError message={errors.description} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="sort_order">Orden</Label>
                                <Input
                                    id="sort_order"
                                    type="number"
                                    value={data.sort_order}
                                    onChange={(e) =>
                                        setData(
                                            'sort_order',
                                            Number(e.target.value),
                                        )
                                    }
                                    min={0}
                                    required
                                />
                                <InputError message={errors.sort_order} />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button type="submit" disabled={processing}>
                                    Actualizar competencia
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={indexCompetency()}>
                                        Cancelar
                                    </Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

CompetenciesEdit.layout = {
    breadcrumbs: [
        { title: 'Competencies', href: indexCompetency() },
        { title: 'Edit', href: indexCompetency() },
    ],
};
