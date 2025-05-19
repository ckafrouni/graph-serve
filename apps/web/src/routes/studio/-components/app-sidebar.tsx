import * as React from 'react';
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Home,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from 'lucide-react';

import { NavMain } from './nav-main';
import { NavPinnedTenders } from './nav-pinned-tenders';
import { NavUser } from './nav-user';
import { TeamSwitcher } from './team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@workspace/ui/components/ui/sidebar';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@workspace/ui/components/ui/button';

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Dashboard',
      url: '/studio/dashboard',
      icon: Home,
      items: [],
    },
    {
      title: 'Playground',
      url: '/studio/playground',
      icon: SquareTerminal,
      items: [],
    },
    {
      title: 'Knowledge Base',
      icon: Bot,
      isActive: false,
      items: [
        {
          title: 'Stats',
          url: '/studio/knowledge-base/stats',
        },
        {
          title: 'Manage',
          url: '/studio/knowledge-base/manage',
        },
        {
          title: 'Settings',
          url: '/studio/knowledge-base/settings',
        },
      ],
    },
    {
      title: 'Tenders',
      icon: BookOpen,
      isActive: false,
      items: [
        {
          title: 'Active',
          url: '/studio/tenders/active',
        },
        {
          title: 'Archived',
          url: '/studio/tenders/archived',
        },
      ],
    },
    {
      title: 'Settings',
      icon: Settings2,
      isActive: false,
      items: [
        {
          title: 'General',
          url: '/studio/settings/general',
        },
        {
          title: 'Team',
          url: '/studio/settings/team',
        },
        {
          title: 'Billing',
          url: '/studio/settings/billing',
        },
        {
          title: 'Limits',
          url: '/studio/settings/limits',
        },
      ],
    },
  ],
  pinnedTenders: [
    {
      name: 'Gustav Heinemann Secondary School',
      url: '/studio/tenders/1',
      icon: Frame,
    },
    {
      name: 'Gustav Heinemann Secondary School',
      url: '/studio/tenders/2',
      icon: PieChart,
    },
    {
      name: 'Gustav Heinemann Secondary School',
      url: '/studio/tenders/3',
      icon: Map,
    },
  ],
};

export function AppSidebar({
  currentPath,
  ...props
}: React.ComponentProps<typeof Sidebar> & { currentPath?: string }) {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser fallbackUser={data.user} />
        {/* <TeamSwitcher teams={data.teams} /> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} currentPath={currentPath} />
        <NavPinnedTenders pinnedTenders={data.pinnedTenders} />
      </SidebarContent>
      <SidebarFooter>
        {!isCollapsed ? (
          <div className="flex justify-between gap-2">
            <ModeToggle />
            <Button variant="ghost" size="icon" asChild>
              <a href="/studio/settings/general">
                <Settings2 />
              </a>
            </Button>
          </div>
        ) : (
          <>
            <ModeToggle />
            <Button variant="ghost" size="icon" asChild>
              <a href="/studio/settings">
                <Settings2 />
              </a>
            </Button>
          </>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
