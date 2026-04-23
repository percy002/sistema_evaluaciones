import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import UserController from '@/actions/App/Http/Controllers/UserController';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
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
import { index as usersIndex, create as usersCreate } from '@/routes/users';
import type { UserRole } from '@/types';

export default function UsersCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        role: 'evaluator' as UserRole,
        password: '',
        password_confirmation: '',
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post(UserController.store.url());
    };

    return (
        <>
            <Head title="Crear usuario" />

            <div className="space-y-6 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Crear usuario</CardTitle>
                        <CardDescription>
                            Registra un nuevo administrador o evaluador.
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
                                    placeholder="Nombre completo"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(event) =>
                                        setData('email', event.target.value)
                                    }
                                    required
                                    placeholder="usuario@empresa.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="role">Role</Label>
                                <Select
                                    value={data.role}
                                    onValueChange={(value) =>
                                        setData('role', value as UserRole)
                                    }
                                >
                                    <SelectTrigger id="role" className="w-full">
                                        <SelectValue placeholder="Selecciona un rol" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="administrator">
                                            Administrador
                                        </SelectItem>
                                        <SelectItem value="evaluator">
                                            Evaluador
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.role} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <PasswordInput
                                    id="password"
                                    value={data.password}
                                    onChange={(event) =>
                                        setData('password', event.target.value)
                                    }
                                    required
                                    autoComplete="new-password"
                                    placeholder="Contraseña"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirmar contraseña
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(event) =>
                                        setData(
                                            'password_confirmation',
                                            event.target.value,
                                        )
                                    }
                                    required
                                    autoComplete="new-password"
                                    placeholder="Confirmar contraseña"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Button type="submit" disabled={processing}>
                                    Guardar usuario
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={usersIndex()}>Cancelar</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

UsersCreate.layout = {
    breadcrumbs: [
        {
            title: 'Users',
            href: usersIndex(),
        },
        {
            title: 'Create',
            href: usersCreate(),
        },
    ],
};
