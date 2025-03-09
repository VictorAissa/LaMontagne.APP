import { differenceInDays } from "date-fns";

export class Meteo {
    sky: SkyCondition;
    temperature: Temperature;
    iso: Iso;
    wind: Wind;
    bera: number;

    constructor(data?: Partial<Meteo>) {
        this.sky = data?.sky || 'SUNNY';
        this.temperature = new Temperature(data?.temperature);
        this.iso = new Iso(data?.iso);
        this.wind = new Wind(data?.wind);
        this.bera = data?.bera || 0;
    }

    getDisplayName(): string {
        switch (this.sky) {
            case 'SUNNY':
                return 'Soleil'
            case 'PARTLY_CLOUDY':
                return 'Partiellement nuageux'
            case 'CLOUDY':
                return 'Nuageux'
            case 'LIGHT_RAIN':
                return 'Petite pluie'
            case 'HEAVY_RAIN':
                return 'Grosse pluie'
            case 'LIGHT_SNOW':
                return 'Neige'
            case 'HEAVY_SNOW':
                return 'Grosse neige'
            default:
                return '';
        }
    }

    shouldUpdateMeteo(journeyDate: Date): boolean {
        const daysUntilJourney = differenceInDays(journeyDate, new Date());
        return daysUntilJourney <= 7 && daysUntilJourney > 0;
    }
}

export class Temperature {
    min: number;
    max: number;

    constructor(data?: Partial<Temperature>) {
        this.min = data?.min || 0;
        this.max = data?.max || 0;
    }
}

export class Iso {
    night: number;
    day: number;

    constructor(data?: Partial<Iso>) {
        this.night = data?.night || 0;
        this.day = data?.day || 0;
    }
}

export class Wind {
    direction: WindDirection;
    speed: number;

    constructor(data?: Partial<Wind>) {
        this.direction = data?.direction || 'N';
        this.speed = data?.speed || 0;
    }

    getRotation(): number {
        const directions = {
            'N': 0, 'NE': 45, 'E': 90, 'SE': 135,
            'S': 180, 'SW': 225, 'W': 270, 'NW': 315
        };
        return directions[this.direction];
    }
}

export type WindDirection = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";
export type SkyCondition = 'SUNNY' | 'PARTLY_CLOUDY' | 'CLOUDY' | 'LIGHT_RAIN' | 'HEAVY_RAIN' | 'LIGHT_SNOW' | 'HEAVY_SNOW';