import { LoginDrawer } from "@/components/LoginDrawer";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { Button } from "@/components/ui/button";
import { Rocket, Zap, Brain, BarChart } from "lucide-react";
import React, { useState } from "react";
import { ComparisonChart } from "@/components/ComparisonChart";
export function HeroSection() {
  const [showComparison, setShowComparison] = useState(false);
  return <BackgroundPaths title="mAI AgenticFramework">
      <div className="w-full max-w-5xl mx-auto text-center px-4 md:px-6">
        <p className="text-lg md:text-2xl text-gray-700 mb-6 md:mb-8 max-w-3xl mx-auto">
          The fastest, most accurate, and efficient agentic framework ever built.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
          <div className="bg-white/90 p-4 md:p-6 rounded-xl shadow-md border border-gray-100 backdrop-blur-sm">
            <div className="flex justify-center mb-4">
              <div className="bg-brand-light p-3 rounded-full">
                <Zap className="h-6 w-6 md:h-8 md:w-8 text-brand-primary" />
              </div>
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2 text-brand-primary">Lightning Fast</h3>
            <p className="text-sm md:text-base text-gray-600 mb-3">Delivers responses in milliseconds with unmatched processing speed.</p>
            <div className="bg-brand-light/50 py-2 px-3 rounded-lg">
              <p className="text-xs md:text-sm font-medium text-brand-primary">Avg Response Time: 400ms</p>
            </div>
          </div>
          
          <div className="bg-white/90 p-4 md:p-6 rounded-xl shadow-md border border-gray-100 backdrop-blur-sm">
            <div className="flex justify-center mb-4">
              <div className="bg-brand-light p-3 rounded-full">
                <Brain className="h-6 w-6 md:h-8 md:w-8 text-brand-primary" />
              </div>
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2 text-brand-primary">Highly Accurate</h3>
            <p className="text-sm md:text-base text-gray-600 mb-3">Precision-engineered responses with advanced reasoning capabilities.</p>
            <div className="bg-brand-light/50 py-2 px-3 rounded-lg">
              <p className="text-xs md:text-sm font-medium text-brand-primary">Accuracy Rate: 92%</p>
            </div>
          </div>
          
          <div className="bg-white/90 p-4 md:p-6 rounded-xl shadow-md border border-gray-100 backdrop-blur-sm">
            <div className="flex justify-center mb-4">
              <div className="bg-brand-light p-3 rounded-full">
                <Rocket className="h-6 w-6 md:h-8 md:w-8 text-brand-primary" />
              </div>
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2 text-brand-primary">Ultra Efficient</h3>
            <p className="text-sm md:text-base text-gray-600 mb-3">Optimized resource utilization for maximum performance with minimal consumption.</p>
            <div className="bg-brand-light/50 py-2 px-3 rounded-lg">
              <p className="text-xs md:text-sm font-medium text-brand-primary"> 50% fewer tokens</p>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <Button variant="outline" className="border-brand-primary/30 hover:bg-brand-light/50 text-brand-primary" onClick={() => setShowComparison(!showComparison)}>
            <BarChart className="h-4 w-4 mr-2" />
            {showComparison ? "Hide Comparison" : "See How We Compare"}
          </Button>
          
          {showComparison && <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <ComparisonChart />
              <p className="text-xs text-gray-500 mt-3 max-w-3xl mx-auto">
                Metrics are based on tests conducted on the same use case implemented across different frameworks, 
                with averages taken to derive the results. Due to the non-deterministic nature of AI, 
                metrics may vary slightly with each test, but overall trends consistently show mAI as the leader in each category.
              </p>
            </div>}
        </div>
        
        <div className="inline-block group relative bg-gradient-to-b from-brand-primary/10 to-brand-light/50 
                p-px rounded-2xl backdrop-blur-lg 
                overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          <LoginDrawer>
            <Button variant="ghost" className="rounded-[1.15rem] px-4 py-4 md:px-8 md:py-6 text-base md:text-lg font-semibold backdrop-blur-md 
                bg-white/95 hover:bg-white/100 dark:bg-black/95 dark:hover:bg-black/100 
                text-brand-primary dark:text-white transition-all duration-300 
                group-hover:-translate-y-0.5 border border-brand-primary/10 dark:border-white/10
                hover:shadow-md dark:hover:shadow-neutral-800/50">
              <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                Begin Experience
              </span>
              <span className="ml-2 md:ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 
                    transition-all duration-300">
                →
              </span>
            </Button>
          </LoginDrawer>
        </div>
      </div>
    </BackgroundPaths>;
}