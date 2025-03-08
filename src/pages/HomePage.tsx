
import { HeroSection } from "@/components/HeroSection";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full border-t-4 border-brand-primary border-opacity-50 h-12 w-12"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return <HeroSection />;
}
