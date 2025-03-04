import React from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import SectionTitle from '@/components/SectionTitle';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

import { api } from '@/services/api';
import { Meteo, SkyCondition, WindDirection } from '@/types/Meteo';
import { Label } from '../ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';

interface MeteoFormProps {
    meteo: Meteo;
    onChange: (meteo: Meteo) => void;
    date: Date;
    coordinates: { latitude: number; longitude: number };
}

const MeteoForm: React.FC<MeteoFormProps> = ({
    meteo,
    onChange,
    date,
    coordinates,
}) => {
    const SKY_OPTIONS = ['SUNNY', 'PARTLY_CLOUDY', 'CLOUDY', 'SNOW', 'RAIN'];
    const WIND_DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const BERA = ['0', '1', '2', '3', '4', '5'];

    const canRequestMeteo = () => {
        if (!date) return false;
        const journeyDate = new Date(date);
        const now = new Date();
        const difference = journeyDate.getTime() - now.getTime();
        return difference > 0 && difference <= 7 * 24 * 60 * 60 * 1000;
    };

    const handleSkyChange = (value: string) => {
        const updatedMeteo = new Meteo({
            ...meteo,
            sky: value as SkyCondition,
        });
        onChange(updatedMeteo);
    };

    const handleTempMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const max = Number(e.target.value) || 0;
        const updatedMeteo = new Meteo({
            ...meteo,
            temperature: {
                ...meteo.temperature,
                max,
            },
        });
        onChange(updatedMeteo);
    };

    const handleTempMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const min = Number(e.target.value) || 0;
        const updatedMeteo = new Meteo({
            ...meteo,
            temperature: {
                ...meteo.temperature,
                min,
            },
        });
        onChange(updatedMeteo);
    };

    const handleIsoDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const day = Number(e.target.value) || 0;
        const updatedMeteo = new Meteo({
            ...meteo,
            iso: {
                ...meteo.iso,
                day,
            },
        });
        onChange(updatedMeteo);
    };

    const handleIsoNightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const night = Number(e.target.value) || 0;
        const updatedMeteo = new Meteo({
            ...meteo,
            iso: {
                ...meteo.iso,
                night,
            },
        });
        onChange(updatedMeteo);
    };

    const handleWindDirectionChange = (value: string) => {
        const updatedMeteo = new Meteo({
            ...meteo,
            wind: {
                ...meteo.wind,
                direction: value as WindDirection,
            },
        });
        onChange(updatedMeteo);
    };

    const handleWindSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const speed = Number(e.target.value) || 0;
        const updatedMeteo = new Meteo({
            ...meteo,
            wind: {
                ...meteo.wind,
                speed,
            },
        });
        onChange(updatedMeteo);
    };

    const handleBeraChange = (value: string) => {
        const parsedValue = parseInt(value, 0);
        const updatedMeteo = new Meteo({
            ...meteo,
            bera: parsedValue,
        });
        onChange(updatedMeteo);
    };

    const handleGetMeteo = async () => {
        try {
            if (!coordinates.latitude || !coordinates.longitude) {
                return;
            }

            const formattedDate =
                date instanceof Date
                    ? date.toISOString().split('T')[0]
                    : new Date(date).toISOString().split('T')[0];

            const response = await api.getMeteoByCoordinates(
                coordinates.latitude,
                coordinates.longitude,
                formattedDate
            );

            if (response.error) {
                console.error(
                    'Erreur lors de la récupération des données météo:',
                    response.error
                );
                return;
            }

            const meteoData = new Meteo(response.data);
            onChange(meteoData);
        } catch (error) {
            console.error('Exception lors de la requête météo:', error);
        }
    };

    return (
        <>
            <SectionTitle content="Météo" />
            <Card className="mb-8">
                <CardContent className="pt-6">
                    <div className="flex flex-col gap-6 mb-6">
                        <div>
                            <Label htmlFor="meteo-sky" className="mr-3">
                                Ciel
                            </Label>
                            <Select
                                value={meteo.sky}
                                onValueChange={handleSkyChange}
                            >
                                <SelectTrigger id="meteo-sky" className="mt-2">
                                    <SelectValue placeholder="Sélectionner les conditions" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SKY_OPTIONS.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {option === 'SUNNY'
                                                ? 'Ensoleillé'
                                                : option === 'PARTLY_CLOUDY'
                                                ? 'Partiellement nuageux'
                                                : option === 'CLOUDY'
                                                ? 'Nuageux'
                                                : option === 'SNOW'
                                                ? 'Neige'
                                                : 'Pluie'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="meteo-bera">
                                Indice BERA (1-5)
                            </Label>
                            <Select
                                value={meteo.bera.toString()}
                                onValueChange={handleBeraChange}
                                defaultValue="0"
                            >
                                <SelectTrigger id="bera">
                                    <SelectValue placeholder="0" />
                                </SelectTrigger>
                                <SelectContent>
                                    {BERA.map((value) => (
                                        <SelectItem key={value} value={value}>
                                            {value}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <Label>Températures (°C)</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <div>
                                    <Label
                                        htmlFor="temp-max"
                                        className="text-sm"
                                    >
                                        Max
                                    </Label>
                                    <Input
                                        id="temp-max"
                                        type="number"
                                        name="meteo.temperature.max"
                                        value={meteo.temperature.max || ''}
                                        onChange={handleTempMaxChange}
                                        placeholder="-5"
                                    />
                                </div>
                                <div>
                                    <Label
                                        htmlFor="temp-min"
                                        className="text-sm"
                                    >
                                        Min
                                    </Label>
                                    <Input
                                        id="temp-min"
                                        type="number"
                                        name="meteo.temperature.min"
                                        value={meteo.temperature.min || ''}
                                        onChange={handleTempMinChange}
                                        placeholder="5"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <Label>ISO (m)</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <div>
                                    <Label
                                        htmlFor="iso-day"
                                        className="text-sm"
                                    >
                                        Jour
                                    </Label>
                                    <Input
                                        id="iso-day"
                                        type="number"
                                        name="meteo.iso.day"
                                        value={meteo.iso.day || ''}
                                        onChange={handleIsoDayChange}
                                        placeholder="3000"
                                    />
                                </div>
                                <div>
                                    <Label
                                        htmlFor="iso-night"
                                        className="text-sm"
                                    >
                                        Nuit
                                    </Label>
                                    <Input
                                        id="iso-night"
                                        type="number"
                                        name="meteo.iso.night"
                                        value={meteo.iso.night || ''}
                                        onChange={handleIsoNightChange}
                                        placeholder="2000"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-6 mb-10">
                        <div>
                            <Label>Vent</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <div className="self-center">
                                    <Label
                                        htmlFor="wind-direction"
                                        className="text-sm"
                                    >
                                        Direction
                                    </Label>
                                    <Select
                                        value={meteo.wind.direction}
                                        onValueChange={
                                            handleWindDirectionChange
                                        }
                                    >
                                        <SelectTrigger id="wind-direction">
                                            <SelectValue placeholder="Direction" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {WIND_DIRECTIONS.map((dir) => (
                                                <SelectItem
                                                    key={dir}
                                                    value={dir}
                                                >
                                                    {dir}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label
                                        htmlFor="wind-speed"
                                        className="text-sm"
                                    >
                                        Vitesse (km/h)
                                    </Label>
                                    <Input
                                        id="wind-speed"
                                        type="number"
                                        name="meteo.wind.speed"
                                        value={meteo.wind.speed || ''}
                                        onChange={handleWindSpeedChange}
                                        placeholder="10"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end mb-4">
                        {canRequestMeteo() && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleGetMeteo}
                                className="flex items-center gap-2"
                            >
                                <RefreshCw size={16} />
                                Mettre à jour la météo
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </>
    );
};

export default MeteoForm;
