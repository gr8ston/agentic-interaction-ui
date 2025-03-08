
import { LoginDrawer } from "@/components/LoginDrawer";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { Button } from "@/components/ui/button";
import { Rocket, Zap, Brain } from "lucide-react";
import React from "react";

export function HeroSection() {
  return (
    <BackgroundPaths title="mAI AgenticFramework">
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
          The fastest, most accurate, and efficient agentic framework ever built.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/90 p-6 rounded-xl shadow-md border border-gray-100 backdrop-blur-sm">
            <div className="flex justify-center mb-4">
              <div className="bg-brand-light p-3 rounded-full">
                <Zap className="h-8 w-8 text-brand-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-brand-primary">Lightning Fast</h3>
            <p className="text-gray-600">Delivers responses in milliseconds with unmatched processing speed.</p>
          </div>
          
          <div className="bg-white/90 p-6 rounded-xl shadow-md border border-gray-100 backdrop-blur-sm">
            <div className="flex justify-center mb-4">
              <div className="bg-brand-light p-3 rounded-full">
                <Brain className="h-8 w-8 text-brand-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-brand-primary">Highly Accurate</h3>
            <p className="text-gray-600">Precision-engineered responses with advanced reasoning capabilities.</p>
          </div>
          
          <div className="bg-white/90 p-6 rounded-xl shadow-md border border-gray-100 backdrop-blur-sm">
            <div className="flex justify-center mb-4">
              <div className="bg-brand-light p-3 rounded-full">
                <Rocket className="h-8 w-8 text-brand-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-brand-primary">Ultra Efficient</h3>
            <p className="text-gray-600">Optimized resource utilization for maximum performance with minimal consumption.</p>
          </div>
        </div>
        
        <div className="inline-block group relative bg-gradient-to-b from-brand-primary/10 to-brand-light/50 
                p-px rounded-2xl backdrop-blur-lg 
                overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          <LoginDrawer>
            <Button
              variant="ghost"
              className="rounded-[1.15rem] px-8 py-6 text-lg font-semibold backdrop-blur-md 
                bg-white/95 hover:bg-white/100 dark:bg-black/95 dark:hover:bg-black/100 
                text-brand-primary dark:text-white transition-all duration-300 
                group-hover:-translate-y-0.5 border border-brand-primary/10 dark:border-white/10
                hover:shadow-md dark:hover:shadow-neutral-800/50"
            >
              <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                Begin Experience
              </span>
              <span
                className="ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 
                    transition-all duration-300"
              >
                →
              </span>
            </Button>
          </LoginDrawer>
        </div>
      </div>
    </BackgroundPaths>
  );
}
