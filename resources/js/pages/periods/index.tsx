import { Form, Head, Link } from '@inertiajs/react';
import PeriodController from '@/actions/App/Http/Controllers/PeriodController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { create as periodsCreate, index as periodsIndex } from '@/routes/periods';

type PeriodItem = {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    created_at: string;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedPeriods = {
    data: PeriodItem[];
    from: number | null;
    to: number | null;
    total: number;
    links: PaginationLink[];
};

function formatDate(value: string): string {
    return new Date(value).toLocaleDateString();
}

export default function PeriodsIndex({ periods }: { periods: PaginatedPeriods }) {
    return (
        <>
            <Head title="Periods" />

            <div className="space-y-6 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <Heading
                        title="Periods"
                        description="Manage evaluation periods"
                    />

                    <Button asChild>
                        <Link href={periodsCreate()}>Create period</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Period list</CardTitle>
                        <CardDescription>
                            {periods.total} periods registered
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-180 text-sm">
                                <thead>
                                    <tr className="border-b text-left text-muted-foreground">
                                        <th className="px-3 py-2 font-medium">Name</th>
                                        <th className="px-3 py-2 font-medium">
                                            Start date
                                        </th>
                                        <th className="px-3 py-2 font-medium">
                                            End date
                                        </th>
                                        <th className="px-3 py-2 text-right font-medium">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {periods.data.map((period) => (
                                        <tr
                                            key={period.id}
                                            className="border-b last:border-none"
                                        >
                                            <td className="px-3 py-3 font-medium">
                                                {period.name}
                                            </td>
                                            <td className="px-3 py-3">
                                                {formatDate(period.start_date)}
                                            </td>
                                            <td className="px-3 py-3">
                                                {formatDate(period.end_date)}
                                            </td>
                                            <td className="px-3 py-3">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={PeriodController.edit(
                                                                period.id,
                                                            )}
                                                        >
                                                            Edit
                                                        </Link>
                                                    </Button>

                                                    <Form
                                                        {...PeriodController.destroy.form(
                                                            period.id,
                                                        )}
                                                    >
                                                        {({ processing }) => (
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                disabled={
                                                                    processing
                                                                }
                                                            >
                                                                Delete
                                                            </Button>
                                                        )}
                                                    </Form>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                            <p>
                                Showing {periods.from ?? 0} to {periods.to ?? 0}
                            </p>

                            <div className="flex items-center gap-2">
                                {periods.links.map((link, index) => (
                                    <Button
                                        key={`${link.label}-${index}`}
                                        variant={
                                            link.active ? 'default' : 'outline'
                                        }
                                        size="sm"
                                        disabled={!link.url}
                                        asChild={Boolean(link.url)}
                                    >
                                        {link.url ? (
                                            <Link
                                                href={link.url}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        ) : (
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        )}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

PeriodsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Periods',
            href: periodsIndex(),
        },
    ],
};
