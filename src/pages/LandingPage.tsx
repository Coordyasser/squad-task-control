import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, UserPlus, LogIn } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with Gradient Background */}
      <div className="flex-1 flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 bg-gradient-to-br from-team-blue via-blue-400 to-team-green p-8 flex flex-col justify-center items-center md:items-start text-white">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-lg space-y-6 animate-fade-in"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              DPGE - Team Manager
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              Gerencie suas equipes e tarefas com eficiência e simplicidade
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button 
                asChild
                size="lg" 
                className="bg-white text-team-blue hover:bg-blue-50 transition-colors"
              >
                <Link to="/login">
                  <LogIn className="mr-2 h-5 w-5" />
                  Entrar
                </Link>
              </Button>
              <Button 
                asChild
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
              >
                <Link to="/register">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Criar Conta
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <div className="w-full md:w-1/2 bg-white p-8 flex items-center">
          <div className="max-w-lg mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">Por que usar o DPGE - Team Manager?</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-r from-team-blue to-team-green rounded-lg p-3 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-700">Gerencie Tarefas</h3>
                  <p className="text-gray-600">Organize suas tarefas de forma visual e eficiente com nossa interface intuitiva.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-r from-team-blue to-team-green rounded-lg p-3 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 1 0 7.75" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-700">Colabore com Equipes</h3>
                  <p className="text-gray-600">Trabalhe em conjunto com sua equipe em tempo real e aumente a produtividade.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-r from-team-blue to-team-green rounded-lg p-3 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-700">Automação</h3>
                  <p className="text-gray-600">Automatize processos repetitivos e foque no que realmente importa.</p>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                asChild
                variant="default" 
                className="bg-gradient-to-r from-team-blue to-team-green hover:opacity-90 transition-opacity w-full"
              >
                <Link to="/register">
                  Começar Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 mb-4 md:mb-0">© 2025 DPGE - Team Manager. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-600 hover:text-team-blue">Termos de Uso</a>
            <a href="#" className="text-gray-600 hover:text-team-blue">Privacidade</a>
            <a href="#" className="text-gray-600 hover:text-team-blue">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
