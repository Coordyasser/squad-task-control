
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useTeam } from '@/contexts/TeamContext';

const ProtectedRoute = () => {
  const { currentUser } = useTeam();

  // Se não estiver autenticado, redireciona para a página de login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver autenticado, renderiza as rotas filho
  return <Outlet />;
};

export default ProtectedRoute;
