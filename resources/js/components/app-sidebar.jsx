import { Link } from '@inertiajs/react';
import {
    BarChart3,
    BookOpen,
    Building2,
    FolderGit2,
    LayoutGrid,
    ShieldCheck,
    Tags,
} from 'lucide-react';
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
import {
    admin,
    adminBusinesses,
    adminCampaigns,
    adminCategories,
    adminReportsBallots,
    dashboard,
} from '@/routes';
const mainNavItems = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Campaigns',
        href: adminCampaigns(),
        icon: ShieldCheck,
    },
    {
        title: 'Categories',
        href: adminCategories(),
        icon: Tags,
    },
    {
        title: 'Businesses',
        href: adminBusinesses(),
        icon: Building2,
    },
    {
        title: 'Ballot Report',
        href: adminReportsBallots(),
        icon: BarChart3,
    },
    {
        title: 'Admin',
        href: admin(),
        icon: ShieldCheck,
    },
];
const footerNavItems = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];
export function AppSidebar() {
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
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
