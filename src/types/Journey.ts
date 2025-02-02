export class Journey {
    id: string;
    title: string;
    date: Date;
    season: 'SUMMER' | 'WINTER';
    members: string[];
    pictures: string[];
    itinerary: {
        start: { lat: number; long: number };
        end: { lat: number; long: number };
        gpxId: string;
    };
    altitudes: {
        max: number;
        min: number;
        total: number;
    };
    meteo: {
        sky: 'SUNNY' | 'PARTLY_CLOUDY' | 'CLOUDY' | 'SNOW' | 'RAIN';
        temperature: { top: number; bottom: number };
        iso: { night: number; day: number };
        wind: { direction: string; speed: number };
        bera: number;
    };
    protections: {
        ropes: Array<{ diameter: number; length: number }>;
        nuts: number;
        cams: number[];
        screws: number;
    };
    miscellaneous: string;

    constructor(data: Partial<Journey>) {
        this.id = data.id || '';
        this.title = data.title || '';
        this.date = data.date ? new Date(data.date) : new Date();
        this.season = data.season || 'SUMMER';
        this.members = data.members || [];
        this.pictures = data.pictures || [];
        this.itinerary = {
            start: data.itinerary?.start || { lat: 0, long: 0 },
            end: data.itinerary?.end || { lat: 0, long: 0 },
            gpxId: data.itinerary?.gpxId || ''
        };
        this.altitudes = {
            max: data.altitudes?.max || 0,
            min: data.altitudes?.min || 0,
            total: data.altitudes?.total || 0
        };
        this.meteo = {
            sky: data.meteo?.sky || 'SUNNY',
            temperature: {
                top: data.meteo?.temperature?.top || 0,
                bottom: data.meteo?.temperature?.bottom || 0
            },
            iso: {
                night: data.meteo?.iso?.night || 0,
                day: data.meteo?.iso?.day || 0
            },
            wind: {
                direction: data.meteo?.wind?.direction || 'N',
                speed: data.meteo?.wind?.speed || 0
            },
            bera: data.meteo?.bera || 1
        };
        this.protections = {
            ropes: data.protections?.ropes || [],
            nuts: data.protections?.nuts || 0,
            cams: data.protections?.cams || [],
            screws: data.protections?.screws || 0
        };
        this.miscellaneous = data.miscellaneous || '';
    }

    toJSON() {
        return {
            ...this,
            date: this.date.toISOString()
        };
    }
}