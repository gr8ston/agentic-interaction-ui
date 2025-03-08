
import { LoginDrawer } from "@/components/LoginDrawer";
import { Rocket, Zap, Brain } from "lucide-react";

export function HeroSection() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-brand-light p-4">
      <div className="max-w-5xl mx-auto text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-brand-primary p-4 rounded-full">
            <Brain className="h-12 w-12 text-white" />
          </div>
        </div>
        
        <h1 className="text-5xl font-bold text-brand-primary mb-6 md:text-6xl lg:text-7xl">
          mAI AgenticFramework
        </h1>
        
        <p className="text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
          The fastest, most accurate, and efficient agentic framework ever built.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex justify-center mb-4">
              <div className="bg-brand-light p-3 rounded-full">
                <Zap className="h-8 w-8 text-brand-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-brand-primary">Lightning Fast</h3>
            <p className="text-gray-600">Delivers responses in milliseconds with unmatched processing speed.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex justify-center mb-4">
              <div className="bg-brand-light p-3 rounded-full">
                <Brain className="h-8 w-8 text-brand-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-brand-primary">Highly Accurate</h3>
            <p className="text-gray-600">Precision-engineered responses with advanced reasoning capabilities.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex justify-center mb-4">
              <div className="bg-brand-light p-3 rounded-full">
                <Rocket className="h-8 w-8 text-brand-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-brand-primary">Ultra Efficient</h3>
            <p className="text-gray-600">Optimized resource utilization for maximum performance with minimal consumption.</p>
          </div>
        </div>
        
        <LoginDrawer />
      </div>
    </div>
  );
}
