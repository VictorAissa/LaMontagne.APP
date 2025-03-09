// SkySelector.tsx
import React from 'react';
import { SkyCondition } from '@/types/Meteo';

// Importer les icônes
import sunnyIcon from '@/assets/icons/meteo/sunny.png';
import partlyCloudyIcon from '@/assets/icons/meteo/partly-cloudy.png';
import cloudyIcon from '@/assets/icons/meteo/cloudy.png';
import lightSnowIcon from '@/assets/icons/meteo/snow.png';
import heavySnowIcon from '@/assets/icons/meteo/heavy_snow.png';
import heavyRainIcon from '@/assets/icons/meteo/rain.png';
import lightRainIcon from '@/assets/icons/meteo/rain.png';
import { Label } from './ui/label';

interface SkySelectorProps {
    value: SkyCondition;
    onChange: (value: SkyCondition) => void;
}

const skyOptions = [
    { value: 'SUNNY' as SkyCondition, icon: sunnyIcon, label: 'Ensoleillé' },
    {
        value: 'PARTLY_CLOUDY' as SkyCondition,
        icon: partlyCloudyIcon,
        label: 'Partiellement nuageux',
    },
    { value: 'CLOUDY' as SkyCondition, icon: cloudyIcon, label: 'Nuageux' },
    {
        value: 'LIGHT_SNOW' as SkyCondition,
        icon: lightSnowIcon,
        label: 'Neige légère',
    },
    {
        value: 'HEAVY_SNOW' as SkyCondition,
        icon: heavySnowIcon,
        label: 'Neige forte',
    },
    {
        value: 'LIGHT_RAIN' as SkyCondition,
        icon: lightRainIcon,
        label: 'Pluie légère',
    },
    {
        value: 'HEAVY_RAIN' as SkyCondition,
        icon: heavyRainIcon,
        label: 'Pluie forte',
    },
];

const SkySelector: React.FC<SkySelectorProps> = ({ value, onChange }) => {
    return (
        <div>
            <Label className="block mb-2">Conditions météo</Label>
            <div className="flex flex-wrap gap-3 mt-2">
                {skyOptions.map((option) => (
                    <div
                        key={option.value}
                        className={`
                            flex flex-col items-center p-3 rounded-lg cursor-pointer transition-all
                            ${
                                value === option.value
                                    ? 'bg-blue-100 border-2 border-blue-500 shadow-md'
                                    : 'bg-zinc-50 hover:bg-zinc-100 border-2 border-transparent'
                            }
                        `}
                        onClick={() => onChange(option.value)}
                    >
                        <img
                            src={option.icon}
                            alt={option.label}
                            className="w-10 h-10"
                        />
                        <span className="text-sm mt-1">{option.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkySelector;
