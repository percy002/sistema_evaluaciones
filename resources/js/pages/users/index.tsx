import { Form, Head, Link } from '@inertiajs/react';
import UserController from '@/actions/App/Http/Controllers/UserController';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { index as usersIndex, create as usersCreate } from '@/routes/users';

type UserItem = {
    id: number;
    name: string;
    email: string;
    role: 'administrator' | 'evaluator';
    email_verified_at: string | null;
    created_at: string;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedUsers = {
    data: UserItem[];
    from: number | null;
    to: number | null;
    total: number;
    links: PaginationLink[];
};

export default function UsersIndex({ users }: { users: PaginatedUsers }) {
    return (
        <>
            <Head title="Users" />

            <div className="space-y-6 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <Heading
                        title="Users"
                        description="Manage administrators and evaluators"
                    />

                    <Button asChild>
                        <Link href={usersCreate()}>Create user</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>User list</CardTitle>
                        <CardDescription>
                            {users.total} registered users
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-180 text-sm">
                                <thead>
                                    <tr className="border-b text-left text-muted-foreground">
                                        <th className="px-3 py-2 font-medium">
                                            Name
                                        </th>
                                        <th className="px-3 py-2 font-medium">
                                            Email
                                        </th>
                                        <th className="px-3 py-2 font-medium">
                                            Role
                                        </th>
                                        <th className="px-3 py-2 font-medium">
                                            Verified
                                        </th>
                                        <th className="px-3 py-2 text-right font-medium">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {users.data.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="border-b last:border-none"
                                        >
                                            <td className="px-3 py-3 font-medium">
                                                {user.name}
                                            </td>
                                            <td className="px-3 py-3">
                                                {user.email}
                                            </td>
                                            <td className="px-3 py-3">
                                                <Badge
                                                    variant={
                                                        user.role ===
                                                        'administrator'
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {user.role}
                                                </Badge>
                                            </td>
                                            <td className="px-3 py-3">
                                                {user.email_verified_at
                                                    ? 'Yes'
                                                    : 'No'}
                                            </td>
                                            <td className="px-3 py-3">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={UserController.edit(
                                                                user.id,
                                                            )}
                                                        >
                                                            Edit
                                                        </Link>
                                                    </Button>

                                                    <Form
                                                        {...UserController.destroy.form(
                                                            user.id,
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
                                Showing {users.from ?? 0} to {users.to ?? 0}
                            </p>

                            <div className="flex items-center gap-2">
                                {users.links.map((link, index) => (
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

UsersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Users',
            href: usersIndex(),
        },
    ],
};
