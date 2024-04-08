import React from 'react';
import s from './ProgresBar.module.scss';

export function ProgresBar({ progress }: { progress: number }): JSX.Element {
  return (
    <div className={s.progress_bar}>
      <div className={s.progress} style={{ width: `${progress}%` }} />
    </div>
  );
}
