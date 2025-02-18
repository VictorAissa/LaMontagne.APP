export class GeoPoint {
    latitude: number;
    longitude: number;

    constructor(data?: Partial<GeoPoint>) {
        this.latitude = data?.latitude || 0;
        this.longitude = data?.longitude || 0;
    }

    toString(): string {
        return `${this.latitude.toFixed(6)}, ${this.longitude.toFixed(6)}`;
    }
}

export class Itinerary {
    start: GeoPoint;
    end: GeoPoint;
    gpx: string;

    constructor(data?: Partial<Itinerary>) {
        this.start = new GeoPoint(data?.start);
        this.end = new GeoPoint(data?.end);
        this.gpx = data?.gpx || '';
    }

    hasValidCoordinates(): boolean {
        return this.start.latitude !== 0 && 
               this.start.longitude !== 0 && 
               this.end.latitude !== 0 && 
               this.end.longitude !== 0;
    }

    hasGpxTrack(): boolean {
        return this.gpx !== '';
    }
}

export class Altitudes {
    max: number;
    min: number;
    total: number;

    constructor(data?: Partial<Altitudes>) {
        this.max = data?.max || 0;
        this.min = data?.min || 0;
        this.total = data?.total || 0;
    }

    getDenivele(): number {
        return this.max - this.min;
    }

    isValid(): boolean {
        return this.max > this.min && this.total > 0;
    }
}