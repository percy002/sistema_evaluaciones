import { Head, Link, useForm } from '@inertiajs/react';
import { Fragment, type FormEvent, useMemo, useState } from 'react';
import { Frown, Laugh, Meh, Smile, SmilePlus } from 'lucide-react';
import InputError from '@/components/input-error';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import EvaluationScoringController from '@/actions/App/Http/Controllers/EvaluationScoringController';
import { index as scoringIndex } from '@/routes/evaluation-scoring';

type Row = {
    id: number;
    statement: string;
    competency: {
        name: string | null;
        type_name: string | null;
        type_code: string | null;
        category: string | null;
    };
    sort_order: number;
};

type EvaluationData = {
    id: number;
    collaborator: {
        name: string;
        area: string;
        position: string;
        immediate_supervisor: string;
    };
    period: {
        name: string;
    };
    general_comment?: string | null;
};

type ScoreMap = Record<string, number>;

type Summary = {
    general: {
        total_score: number;
        average_score: number | null;
        answers_count: number;
    };
    by_competency: Array<{
        competency_id: number | null;
        competency_name: string | null;
        type_name: string | null;
        category_name: string | null;
        total_score: number;
        average_score: number | null;
        answers_count: number;
    }>;
    by_category: Array<{
        category_name: string;
        total_score: number;
        average_score: number | null;
        answers_count: number;
    }>;
};

const scaleOptions = [
    {
        value: 1,
        label: 'Muy bajo',
        icon: Frown,
        classes:
            'border-slate-300 bg-slate-100 text-slate-500 hover:bg-slate-200 peer-checked:border-red-400 peer-checked:bg-red-200 peer-checked:text-red-950',
    },
    {
        value: 2,
        label: 'Bajo',
        icon: Meh,
        classes:
            'border-slate-300 bg-slate-100 text-slate-500 hover:bg-slate-200 peer-checked:border-orange-400 peer-checked:bg-orange-200 peer-checked:text-orange-950',
    },
    {
        value: 3,
        label: 'Aceptable',
        icon: Smile,
        classes:
            'border-slate-300 bg-slate-100 text-slate-500 hover:bg-slate-200 peer-checked:border-amber-400 peer-checked:bg-amber-200 peer-checked:text-amber-950',
    },
    {
        value: 4,
        label: 'Bueno',
        icon: SmilePlus,
        classes:
            'border-slate-300 bg-slate-100 text-slate-500 hover:bg-slate-200 peer-checked:border-emerald-400 peer-checked:bg-emerald-200 peer-checked:text-emerald-950',
    },
    {
        value: 5,
        label: 'Excelente',
        icon: Laugh,
        classes:
            'border-slate-300 bg-slate-100 text-slate-500 hover:bg-slate-200 peer-checked:border-sky-400 peer-checked:bg-sky-200 peer-checked:text-sky-950',
    },
];

export default function EvaluationScoringCreate({
    evaluation,
    rows,
    answers,
    summary,
}: {
    evaluation: EvaluationData;
    rows: Row[];
    answers: ScoreMap;
    summary: Summary;
}) {
    const [clientError, setClientError] = useState<string | null>(null);

    const initialAnswers = useMemo<Record<string, number | ''>>(() => {
        const mapped: Record<string, number | ''> = {};

        rows.forEach((row) => {
            mapped[String(row.id)] = answers[String(row.id)] ?? '';
        });

        return mapped;
    }, [rows, answers]);

    const sections = useMemo(() => {
        const groups: Record<
            string,
            { typeName: string | null; categoryGroups: Record<string, Row[]> }
        > = {};

        rows.forEach((row) => {
            const typeKey =
                row.competency.type_code ?? row.competency.type_name ?? 'other';
            const categoryName = row.competency.category ?? 'Sin categoría';

            if (!groups[typeKey]) {
                groups[typeKey] = {
                    typeName: row.competency.type_name,
                    categoryGroups: {},
                };
            }

            if (!groups[typeKey].categoryGroups[categoryName]) {
                groups[typeKey].categoryGroups[categoryName] = [];
            }

            groups[typeKey].categoryGroups[categoryName].push(row);
        });

        return Object.entries(groups)
            .sort(([a], [b]) => {
                const order = ['qualitative', 'quantitative'];
                const aIndex = order.indexOf(a);
                const bIndex = order.indexOf(b);

                return (
                    (aIndex === -1 ? 2 : aIndex) - (bIndex === -1 ? 2 : bIndex)
                );
            })
            .map(([, section]) => ({
                typeName: section.typeName,
                categories: Object.entries(section.categoryGroups).map(
                    ([categoryName, items]) => ({
                        categoryName,
                        competencyGroups: Object.values(
                            items.reduce(
                                (acc, row) => {
                                    const key =
                                        row.competency.name ?? String(row.id);

                                    if (!acc[key]) {
                                        acc[key] = {
                                            competencyName:
                                                row.competency.name ??
                                                'Competencia',
                                            rows: [],
                                        };
                                    }

                                    acc[key].rows.push(row);

                                    return acc;
                                },
                                {} as Record<
                                    string,
                                    { competencyName: string; rows: Row[] }
                                >,
                            ),
                        ),
                    }),
                ),
            }));
    }, [rows]);

    const { data, setData, post, processing, errors } = useForm<{
        evaluation_id: number;
        answers: Record<string, number | ''>;
        general_comment: string;
    }>({
        evaluation_id: evaluation.id,
        answers: initialAnswers,
        general_comment: evaluation.general_comment ?? '',
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const pending = rows.some((row) => !data.answers[String(row.id)]);
        if (pending) {
            setClientError('Debes seleccionar una opción en todas las filas.');
            return;
        }

        setClientError(null);
        post(EvaluationScoringController.store.url());
    };

    return (
        <>
            <Head title="Agregar calificación" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Formulario de calificación"
                    description={`${evaluation.collaborator.name} · ${evaluation.period.name}`}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Datos del colaborador</CardTitle>
                        <CardDescription>
                            {evaluation.collaborator.area} /{' '}
                            {evaluation.collaborator.position} · Jefe:{' '}
                            {evaluation.collaborator.immediate_supervisor}
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Resumen de cálculo</CardTitle>
                        <CardDescription>
                            Se actualiza cuando guardas la calificación.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-lg border p-3">
                            <p className="text-xs text-muted-foreground">
                                Total
                            </p>
                            <p className="text-2xl font-semibold">
                                {summary.general.total_score}
                            </p>
                        </div>
                        <div className="rounded-lg border p-3">
                            <p className="text-xs text-muted-foreground">
                                Promedio general
                            </p>
                            <p className="text-2xl font-semibold">
                                {summary.general.average_score ?? 'N/A'}
                            </p>
                        </div>
                        <div className="rounded-lg border p-3">
                            <p className="text-xs text-muted-foreground">
                                Respuestas
                            </p>
                            <p className="text-2xl font-semibold">
                                {summary.general.answers_count}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Escala de calificación</CardTitle>
                        <CardDescription>
                            Selecciona una sola opción por fila.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            {sections.map((section) => (
                                <div
                                    key={section.typeName ?? 'other'}
                                    className="space-y-3 rounded-xl border p-3"
                                >
                                    <div className="rounded-lg bg-muted px-3 py-2 text-sm font-semibold text-foreground">
                                        {section.typeName ??
                                            'Tipo de evaluación'}
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-240 text-sm">
                                            <thead>
                                                <tr className="border-b text-left text-muted-foreground">
                                                    <th className="px-3 py-2 font-medium">
                                                        Competencia
                                                    </th>
                                                    <th className="px-3 py-2 font-medium">
                                                        Descripción
                                                    </th>
                                                    {scaleOptions.map(
                                                        (option) => (
                                                            <th
                                                                key={
                                                                    option.value
                                                                }
                                                                className="px-3 py-2 text-center font-medium"
                                                            >
                                                                {option.label}
                                                            </th>
                                                        ),
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {section.categories.map(
                                                    (category) => (
                                                        <Fragment
                                                            key={`category-${category.categoryName}`}
                                                        >
                                                            <tr className="bg-slate-100 text-sm text-slate-700">
                                                                <td
                                                                    colSpan={7}
                                                                    className="px-3 py-2 font-semibold"
                                                                >
                                                                    {
                                                                        category.categoryName
                                                                    }
                                                                </td>
                                                            </tr>
                                                            {category.competencyGroups.map(
                                                                (group) =>
                                                                    group.rows.map(
                                                                        (
                                                                            row,
                                                                            index,
                                                                        ) => (
                                                                            <tr
                                                                                key={
                                                                                    row.id
                                                                                }
                                                                                className="border-b transition-colors last:border-none hover:bg-slate-400 dark:hover:bg-slate-800"
                                                                            >
                                                                                {index ===
                                                                                0 ? (
                                                                                    <td
                                                                                        className="px-3 py-3 align-middle font-medium"
                                                                                        rowSpan={
                                                                                            group
                                                                                                .rows
                                                                                                .length
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            group.competencyName
                                                                                        }
                                                                                    </td>
                                                                                ) : null}
                                                                                <td className="px-3 py-3 align-top">
                                                                                    {
                                                                                        row.statement
                                                                                    }
                                                                                </td>
                                                                                {scaleOptions.map(
                                                                                    (
                                                                                        option,
                                                                                    ) => {
                                                                                        const OptionIcon =
                                                                                            option.icon;

                                                                                        return (
                                                                                            <td
                                                                                                key={
                                                                                                    option.value
                                                                                                }
                                                                                                className="px-3 py-3 text-center align-top"
                                                                                            >
                                                                                                <div className="mx-auto inline-flex w-full items-center justify-center">
                                                                                                    <input
                                                                                                        id={`score-${row.id}-${option.value}`}
                                                                                                        type="radio"
                                                                                                        name={`score-${row.id}`}
                                                                                                        checked={
                                                                                                            Number(
                                                                                                                data
                                                                                                                    .answers[
                                                                                                                    String(
                                                                                                                        row.id,
                                                                                                                    )
                                                                                                                ],
                                                                                                            ) ===
                                                                                                            option.value
                                                                                                        }
                                                                                                        onChange={() =>
                                                                                                            setData(
                                                                                                                'answers',
                                                                                                                {
                                                                                                                    ...data.answers,
                                                                                                                    [String(
                                                                                                                        row.id,
                                                                                                                    )]:
                                                                                                                        option.value,
                                                                                                                },
                                                                                                            )
                                                                                                        }
                                                                                                        className="peer sr-only"
                                                                                                    />
                                                                                                    <label
                                                                                                        htmlFor={`score-${row.id}-${option.value}`}
                                                                                                        className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-colors duration-150 ${option.classes}`}
                                                                                                    >
                                                                                                        <OptionIcon className="h-4 w-4" />
                                                                                                        <span className="sr-only">
                                                                                                            {
                                                                                                                option.label
                                                                                                            }
                                                                                                        </span>
                                                                                                    </label>
                                                                                                </div>
                                                                                            </td>
                                                                                        );
                                                                                    },
                                                                                )}
                                                                            </tr>
                                                                        ),
                                                                    ),
                                                            )}
                                                        </Fragment>
                                                    ),
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}

                            <div className="grid gap-2">
                                <label
                                    htmlFor="general_comment"
                                    className="text-sm font-medium text-foreground"
                                >
                                    Comentario del evaluador
                                </label>
                                <Textarea
                                    id="general_comment"
                                    value={data.general_comment}
                                    onChange={(event) =>
                                        setData(
                                            'general_comment',
                                            event.target.value,
                                        )
                                    }
                                    className="min-h-28"
                                />
                                <InputError message={errors.general_comment} />
                            </div>

                            <InputError message={clientError ?? undefined} />
                            <InputError message={errors.answers} />

                            <div className="flex flex-wrap gap-2">
                                <Button type="submit" disabled={processing}>
                                    Guardar calificación
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={scoringIndex()}>Cancelar</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

EvaluationScoringCreate.layout = {
    breadcrumbs: [
        { title: 'Formulario de calificación', href: scoringIndex() },
        { title: 'Agregar calificación', href: scoringIndex() },
    ],
};
