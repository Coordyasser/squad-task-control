
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTeam } from '@/contexts/TeamContext';
import { 
  LayoutDashboard, 
  Kanban, 
  Users, 
  User, 
  Plus 
} from 'lucide-react';

export function AppSidebar() {
  const { currentUser, teams } = useTeam();
  const [expanded, setExpanded] = useState(true);

  return (
    <Sidebar expanded={expanded} onExpandedChange={setExpanded}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Avatar>
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback>{currentUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          {expanded && (
            <div>
              <p className="text-sm font-medium">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{currentUser.role}</p>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/">
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/tasks">
                    <Kanban className="h-5 w-5" />
                    <span>Tarefas</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/profile">
                    <User className="h-5 w-5" />
                    <span>Meu Perfil</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {currentUser.role === 'admin' && (
          <SidebarGroup>
            <SidebarGroupLabel>Administração</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/teams">
                      <Users className="h-5 w-5" />
                      <span>Equipes</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        
        <SidebarGroup>
          <SidebarGroupLabel>Equipes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {teams.map(team => (
                <SidebarMenuItem key={team.id}>
                  <SidebarMenuButton asChild>
                    <Link to={`/teams/${team.id}`}>
                      <span className="w-5 h-5 flex items-center justify-center bg-primary/10 rounded-md text-xs font-medium text-primary">
                        {team.name.substring(0, 2).toUpperCase()}
                      </span>
                      <span>{team.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {currentUser.role === 'admin' && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/teams/new" className="text-muted-foreground">
                      <Plus className="h-4 w-4" />
                      <span>Nova Equipe</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-4 py-2 text-xs text-muted-foreground">
          {expanded && <p>© 2025 Team Manager</p>}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
