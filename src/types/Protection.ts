export class Rope {
    diameter: number;
    length: number;

    constructor(data?: Partial<Rope>) {
        this.diameter = data?.diameter || 0;
        this.length = data?.length || 0;
    }
}

export class Protections {
    ropes: Array<Rope>;
    nuts: number;
    cams: number[];
    screws: number;

    constructor(data?: Partial<Protections>) {
        this.ropes = data?.ropes?.map(rope => new Rope(rope)) || [new Rope()];
        this.nuts = data?.nuts || 0;
        this.cams = data?.cams || [0];
        this.screws = data?.screws || 0;
    }
}