import React from 'react';
import { addDays } from 'date-fns';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { type DateRange } from 'react-day-picker';

interface JourneyFiltersProps {
    onFiltersChange: (filters: {
        dateRange: DateRange | undefined;
        season: 'SUMMER' | 'WINTER' | undefined;
    }) => void;
}

const JourneyFilters: React.FC<JourneyFiltersProps> = ({ onFiltersChange }) => {
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
        from: addDays(new Date(), -30),
        to: new Date(),
    });

    const [season, setSeason] = React.useState<'SUMMER' | 'WINTER' | undefined>(
        undefined
    );

    React.useEffect(() => {
        onFiltersChange({
            dateRange,
            season,
        });
    }, [dateRange, season, onFiltersChange]);

    return (
        <div className="flex flex-col md:flex-row gap-4 p-4 bg-card rounded-lg shadow-sm">
            <div className="flex-1">
                <Label className="block mb-2">Période</Label>
                <div className="grid gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={'outline'}
                                className="w-full justify-start text-left font-normal"
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateRange?.from ? (
                                    dateRange.to ? (
                                        <>
                                            {format(
                                                dateRange.from,
                                                'd MMM yyyy',
                                                { locale: fr }
                                            )}{' '}
                                            -{' '}
                                            {format(
                                                dateRange.to,
                                                'd MMM yyyy',
                                                { locale: fr }
                                            )}
                                        </>
                                    ) : (
                                        format(dateRange.from, 'd MMM yyyy', {
                                            locale: fr,
                                        })
                                    )
                                ) : (
                                    <span>Sélectionner une période</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={dateRange?.from}
                                selected={dateRange}
                                onSelect={setDateRange}
                                numberOfMonths={2}
                                locale={fr}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="space-y-4">
                <Label className="block">Saison</Label>
                <div className="flex items-center gap-8">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="winter"
                            checked={season === 'WINTER'}
                            onCheckedChange={(checked) => {
                                if (checked && season === 'SUMMER') {
                                    setSeason('WINTER');
                                } else {
                                    setSeason(checked ? 'WINTER' : undefined);
                                }
                            }}
                        />
                        <Label htmlFor="winter">Hiver</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="summer"
                            checked={season === 'SUMMER'}
                            onCheckedChange={(checked) => {
                                if (checked && season === 'WINTER') {
                                    setSeason('SUMMER');
                                } else {
                                    setSeason(checked ? 'SUMMER' : undefined);
                                }
                            }}
                        />
                        <Label htmlFor="summer">Été</Label>
                    </div>
                </div>
            </div>

            <div className="self-end">
                <Button
                    variant="ghost"
                    onClick={() => {
                        setDateRange(undefined);
                        setSeason(undefined);
                    }}
                >
                    Réinitialiser
                </Button>
            </div>
        </div>
    );
};

export default JourneyFilters;
