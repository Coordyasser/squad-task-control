
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold gradient-heading">404</h1>
          <h2 className="text-2xl font-medium">Página não encontrada</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Desculpe, a página que você está procurando não existe ou foi movida.
          </p>
        </div>
        <Button onClick={() => navigate("/")}>Voltar para a Dashboard</Button>
      </div>
    </div>
  );
};

export default NotFound;
