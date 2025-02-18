import { Meteo } from "./Meteo";
import { Protections } from "./Protection";
import { Itinerary, Altitudes } from "./Topo";

export class Journey {
    id: string;
    title: string;
    date: Date;
    season: 'SUMMER' | 'WINTER';
    members: string[];
    pictures: string[];
    itinerary: Itinerary;
    altitudes: Altitudes;
    meteo: Meteo;
    protections: Protections;
    miscellaneous: string;

    constructor(data?: Partial<Journey>) {
        this.id = data?.id || '';
        this.title = data?.title || '';
        this.date = data?.date ? new Date(data?.date) : new Date();
        this.season = data?.season || 'SUMMER';
        this.members = data?.members || [];
        this.pictures = data?.pictures || [];
        this.itinerary = new Itinerary(data?.itinerary);
        this.altitudes = new Altitudes(data?.altitudes);
        this.meteo = new Meteo(data?.meteo);
        this.protections = new Protections(data?.protections);
        this.miscellaneous = data?.miscellaneous || '';
    }

    isFutureJourney(): boolean {
        return this.date > new Date();
    }

    isPastJourney(): boolean {
        return this.date < new Date();
    }

    shouldUpdateMeteo(): boolean {
        return this.isFutureJourney() && this.meteo.shouldUpdateMeteo(this.date);
    }
}