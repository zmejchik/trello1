import React from 'react';
import s from './Modal.module.scss';
import { ModalProps } from '../interfaces/IModalProps';

export function Modal({
  visible = false,
  title = '',
  inputValue,
  setValue,
  footer = '',
  onClose,
}: ModalProps): JSX.Element | null {
  if (!visible) return null;

  return (
    <div className={s.modal} onClick={onClose}>
      <div className={s.modal_dialog} onClick={(e): void => e.stopPropagation()}>
        <div className={s.modal_header}>
          <h3 className={s.modal_title}>{title}</h3>
          <span className={s.modal_close} onClick={onClose}>
            &times;
          </span>
        </div>
        <div className={s.modal_body}>
          <div className={s.modal_content}>
            <input value={inputValue} onChange={(event): void => setValue(event.target.value)} />
          </div>
        </div>
        {footer && <div className={s.modal_footer}>{footer}</div>}
      </div>
    </div>
  );
}
