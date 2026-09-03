import { createSlice } from '@reduxjs/toolkit';

// idle — ничего не показываем (ещё не решили, или тур уже пройден в этой сессии)
// modal — стартовая модалка "Let's discover Promofire"
// tour — пошаговые тултипы по разделам (см. discoverySteps)
export type DiscoveryStage = 'idle' | 'modal' | 'tour';

interface DiscoveryState {
  stage: DiscoveryStage;
  // 1-based индекс в отфильтрованном под роль списке шагов
  step: number;
}

const initialState: DiscoveryState = { stage: 'idle', step: 0 };

const discoverySlice = createSlice({
  name: 'discovery',
  initialState,
  reducers: {
    openDiscoveryModalAC: (state) => {
      state.stage = 'modal';
    },
    startDiscoveryTourAC: (state) => {
      state.stage = 'tour';
      state.step = 1;
    },
    nextDiscoveryStepAC: (state) => {
      state.step += 1;
    },
    closeDiscoveryAC: (state) => {
      state.stage = 'idle';
      state.step = 0;
    },
  },
});

export const {
  openDiscoveryModalAC,
  startDiscoveryTourAC,
  nextDiscoveryStepAC,
  closeDiscoveryAC,
} = discoverySlice.actions;
export default discoverySlice.reducer;
