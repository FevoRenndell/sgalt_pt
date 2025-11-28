// src/features/quotation/quotationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const DRAFT_STORAGE_KEY = 'quotationDraft';

// dato iniciales por defecto que relaciona la tabla solicitud de cotizacion y cotización
const defaultDraft = {
  request_id : null,
  discount: 0,
  items: [
    {
      service_id: null,
      quantity: 0,
      unit_price: 0,
      total: 0,
    },
  ],
};

// carga los datos desde el storage del navegador
function loadDraftFromStorage() {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error leyendo quotationDraft desde localStorage', err);
    return null;
  }
}

// guardar los datos en el storage del navegador
function saveDraftToStorage(draft) {
  try {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  } catch (err) {
    console.error('Error guardando quotationDraft en localStorage', err);
  }
}

// limpiar los datos del storage del navegador una vez enviados
function clearDraftFromStorage() {
  console.log("entre")
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch (err) {
    console.error('Error limpiando quotationDraft en localStorage', err);
  }
}

// inicializa el estado del slice, si hay datos en el storage los carga, si no usa los datos por defecto
const initialState = {
  draft: loadDraftFromStorage() || defaultDraft,
};

const quotationSlice = createSlice({
  name: 'quotation',
  initialState,
  reducers: {
    setQuotationDraft(state, action) { // actualizar el draft y guardarlo en el storage
      state.draft = action.payload; // data
      saveDraftToStorage(state.draft); // guarda en storage
    },
    resetQuotationDraft(state) { // limpiar el draft y el storage
      state.draft = defaultDraft; // resetear al default
      clearDraftFromStorage(); // limpia el storage
    },
  },
});

export const { setQuotationDraft, resetQuotationDraft } = quotationSlice.actions;
export default quotationSlice.reducer;
