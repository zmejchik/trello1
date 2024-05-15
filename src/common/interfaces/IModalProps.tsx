import { ReactNode } from 'react';

export interface ModalProps {
  visible: boolean;
  title: string;
  inputValue: string;
  placeholder: string;
  footer: ReactNode | string;
  onClose: () => void;
  setValue: (event: string) => void;
}
