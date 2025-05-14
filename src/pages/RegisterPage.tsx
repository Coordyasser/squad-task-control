
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar as senhas
    if (password !== confirmPassword) {
      toast({
        title: "Erro no cadastro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulação de cadastro - em aplicação real, usaria um serviço de autenticação
    setTimeout(() => {
      // Armazena informações do usuário no localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({
        id: 'user' + Date.now(), // ID único baseado no timestamp
        name,
        email,
        role: 'user'
      }));
      
      toast({
        title: "Conta criada com sucesso",
        description: "Bem-vindo ao DPGE - Team Manager!",
      });
      
      // Redirecionar para o dashboard
      navigate('/dashboard');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Registration Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 order-2 md:order-1">
        <div className="w-full max-w-md space-y-8">
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="mb-6"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>

            <h2 className="text-3xl font-bold">Criar Conta</h2>
            <p className="mt-2 text-gray-600">
              Preencha seus dados para começar a usar o Team Manager
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input 
                id="name" 
                type="text" 
                placeholder="João Silva" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="seu@email.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder="••••••••" 
                required 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-team-blue to-team-green hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? "Criando conta..." : "Criar Conta"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Já tem conta?{' '}
              <Link to="/login" className="text-team-blue hover:underline font-medium">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Gradient Background */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-team-green via-cyan-400 to-team-blue flex items-center justify-center p-12 order-1 md:order-2">
        <div className="max-w-md text-white">
          <h1 className="text-4xl font-bold mb-6">Junte-se a nós!</h1>
          <p className="text-xl opacity-90">
            Crie sua conta e comece a usar o melhor sistema de gerenciamento de equipes e tarefas.
          </p>
          <div className="mt-8">
            <ul className="space-y-4">
              <li className="flex items-center">
                <div className="bg-white/30 rounded-full p-1 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                </div>
                Quadros Kanban personalizados
              </li>
              <li className="flex items-center">
                <div className="bg-white/30 rounded-full p-1 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                </div>
                Relatórios detalhados
              </li>
              <li className="flex items-center">
                <div className="bg-white/30 rounded-full p-1 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                </div>
                Colaboração em tempo real
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
