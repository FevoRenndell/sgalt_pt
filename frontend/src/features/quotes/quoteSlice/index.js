import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'quote',
  initialState: { },
  reducers: { }, // aquí irán acciones del módulo de cotizaciones
});

export default slice.reducer;
