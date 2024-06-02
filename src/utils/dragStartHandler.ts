import React from 'react';

export function dragStartHandler(
  event: React.DragEvent<HTMLDivElement>,
  cardId: number,
  setDraggingCardId: (id: number) => void
): void {
  event.dataTransfer.setData('text/plain', cardId.toString());
  setDraggingCardId(cardId);
}
