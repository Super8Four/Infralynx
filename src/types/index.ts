export interface Device {
    id: number;
    name: string;
    type: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Rack {
    id: number;
    name: string;
    location: string;
    capacity: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Site {
    id: number;
    name: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}