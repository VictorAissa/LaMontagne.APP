import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Journey } from '../../types//Journey'

interface JourneysState {
    journeys: Journey[] | null;
    currentJourney: Journey | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: JourneysState = {
    journeys: null,
    currentJourney: null,
    status: 'idle',
    error: null,
}

const journeySlice = createSlice({
  name: 'journey',
  initialState,
  reducers: {
    setJourneys: (state, action: PayloadAction<Journey[]>) => {
        state.journeys = action.payload;
        state.status = 'succeeded';
    },
    setStatus: (state, action: PayloadAction<'idle' | 'loading' | 'succeeded' | 'failed'>) => {
        state.status = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
        state.error = action.payload;
        state.status = 'failed';
    },
    resetJourneys: (state) => {
        state.journeys = null;
    },
    setCurrentJourney: (state, action: PayloadAction<Journey>) => {
        state.currentJourney = action.payload;
    },
    resetCurrentJourney: (state) => {
        state.currentJourney = null;
    }
  }
})

export const { setJourneys, setStatus, setError, resetJourneys, setCurrentJourney, resetCurrentJourney} = journeySlice.actions
export default journeySlice.reducer