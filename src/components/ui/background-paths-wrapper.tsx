
import React from 'react';
import { BackgroundPaths } from './background-paths';

interface BackgroundPathsWrapperProps {
  children: React.ReactNode;
}

export function BackgroundPathsWrapper({ children }: BackgroundPathsWrapperProps) {
  return (
    <div className="relative">
      <BackgroundPaths />
      {children}
    </div>
  );
}
