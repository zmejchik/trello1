import React from 'react';
import s from './ModalCardWindow.module.scss';

function ModalCardWindow(): JSX.Element {
  return (
    <div className={s.overlay}>
      <div className={s.wrapper}>
        <div className={s.infopart}>
          <h2>Назва картки title</h2>
          <p>
            В списку <u>title списку</u>
          </p>
          <h3>УЧАСНИКИ</h3>
          <div className={s.users}>
            <div className={s.user}>1</div>
            <div className={s.user}>2</div>
            <div className={s.user}>3</div>
            <div className={s.user}>+</div>
            <button type="button">Приєднатись</button>
          </div>
          <div>
            <h2>Опис</h2>
            <textarea maxLength={5000} defaultValue="Тут головне тіло картки" />
          </div>
        </div>
        <div className={s.operations}>
          <div>X</div>
          <h2>Дії над карткою</h2>
          <button type="button">Копіювати</button>
          <button type="button">Перемістити</button>
          <button type="button">Архівувати</button>
        </div>
      </div>
    </div>
  );
}

export default ModalCardWindow;
