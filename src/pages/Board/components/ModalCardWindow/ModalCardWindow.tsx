import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { visibleModalForCard } from '../../../../redux/dataSlice';
import s from './ModalCardWindow.module.scss';
import { RootState } from '../../../../redux/store';

function ModalCardWindow(): JSX.Element {
  const dispatch = useDispatch();

  const data = useSelector((state: RootState) =>
    state.data.cards.find((card) => card.id.toString() === state.data.cardId)
  );
  const listName = useSelector((state: RootState) => state.data.list_name);
  return (
    <div className={s.overlay}>
      <div className={s.wrapper}>
        <div className={s.infopart}>
          <h2>Назва картки {data?.title}</h2>
          <p>
            В списку <u>{listName}</u>
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
            <textarea maxLength={5000} defaultValue={data?.description} />
          </div>
        </div>
        <div className={s.operations}>
          <div
            onClick={(): void => {
              dispatch(visibleModalForCard());
            }}
          >
            X
          </div>
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
