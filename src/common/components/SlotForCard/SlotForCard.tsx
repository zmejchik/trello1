import React from 'react';
import s from './SlotForCard.module.scss';

function Slot({ onDragOver }: { onDragOver: () => void }): JSX.Element {
  return <div className={s.slot} onDragOver={onDragOver} />;
}

export default Slot;
