
import { LoginDrawer } from "@/components/LoginDrawer";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { Button } from "@/components/ui/button";
import { BarChart3, Activity, LineChart, FunctionSquare, Bell, Rocket } from "lucide-react";
import React, { useState } from "react";
import { ObserveFeatureChart } from "@/components/ObserveFeatureChart";
import { Link } from "react-router-dom";

export function ObserveHeroSection() {
  const [showDemo, setShowDemo] = useState(false);
  
  return (
    <BackgroundPaths title="mAI Observe">
      <div className="w-full max-w-5xl mx-auto text-center px-4 md:px-6">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-primary mb-3 md:mb-4">
          Track Everything Built on the mAI Agentic Framework
        </h1>
        
        <p className="text-lg md:text-xl text-gray-700 mb-8 md:mb-12 max-w-3xl mx-auto">
          Monitor, analyze, and optimize your AI applications with real-time insights.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          <div className="bg-white/90 p-4 md:p-6 rounded-xl shadow-md border border-gray-100 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="bg-brand-light p-3 rounded-full">
                <BarChart3 className="h-6 w-6 md:h-8 md:w-8 text-brand-primary" />
              </div>
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2 text-brand-primary">Conversation Analytics</h3>
            <p className="text-sm md:text-base text-gray-600">
              See how users interact with your AI through detailed trends.
            </p>
          </div>
          
          <div className="bg-white/90 p-4 md:p-6 rounded-xl shadow-md border border-gray-100 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="bg-brand-light p-3 rounded-full">
                <Activity className="h-6 w-6 md:h-8 md:w-8 text-brand-primary" />
              </div>
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2 text-brand-primary">Performance Metrics</h3>
            <p className="text-sm md:text-base text-gray-600">
              Keep tabs on latency and system health to boost efficiency.
            </p>
          </div>
          
          <div className="bg-white/90 p-4 md:p-6 rounded-xl shadow-md border border-gray-100 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="bg-brand-light p-3 rounded-full">
                <LineChart className="h-6 w-6 md:h-8 md:w-8 text-brand-primary" />
              </div>
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2 text-brand-primary">Summarization Insights</h3>
            <p className="text-sm md:text-base text-gray-600">
              Understand how summaries streamline conversations.
            </p>
          </div>
          
          <div className="bg-white/90 p-4 md:p-6 rounded-xl shadow-md border border-gray-100 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="bg-brand-light p-3 rounded-full">
                <FunctionSquare className="h-6 w-6 md:h-8 md:w-8 text-brand-primary" />
              </div>
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2 text-brand-primary">Function Execution</h3>
            <p className="text-sm md:text-base text-gray-600">
              Track function usage to spot patterns or issues.
            </p>
          </div>
          
          <div className="bg-white/90 p-4 md:p-6 rounded-xl shadow-md border border-gray-100 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="bg-brand-light p-3 rounded-full">
                <Bell className="h-6 w-6 md:h-8 md:w-8 text-brand-primary" />
              </div>
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2 text-brand-primary">Real-Time Alerts</h3>
            <p className="text-sm md:text-base text-gray-600">
              Get instant notifications for anything critical.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-brand-light to-white p-4 md:p-6 rounded-xl shadow-md border border-brand-light backdrop-blur-sm hover:shadow-lg transition-shadow">
            <div className="flex flex-col justify-center items-center h-full">
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-brand-primary">And Much More</h3>
              <p className="text-sm md:text-base text-gray-600 mb-3">
                Explore all the features designed to enhance your AI operations.
              </p>
              <Button 
                variant="outline" 
                className="mt-auto border-brand-primary/30 hover:bg-brand-light/50 text-brand-primary"
                onClick={() => setShowDemo(!showDemo)}
              >
                {showDemo ? "Hide Demo" : "See Demo"}
              </Button>
            </div>
          </div>
        </div>
        
        {showDemo && (
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <ObserveFeatureChart />
            <p className="text-xs text-gray-500 mt-3 max-w-3xl mx-auto">
              Demo visualization shows sample data. Your actual metrics will reflect your specific AI application usage patterns.
            </p>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-5 justify-center items-center mb-8">
          <div className="inline-block group relative bg-gradient-to-b from-brand-primary/10 to-brand-light/50 
                p-px rounded-2xl backdrop-blur-lg 
                overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <LoginDrawer product="observe">
              <Button variant="ghost" className="rounded-[1.15rem] px-4 py-4 md:px-8 md:py-6 text-base md:text-lg font-semibold backdrop-blur-md 
                  bg-white/95 hover:bg-white/100 dark:bg-black/95 dark:hover:bg-black/100 
                  text-brand-primary dark:text-white transition-all duration-300 
                  group-hover:-translate-y-0.5 border border-brand-primary/10 dark:border-white/10
                  hover:shadow-md dark:hover:shadow-neutral-800/50">
                <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                  Begin Experiencing
                </span>
                <span className="ml-2 md:ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 
                      transition-all duration-300">
                  →
                </span>
              </Button>
            </LoginDrawer>
          </div>
          
          <Link to="/" className="group flex items-center gap-2 text-brand-primary hover:text-brand-dark transition-colors">
            <Rocket className="h-5 w-5" />
            <span className="text-sm md:text-base font-medium group-hover:underline">
              Try mAI AgenticFramework - Build advanced AI agents
            </span>
            <span className="opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">→</span>
          </Link>
        </div>
      </div>
    </BackgroundPaths>
  );
}
