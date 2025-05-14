
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { seedDatabase } from '@/utils/seedData';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    try {
      const success = await seedDatabase();
      if (success) {
        toast({
          title: "Banco de dados populado com sucesso",
          description: "Dados de exemplo foram criados no banco de dados.",
        });
      } else {
        toast({
          title: "Erro ao popular banco de dados",
          description: "Ocorreu um erro ao criar os dados de exemplo.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro ao popular banco de dados",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleRegister = () => {
    setIsRegistering(true);
    navigate('/register');
  };

  const handleLogin = () => {
    setIsLoggingIn(true);
    navigate('/login');
  };

  const handleEnterDemo = async () => {
    try {
      // Try to sign in with demo admin account
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@example.com',
        password: 'admin123'
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast({
          title: "Login demo realizado",
          description: "Você entrou como administrador no modo demonstração.",
        });
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Error logging in as demo user:', error);
      
      // If demo login fails, try to create demo data and then retry
      toast({
        title: "Criando dados de demonstração",
        description: "Aguarde enquanto configuramos o ambiente de demo.",
      });
      
      try {
        await seedDatabase();
        
        // Try login again after creating demo data
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'admin@example.com',
          password: 'admin123'
        });
        
        if (error) throw error;
        
        if (data.user) {
          toast({
            title: "Login demo realizado",
            description: "Você entrou como administrador no modo demonstração.",
          });
          navigate('/dashboard');
        }
      } catch (secondError: any) {
        toast({
          title: "Erro ao entrar no modo demo",
          description: secondError.message || "Não foi possível configurar o ambiente de demonstração.",
          variant: "destructive"
        });
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-white">Gerenciador de Equipes</h1>
          <p className="text-xl text-gray-300">Gerencie suas equipes, tarefas e projetos em um só lugar</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gray-800 border-gray-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Área de Usuário</CardTitle>
              <CardDescription className="text-gray-400">Acesse sua conta ou crie uma nova</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">Faça login para acessar suas equipes e tarefas ou crie uma nova conta para começar a usar o sistema.</p>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                onClick={handleLogin}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Redirecionando..." : "Fazer Login"}
              </Button>
              <Button 
                className="w-full" 
                variant="outline" 
                onClick={handleRegister}
                disabled={isRegistering}
              >
                {isRegistering ? "Redirecionando..." : "Criar Conta"}
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Demonstração</CardTitle>
              <CardDescription className="text-gray-400">Experimente o sistema com dados de exemplo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">Explore o sistema com dados pré-configurados ou popule o banco de dados com dados de exemplo.</p>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700" 
                onClick={handleEnterDemo}
              >
                Entrar no Modo Demo
              </Button>
              <Button 
                className="w-full" 
                variant="outline" 
                onClick={handleSeedDatabase}
                disabled={isSeeding}
              >
                {isSeeding ? "Processando..." : "Popular Banco de Dados"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Gerenciador de Equipes. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
