import { ReactNode } from 'react';

export interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  to?: string;
  caption?: string;
}
