
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { User } from "@/types/api";

type LoginDrawerProps = {
  children: React.ReactNode;
  product?: "framework" | "observe";
}

export function LoginDrawer({ children, product = "framework" }: LoginDrawerProps) {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const productTitles = {
    framework: "mAI AgenticFramework",
    observe: "mAI Observe"
  };

  const productTitle = productTitles[product];

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const credentials: User = {
        username,
        password,
      };
      await login(credentials);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent className="bg-white">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="text-2xl text-brand-primary">Login to {productTitle}</DrawerTitle>
            <DrawerDescription>
              Please enter your credentials to access the platform.
            </DrawerDescription>
          </DrawerHeader>
          <form className="grid gap-4 p-4" onSubmit={handleLogin}>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                required
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="demo"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                required
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <div className="text-center text-sm text-muted-foreground mt-1">
                <p>Demo credentials: username: "demo", password: "password"</p>
              </div>
            </div>
            <DrawerFooter className="px-0">
              <Button 
                type="submit" 
                className="w-full bg-brand-primary hover:bg-brand-dark"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
              <DrawerClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
