'use client';

import { ChevronRight, type LucideIcon } from 'lucide-react';
import { useSidebar } from '@workspace/ui/components/ui/sidebar';
import { Popover, PopoverTrigger, PopoverContent } from '@workspace/ui/components/ui/popover';

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@workspace/ui/components/ui/collapsible';
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from '@workspace/ui/components/ui/sidebar';

import React from 'react';

const NAVMAIN_OPEN_KEY = 'navmain_open_menus';

export function NavMain({
	items,
	currentPath,
}: {
	items: {
		title: string;
		url?: string;
		icon?: LucideIcon;
		isActive?: boolean;
		items: {
			title: string;
			url: string;
		}[];
	}[];
	currentPath?: string;
}) {
	const { state } = useSidebar();
	const isCollapsed = state === 'collapsed';

	// Load open state from localStorage
	const getInitialOpenMenus = () => {
		if (typeof window !== 'undefined') {
			const stored = localStorage.getItem(NAVMAIN_OPEN_KEY);
			if (stored) return JSON.parse(stored);
		}
		// Default: open menus with isActive true
		return items.reduce(
			(acc, item) => {
				if (item.items.length > 0 && item.isActive) acc[item.title] = true;
				return acc;
			},
			{} as Record<string, boolean>
		);
	};
	const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>(getInitialOpenMenus);

	React.useEffect(() => {
		localStorage.setItem(NAVMAIN_OPEN_KEY, JSON.stringify(openMenus));
	}, [openMenus]);

	const handleMenuOpenChange = (title: string, open: boolean) => {
		setOpenMenus((prev) => ({ ...prev, [title]: open }));
	};

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Platform</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) =>
					item.items.length === 0 ? (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								asChild
								tooltip={item.title}
								isActive={!!(item.url && currentPath === item.url)}
								className={item.url && currentPath === item.url ? 'font-bold' : ''}
							>
								<a href={item.url} className="flex items-center gap-2">
									{item.icon && <item.icon />}
									<span>{item.title}</span>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					) : (
						<Collapsible
							key={item.title}
							asChild
							open={!!openMenus[item.title]}
							onOpenChange={(open) => handleMenuOpenChange(item.title, open)}
							className="group/collapsible"
						>
							<SidebarMenuItem>
								{isCollapsed ? (
									<Popover>
										<PopoverTrigger asChild>
											<SidebarMenuButton tooltip={item.title}>
												{item.icon && <item.icon />}
											</SidebarMenuButton>
										</PopoverTrigger>
										<PopoverContent side="right" align="start" className="w-48 p-0">
											<div className="flex flex-col">
												{item.items?.map((subItem) => (
													<a
														key={subItem.title}
														href={subItem.url}
														className={`hover:bg-muted px-4 py-2 text-sm ${subItem.url && currentPath === subItem.url ? 'font-bold' : ''}`}
													>
														{subItem.title}
													</a>
												))}
											</div>
										</PopoverContent>
									</Popover>
								) : (
									<CollapsibleTrigger asChild>
										<SidebarMenuButton tooltip={item.title}>
											{item.icon && <item.icon />}
											<span>{item.title}</span>
											<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
										</SidebarMenuButton>
									</CollapsibleTrigger>
								)}
								{!isCollapsed && (
									<CollapsibleContent>
										<SidebarMenuSub>
											{item.items?.map((subItem) => (
												<SidebarMenuSubItem key={subItem.title}>
													<SidebarMenuSubButton
														asChild
														isActive={!!(subItem.url && currentPath === subItem.url)}
														className={
															subItem.url && currentPath === subItem.url ? 'font-bold' : ''
														}
													>
														<a href={subItem.url}>
															<span>{subItem.title}</span>
														</a>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									</CollapsibleContent>
								)}
							</SidebarMenuItem>
						</Collapsible>
					)
				)}
			</SidebarMenu>
		</SidebarGroup>
	);
}
