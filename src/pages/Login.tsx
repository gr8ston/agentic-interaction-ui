
import { LoginForm } from "@/components/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function Login() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full border-t-4 border-brand-primary border-opacity-50 h-12 w-12"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-brand-background">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-brand-primary mb-2">MOURITech</h1>
        <p className="text-xl text-gray-600">Agentic Framework Demo</p>
      </div>
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
