
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard, 
  Kanban, 
  Users, 
  User, 
  Plus,
  LogOut,
  FolderPlus
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function AppSidebar() {
  const { currentUser, teams = [] } = useTeam();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Use either the currentUser from TeamContext or user from AuthContext
  const displayUser = currentUser || user || {
    name: 'Usuário',
    role: 'member',
    avatar: ''
  };
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado"
    });
    navigate('/');
  };

  // Check if the current location is a team-related page
  const isTeamsPage = location.pathname.includes('/teams');
  const isNewTeamPage = location.pathname === '/teams/new';

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Avatar>
            <AvatarImage src={displayUser?.avatar} alt={displayUser?.name} />
            <AvatarFallback>{displayUser?.name?.substring(0, 2)?.toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{displayUser?.name || 'Usuário'}</p>
            <p className="text-xs text-muted-foreground capitalize">{displayUser?.role || 'member'}</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/dashboard">
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
        
        <SidebarGroup>
          <SidebarGroupLabel>Equipes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  isActive={isTeamsPage && !isNewTeamPage}
                >
                  <Link to="/teams">
                    <Users className="h-5 w-5" />
                    <span>Minhas Equipes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {displayUser?.role === 'admin' && (
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild
                    isActive={isNewTeamPage}
                  >
                    <Link to="/teams/new">
                      <FolderPlus className="h-5 w-5" />
                      <span>Nova Equipe</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              
              {teams.map(team => (
                <SidebarMenuItem key={team.id}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === `/teams/${team.id}`}
                  >
                    <Link to={`/teams/${team.id}`}>
                      <span className="w-5 h-5 flex items-center justify-center bg-primary/10 rounded-md text-xs font-medium text-primary">
                        {team.name.substring(0, 2).toUpperCase()}
                      </span>
                      <span>{team.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {displayUser?.role === 'admin' && (
          <SidebarGroup>
            <SidebarGroupLabel>Administração</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/teams">
                      <Users className="h-5 w-5" />
                      <span>Gerenciar Equipes</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <div className="px-4 py-2">
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="text-red-500 hover:text-red-700 w-full justify-start">
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <div className="mt-4 text-xs text-muted-foreground">
            <p>© 2025 DPGE - Team Manager</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
