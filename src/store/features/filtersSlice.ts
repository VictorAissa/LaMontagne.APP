import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DateRange } from "react-day-picker";
import { addDays } from 'date-fns';

interface SerializableDateRange {
    from: string | undefined;  // ISO
    to: string | undefined;
}

interface FiltersState {
    dateRange: SerializableDateRange | undefined;
    season: 'SUMMER' | 'WINTER' | undefined;
}

const initialState: FiltersState = {
    dateRange: undefined,
    season: undefined,
}

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setDateRange: (state, action: PayloadAction<SerializableDateRange | undefined>) => {
            state.dateRange = action.payload ? {
                from: action.payload.from,
                to: action.payload.to,
            } : undefined;
        },
        setSeason: (state, action: PayloadAction<'SUMMER' | 'WINTER' | undefined>) => {
            state.season = action.payload;
        },
        resetFilters: (state) => {
            state.dateRange = undefined;
            state.season = undefined;
        }
    }
})

export const { setDateRange, setSeason, resetFilters } = filtersSlice.actions
export default filtersSlice.reducer