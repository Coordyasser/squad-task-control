
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from './AppSidebar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AppLayout() {
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="pb-6 flex justify-between items-center">
            <SidebarTrigger />
            <Button onClick={() => navigate('/tasks/new')} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Nova Tarefa
            </Button>
          </div>
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
