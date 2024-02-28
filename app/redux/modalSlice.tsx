
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './configStore';

interface ProModalState {
  isOpen: boolean;
}

const initialState:ProModalState = {
  isOpen: false,
} 

export const proModalSlice = createSlice({
  name: 'proModal',
  initialState,
  reducers: {
    openModal: (state:ProModalState) => {
      state.isOpen = true;
    },
    closeModal: (state:ProModalState) => {
      state.isOpen = false;
    },
  },
});

export const { openModal, closeModal } = proModalSlice.actions
