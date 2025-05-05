import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export default function Container({ 
  children, 
  className = "",
  noPadding = false
}: ContainerProps) {
  return (
    <div 
      className={`container mx-auto ${!noPadding ? 'px-6' : ''} ${className}`}
    >
      {children}
    </div>
  );
} 