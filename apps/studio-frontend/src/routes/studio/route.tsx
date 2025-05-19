import { createFileRoute, Outlet, redirect, useRouterState } from '@tanstack/react-router';
import { SidebarProvider, SidebarTrigger } from '@workspace/ui/components/ui/sidebar';
import { AppSidebar } from './-components/app-sidebar';
import { SidebarInset } from '@workspace/ui/components/ui/sidebar';
import {
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@workspace/ui/components/ui/breadcrumb';
import { Breadcrumb } from '@workspace/ui/components/ui/breadcrumb';
import { Separator } from '@workspace/ui/components/ui/separator';
import { NotFound } from '@/components/not-found';
import React from 'react';
import { authClient } from '@/lib/auth-client';

export const Route = createFileRoute('/studio')({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		const { data, error } = await authClient.getSession();
		console.log(data, error);
		if (!data) {
			throw redirect({ to: '/login', search: { redirect: location.pathname } });
		}
	},
	notFoundComponent: () => (
		<NotFound link={{ label: 'Go to dashboard', to: '/studio/dashboard' }} />
	),
});

function RouteComponent() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });

	const segments = pathname.split('/').filter(Boolean);
	const breadcrumbs = segments.map((segment, idx) => {
		const href = '/' + segments.slice(0, idx + 1).join('/');
		const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
		return { href, label };
	});

	return (
		<SidebarProvider>
			<AppSidebar currentPath={pathname} />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator orientation="vertical" className="mr-2 h-4" />
						<Breadcrumb>
							<BreadcrumbList>
								{breadcrumbs.slice(1).map((crumb, idx) => (
									<React.Fragment key={crumb.href}>
										{idx > 0 && <BreadcrumbSeparator />}
										<BreadcrumbItem>
											{idx === breadcrumbs.length - 2 ? (
												<BreadcrumbPage>{crumb.label}</BreadcrumbPage>
											) : (
												<BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
											)}
										</BreadcrumbItem>
									</React.Fragment>
								))}
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>

				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	);
}
