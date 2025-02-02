import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from './DatePickerWithRange';

import {
    resetFilters,
    setDateRange,
    setSeason,
} from '@/store/features/filtersSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { DateRange } from 'react-day-picker';

const JourneyFilters: React.FC = () => {
    const dispatch = useDispatch();
    const serializedDateRange = useSelector(
        (state: RootState) => state.filters.dateRange
    );
    const season = useSelector((state: RootState) => state.filters.season);

    const dateRange: DateRange | undefined = serializedDateRange
        ? {
              from: serializedDateRange.from
                  ? new Date(serializedDateRange.from)
                  : undefined,
              to: serializedDateRange.to
                  ? new Date(serializedDateRange.to)
                  : undefined,
          }
        : undefined;

    const handleDateRangeChange = (range: DateRange | undefined) => {
        dispatch(
            setDateRange(
                range
                    ? {
                          from: range.from?.toISOString(),
                          to: range.to?.toISOString(),
                      }
                    : undefined
            )
        );
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 md:gap-12 p-4">
            <div className="">
                <Label className="block mb-2">Période</Label>
                <DatePickerWithRange
                    dateRange={dateRange}
                    onDateRangeChange={(range) => handleDateRangeChange(range)}
                />
            </div>

            <div className="space-y-4 flex-1">
                <Label className="block">Saison</Label>
                <div className="flex items-center gap-8">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="winter"
                            checked={season === 'WINTER'}
                            onCheckedChange={(checked) =>
                                dispatch(
                                    setSeason(checked ? 'WINTER' : undefined)
                                )
                            }
                        />
                        <Label htmlFor="winter">Hiver</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="summer"
                            checked={season === 'SUMMER'}
                            onCheckedChange={(checked) =>
                                dispatch(
                                    setSeason(checked ? 'SUMMER' : undefined)
                                )
                            }
                        />
                        <Label htmlFor="summer">Été</Label>
                    </div>
                </div>
            </div>

            <div className="self-end">
                <Button
                    variant="secondary"
                    onClick={() => {
                        dispatch(resetFilters());
                    }}
                >
                    Réinitialiser
                </Button>
            </div>
        </div>
    );
};

export default JourneyFilters;
