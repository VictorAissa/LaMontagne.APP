import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Journey } from '../../types/Journey';
import { api } from '@/services/api';
import { journeyAdapter } from '../../adapters/journeyAdapter';

interface JourneysState {
    journeys: Journey[] | null;
    currentJourney: Journey | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

interface JourneyWithFiles {
    journeyData: Journey;
    files?: File[];
}

const initialState: JourneysState = {
    journeys: null,
    currentJourney: null,
    status: 'idle',
    error: null,
};

export const fetchUserJourneys = createAsyncThunk(
    'journey/fetchUserJourneys',
    async (userId: string) => {
        const { data, error } = await api.getUserJourneys(userId);
        if (error) throw new Error(error);
        return data.map((journey: Journey) => journeyAdapter.toJSON(journey));
    }
);

export const fetchJourneyById = createAsyncThunk(
    'journey/fetchJourneyById',
    async (journeyId: string) => {
        const { data, error } = await api.getJourneyById(journeyId);
        if (error) throw new Error(error);
        return journeyAdapter.toJSON(data);
    }
);

export const createJourney = createAsyncThunk(
    'journey/create',
    async (payload: JourneyWithFiles, { rejectWithValue }) => {
        try {
            const { journeyData, files } = payload;
            
            // Utiliser la méthode API modifiée qui gère le FormData en interne
            const response = await api.createJourney(journeyData, files);
            
            if (response.error) {
                throw new Error(response.error);
            }
            
            return response.data;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Erreur inconnue');
        }
    }
);

export const updateJourney = createAsyncThunk(
    'journey/update',
    async (payload: JourneyWithFiles, { rejectWithValue }) => {
        try {
            const { journeyData, files } = payload;
            
            if (!journeyData.id) {
                throw new Error('ID de journey manquant pour la mise à jour');
            }
            
            const response = await api.updateJourney(journeyData, files);
            
            if (response.error) {
                throw new Error(response.error);
            }
            
            return response.data;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Erreur inconnue');
        }
    }
);

export const deleteJourney = createAsyncThunk(
    'journey/deleteJourney',
    async (journeyId: string) => {
        const { error } = await api.deleteJourney(journeyId);
        if (error) throw new Error(error);
        return journeyId;
    }
);

const journeySlice = createSlice({
    name: 'journey',
    initialState,
    reducers: {
        resetJourneys: (state) => {
            state.journeys = null;
        },
        resetCurrentJourney: (state) => {
            state.currentJourney = null;
        },
        setCurrentJourney: (state, action: PayloadAction<Journey>) => {
            state.currentJourney = action.payload;
        }
    },
    extraReducers: (builder) => {
        // fetchUserJourneys
        builder
            .addCase(fetchUserJourneys.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserJourneys.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.journeys = action.payload;
                state.error = null;
            })
            .addCase(fetchUserJourneys.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Une erreur est survenue';
            })

        // fetchJourneyById
        builder
            .addCase(fetchJourneyById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchJourneyById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentJourney = action.payload;
                state.error = null;
            })
            .addCase(fetchJourneyById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Une erreur est survenue';
            })

        // createJourney
        builder
            .addCase(createJourney.fulfilled, (state, action) => {
                if (state.journeys) {
                    state.journeys.push(action.payload);
                } else {
                    state.journeys = [action.payload];
                }
                state.error = null;
            })

        // updateJourney
        builder
            .addCase(updateJourney.fulfilled, (state, action) => {
                if (state.journeys) {
                    state.journeys = state.journeys.map(journey =>
                        journey.id === action.payload.id ? action.payload : journey
                    );
                }
                if (state.currentJourney?.id === action.payload.id) {
                    state.currentJourney = action.payload;
                }
                state.error = null;
            })

        // deleteJourney
        builder
            .addCase(deleteJourney.fulfilled, (state, action) => {
                if (state.journeys) {
                    state.journeys = state.journeys.filter(
                        journey => journey.id !== action.payload
                    );
                }
                if (state.currentJourney?.id === action.payload) {
                    state.currentJourney = null;
                }
                state.error = null;
            })
    }
});

export const { resetJourneys, resetCurrentJourney, setCurrentJourney } = journeySlice.actions;
export default journeySlice.reducer;