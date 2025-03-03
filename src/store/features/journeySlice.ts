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
            
            // Créer un FormData
            const formData = new FormData();
            formData.append('journeyData', JSON.stringify(journeyData));
            
            // Ajouter les fichiers s'il y en a
            if (files && files.length > 0) {
                files.forEach(file => {
                    formData.append('files', file);
                });
            }
            
            // Appel à ton API
            const response = await fetch('/api/journeys', {
                method: 'POST',
                body: formData
                // Pas besoin de définir le Content-Type, fetch le fait automatiquement pour FormData
            });
            
            if (!response.ok) {
                throw new Error('Échec de la création');
            }
            
            const data = await response.json();
            return data;
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
            
            // Créer un FormData
            const formData = new FormData();
            formData.append('journeyData', JSON.stringify(journeyData));
            
            // Ajouter les fichiers s'il y en a
            if (files && files.length > 0) {
                files.forEach(file => {
                    formData.append('files', file);
                });
            }
            
            // Appel à ton API
            const response = await fetch(`/api/journeys/${journeyData.id}`, {
                method: 'PUT',
                body: formData
                // Pas besoin de définir le Content-Type, fetch le fait automatiquement pour FormData
            });
            
            if (!response.ok) {
                throw new Error('Échec de la mise à jour');
            }
            
            const data = await response.json();
            return data;
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