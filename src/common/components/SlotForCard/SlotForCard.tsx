import React from 'react';
import s from './SlotForCard.module.scss';

interface SlotProps {
  cardId: number;
  onDragOver: (cardId: number, event: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (cardId: number, event: React.DragEvent<HTMLDivElement>) => void;
}

function Slot({ cardId, onDragOver, onDragLeave }: SlotProps): JSX.Element {
  return (
    <div
      className={s.slot}
      onDragOver={(event): void => onDragOver(cardId, event)}
      onDragLeave={(event): void => onDragLeave(cardId, event)}
    />
  );
}

export default Slot;
