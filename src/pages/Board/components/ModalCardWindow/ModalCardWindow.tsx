import { Box, Input, Modal, Typography } from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../../../api/request';
import { isValidBoardName as isValidCardName } from '../../../../common/components/CreateBoardLogic/CreateBoard';
import { ICard } from '../../../../common/interfaces/ICard';
import { IList } from '../../../../common/interfaces/IList';
import {
  fetchDataFailure,
  fetchDataStart,
  fetchDataSuccess,
  setBoardId,
  setCardId,
  setCardTitle,
  setDescription,
  setListId,
  setListTitle,
  visibleModalForCard,
} from '../../../../redux/dataSlice';
import { RootState } from '../../../../redux/store';
import { deleteCard } from '../../../../utils/deleteCard';
import { findListIdByCardId } from '../../../../utils/findListIdByCardId';
import s from './ModalCardWindow.module.scss';
import CardModal from './components/ActionModal/CardModal';

interface Board {
  title: string;
  custom: {
    background: string;
  };
  users: {
    id: number;
    username: string;
  }[];
  lists: IList[];
}

function ModalCardWindow(): JSX.Element {
  const { boardId, cardId } = useParams<{ boardId: string; cardId: string }>(); // Extract the board ID and card ID from the URL parameters
  const [isVisibleModalWindow, setVisibleModalWindow] = useState(false); // State to control the visibility of the card action modal
  const [dataBoard, setDataBoard] = useState<Board | null>(null); // State to store the board data
  const [typeCardModal, setTypeCardModal] = useState('copy'); // State to control the type of card action modal (copy, move, delete)
  const [isEditCardTitle, setIsEditCardTitle] = useState(false); // State to control whether the card title is in edit mode
  const [localCardTitle, setLocalCardTitle] = useState<string>(''); // State to store the local card title for editing
  const [successMessage, setSuccessMessage] = useState<boolean>(false); // State to control the visibility of the success message modal
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClose = (): void => setSuccessMessage(false); // Function to close the success message modal

  useEffect(() => {
    if (boardId && cardId) {
      dispatch(setCardId(cardId)); // Set the card ID in the Redux store
      dispatch(fetchDataStart()); // Dispatch action to indicate the start of data fetching
      api
        .get(`/board/${boardId}`)
        .then((response) => {
          const data: Board = response.data || response;
          setDataBoard(data); // Store the board data in the state
          // find the listId by the cardId
          const listId = findListIdByCardId(data, +cardId);
          dispatch(setListId(listId ? listId.toString() : '')); // Set the list ID in the Redux store
          const list: IList | undefined = data.lists.find((listItem) => listItem.id === listId);
          if (list) {
            // find cards array
            const { cards } = list;
            dispatch(fetchDataSuccess(cards as unknown as ICard[]));
            const listTitle = list.title;
            dispatch(setListTitle(listTitle));
          }
          dispatch(fetchDataSuccess(response.data));
          dispatch(setBoardId(boardId));
        })
        .catch((error) => {
          dispatch(fetchDataFailure(error.message));
        });
    }
  }, [boardId, cardId, dispatch]);

  // Select the card data from the Redux store based on the card ID
  const data = useSelector((state: RootState) =>
    state.data.cards.find((card) => card.id.toString() === state.data.cardId)
  );

  const listName = useSelector((state: RootState) => state.data.list_name);
  const listId: string = useSelector((state: RootState) => state.data.listId);

  // Effect to initialize the local card title when the data is fetched
  useEffect(() => {
    if (data) {
      setLocalCardTitle(data.title); // Initialize localCardTitle with the card title from the store
    }
  }, [data]);

  // Function to handle opening of different types of card modals (copy, move, delete)
  function handleCardModalWindow(type: string): void {
    setTypeCardModal(type);
    if (type === 'delete' && cardId !== undefined && boardId !== undefined) {
      deleteCard(+cardId, boardId).then(() => {
        setVisibleModalWindow(false);
        dispatch(visibleModalForCard());
        navigate(`/board/${boardId}`);
      });
    } else {
      setVisibleModalWindow(true); // Open the card action modal
    }
  }

  // Function to handle changes in the card description
  function handleDescription(event: ChangeEvent<HTMLTextAreaElement>): void {
    if (cardId !== undefined) {
      dispatch(setDescription({ cardId: +cardId, description: event.target.value })); // Update the card description in the Redux store
    }
  }

  // Function to handle changes in the card title input field
  const handleTitleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLocalCardTitle(event.target.value); // Update the localCardTitle state
  };

  // Function to handle saving the new card title
  const handleTitleChange = (): void => {
    if (cardId !== undefined && isValidCardName(localCardTitle)) {
      dispatch(setCardTitle({ title: localCardTitle }));
      setIsEditCardTitle(false);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Ой...',
        text: 'Некоректне ім`я картки',
      });
    }
  };

  // Function to enable edit mode for the card title
  const handleTitleClick = (): void => {
    setIsEditCardTitle(true);
  };

  // Function to send the updated card data to the server
  const sendNewDataCardOnServer = async (): Promise<void> => {
    if (data !== undefined && listId !== undefined && cardId !== undefined) {
      try {
        await api.put(`/board/${boardId}/card/${cardId}`, {
          description: data.description,
          title: data.title,
          list_id: +listId,
        });
        dispatch(setDescription({ cardId: +cardId, description: data.description }));
        setSuccessMessage(true); // Show the success message modal
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Ой...',
          text: 'Помилка при зміні інформації картки',
        });
      }
    }
  };

  // Effect to handle keydown events (specifically "Escape" key to close the modal)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setSuccessMessage(false);
        dispatch(visibleModalForCard());
        navigate(`/board/${boardId}/card/${cardId}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <div className={s.overlay}>
        <div className={s.wrapper}>
          <div className={s.infopart}>
            <div className={s.titleContainer}>
              {!isEditCardTitle ? (
                <h2 onClick={handleTitleClick}>Назва картки {data?.title}</h2>
              ) : (
                <h2>
                  Назва картки{' '}
                  <Input
                    defaultValue={data?.title}
                    onBlur={handleTitleChange}
                    onChange={handleTitleInputChange}
                    classes={{
                      root: s.inputRoot,
                      input: s.inputInput,
                    }}
                  />
                </h2>
              )}
            </div>
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
              <textarea maxLength={5000} defaultValue={data?.description} onChange={handleDescription} />
            </div>
          </div>
          <div className={s.operations}>
            <div
              onClick={(): void => {
                dispatch(visibleModalForCard());
                navigate(`/board/${boardId}`);
              }}
            >
              X
            </div>
            <h2>Дії над карткою</h2>
            <button type="button" onClick={(): void => handleCardModalWindow('copy')}>
              Копіювати
            </button>
            <button type="button" onClick={(): void => handleCardModalWindow('move')}>
              Перемістити
            </button>
            <button type="button" onClick={(): void => handleCardModalWindow('delete')}>
              Видалити
            </button>
            <button
              type="button"
              onClick={(): void => {
                sendNewDataCardOnServer();
              }}
            >
              Зберегти зміни
            </button>
          </div>
        </div>
        {isVisibleModalWindow && (
          <CardModal
            type={typeCardModal}
            boardId={boardId || ''}
            listId={
              dataBoard?.lists
                .find((list) => list.cards.some((card) => card.id.toString() === cardId))
                ?.id.toString() || ''
            }
            cardTitle={data?.title || ''}
            onClose={(): void => setVisibleModalWindow(false)}
            cardData={data}
          />
        )}
      </div>
      <Modal
        open={successMessage}
        onClose={handleClose}
        aria-labelledby="success-modal-title"
        aria-describedby="success-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="success-modal-title" variant="h6" component="h2">
            Успіх!
          </Typography>
          <Typography id="success-modal-description" sx={{ mt: 2 }}>
            Картка змінена успішно.
          </Typography>
        </Box>
      </Modal>
    </>
  );
}

export default ModalCardWindow;
