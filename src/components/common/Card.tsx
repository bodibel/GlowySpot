import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, className = '', onClick, hover = false }: CardProps) {
  const hoverClass = hover ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : '';

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg transition-all duration-300 ${hoverClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
