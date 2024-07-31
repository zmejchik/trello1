import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import React, { ReactElement, useEffect, useState } from 'react';
import api from '../../../../../../api/request';
import s from './CardModal.module.scss';

interface ModalCardProps {
  type: string;
  boardId: string;
  listId: string;
  cardTitle: string;
  cardData:
    | {
        id: number;
        title: string;
        description: string;
        position: number;
        users: string[];
        custom: {
          deadline: number;
        };
        created_at: number;
      }
    | undefined;
  onClose: () => void;
}

interface AllBoards {
  id: string;
  title: string;
  custom: Record<string, number>;
}
interface AllLists {
  id: string;
  title: string;
  position: number;
}

export function CardModal({ type, boardId, listId, cardTitle, cardData, onClose }: ModalCardProps): ReactElement {
  const [listAllTitlesBoards, setListAllTitlesBoards] = useState<{ id: string; title: string }[]>([]);
  const [listAllTitlesLists, setListAllTitlesLists] = useState<{ id: string; title: string }[]>([]);
  const [selectedBoardTitle, setSelectedBoardTitle] = useState('');
  const [selectedBoardId, setSelectedBoardId] = useState(boardId);
  const [selectedListTitle, setSelectedListTitle] = useState('');
  const [selectedListId, setSelectedListId] = useState(listId);

  const handleChangeBoardTitle = (event: SelectChangeEvent<string>): void => {
    const boardTitleSelected = event.target.value;
    const boardIdSelected = listAllTitlesBoards.find((board) => board.title === boardTitleSelected)?.id || '';
    setSelectedBoardTitle(boardTitleSelected);
    setSelectedBoardId(boardIdSelected);
  };

  useEffect(() => {
    api.get('/board').then((response) => {
      const dataBoards = response.data || response;
      if (dataBoards.boards && Array.isArray(dataBoards.boards)) {
        const allBoardsTitles = dataBoards.boards.map((board: AllBoards) => ({
          id: board.id,
          title: board.title,
        }));
        setListAllTitlesBoards(allBoardsTitles);
        if (allBoardsTitles.length > 0) {
          setSelectedBoardTitle(allBoardsTitles[0].title);
          setSelectedBoardId(allBoardsTitles[0].id);
        }
      }
    });
  }, []);

  const listAllBoardForSelected =
    listAllTitlesBoards != null
      ? listAllTitlesBoards.map((board) => (
          <MenuItem key={board.id} value={board.title}>
            {board.title}
          </MenuItem>
        ))
      : '';

  useEffect(() => {
    api.get(`/board/${selectedBoardId}`).then((response) => {
      const dataLists = response.data || response;
      if (dataLists.lists && Array.isArray(dataLists.lists)) {
        const allListsTitles = dataLists.lists.map((list: AllLists) => ({
          id: list.id,
          title: list.title,
        }));
        setListAllTitlesLists(allListsTitles);
        if (allListsTitles.length > 0) {
          setSelectedListTitle(allListsTitles[0].title);
          setSelectedListId(allListsTitles[0].id);
        }
      }
    });
  }, [selectedBoardId]);

  const handleChangeListTitle = (event: SelectChangeEvent<string>): void => {
    const listTitleSelected = event.target.value;
    const listIdSelected = listAllTitlesLists.find((list) => list.title === listTitleSelected)?.id || '';
    setSelectedListTitle(listTitleSelected);
    setSelectedListId(listIdSelected);
  };

  const listAllListForSelected =
    listAllTitlesLists != null
      ? listAllTitlesLists.map((list) => (
          <MenuItem key={list.id} value={list.title}>
            {list.title}
          </MenuItem>
        ))
      : '';

  const sendDataToServer = async (): Promise<void> => {
    const updatedCardData = {
      ...cardData,
      list_id: selectedListId,
    };
    switch (type) {
      case 'copy':
        await api.post(`/board/${selectedBoardId}/card`, updatedCardData);
        break;
      case 'move':
        await api.delete(`/board/${boardId}/card/${cardData?.id}`);
        await api.post(`/board/${selectedBoardId}/card`, updatedCardData);
        break;
      default:
        break;
    }
    onClose();
  };

  return (
    <div className={s.modal}>
      <div className={s.modalContent}>
        <h2>Деталі дій {type}</h2>
        <FormControl sx={{ mb: 2, minWidth: 250 }} size="small">
          <TextField id="card_name" label="Назва картки" defaultValue={cardTitle} margin="normal" fullWidth />
        </FormControl>
        <FormControl sx={{ mb: 2, minWidth: 250 }} size="small">
          <InputLabel sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Вибір дошки
          </InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={selectedBoardTitle}
            label="Дошка"
            onChange={handleChangeBoardTitle}
            fullWidth
            margin="dense"
          >
            {listAllBoardForSelected}
          </Select>
        </FormControl>
        <FormControl sx={{ mb: 2, minWidth: 250 }} size="small">
          <InputLabel sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Вибір списку
          </InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={selectedListTitle}
            label="Список"
            onChange={handleChangeListTitle}
            fullWidth
          >
            {listAllListForSelected}
          </Select>
        </FormControl>
        <button type="button" onClick={sendDataToServer} className={s.closeButton}>
          Виконати операцію
        </button>
      </div>
    </div>
  );
}

export default CardModal;
