import { Link, usePage } from '@inertiajs/react';
import { BarChart3, BookOpen, CalendarDays, ClipboardCheck, FolderGit2, LayoutGrid, Users, UserRoundSearch } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as collaboratorsIndex } from '@/routes/collaborators';
import { index as competenciesIndex } from '@/routes/competencies';
import { index as evaluationCategoriesIndex } from '@/routes/evaluation-categories';
import { index as evaluationQuestionsIndex } from '@/routes/evaluation-questions';
import { index as evaluationScoringIndex } from '@/routes/evaluation-scoring';
import { index as evaluationTypesIndex } from '@/routes/evaluation-types';
import { index as evaluationsIndex } from '@/routes/evaluations';
import { index as periodsIndex } from '@/routes/periods';
import { index as reportsIndex } from '@/routes/reports';
import { index as usersIndex } from '@/routes/users';
import type { Auth, NavItem } from '@/types';

const footerNavItems: NavItem[] = [
    {
        title: 'Repositorio',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentación',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;

    const mainNavItems: NavItem[] = [
        {
            title: 'Panel',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'Evaluaciones',
            href: evaluationsIndex(),
            icon: ClipboardCheck,
        },
        {
            title: 'Formulario de calificación',
            href: evaluationScoringIndex(),
            icon: ClipboardCheck,
        },
        {
            title: 'Reportes',
            href: reportsIndex(),
            icon: BarChart3,
        },
        ...(auth.user.role === 'administrator'
            ? [
                  {
                      title: 'Periodos',
                      href: periodsIndex(),
                      icon: CalendarDays,
                  },
                  {
                      title: 'Tipos de evaluación',
                      href: evaluationTypesIndex(),
                      icon: CalendarDays,
                  },
                  {
                      title: 'Categorías de evaluación',
                      href: evaluationCategoriesIndex(),
                      icon: CalendarDays,
                  },
                  {
                      title: 'Competencias',
                      href: competenciesIndex(),
                      icon: CalendarDays,
                  },
                  {
                      title: 'Preguntas de evaluación',
                      href: evaluationQuestionsIndex(),
                      icon: CalendarDays,
                  },
                  {
                      title: 'Colaboradores',
                      href: collaboratorsIndex(),
                      icon: UserRoundSearch,
                  },
                  {
                      title: 'Usuarios',
                      href: usersIndex(),
                      icon: Users,
                  },
              ]
            : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
