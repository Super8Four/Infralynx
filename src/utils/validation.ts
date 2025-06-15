import { Request, Response, NextFunction } from 'express';

export const validateDevice = (req: Request, res: Response, next: NextFunction) => {
    const { name, type, status } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({
            error: 'Validation Error',
            message: 'Device name is required and must be a non-empty string'
        });
    }

    if (!type || typeof type !== 'string' || type.trim().length === 0) {
        return res.status(400).json({
            error: 'Validation Error',
            message: 'Device type is required and must be a non-empty string'
        });
    }

    if (!status || typeof status !== 'string' || status.trim().length === 0) {
        return res.status(400).json({
            error: 'Validation Error',
            message: 'Device status is required and must be a non-empty string'
        });
    }

    next();
};

export const validateRack = (req: Request, res: Response, next: NextFunction) => {
    const { name, location, capacity } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({
            error: 'Validation Error',
            message: 'Rack name is required and must be a non-empty string'
        });
    }

    if (!location || typeof location !== 'string' || location.trim().length === 0) {
        return res.status(400).json({
            error: 'Validation Error',
            message: 'Rack location is required and must be a non-empty string'
        });
    }

    if (!capacity || typeof capacity !== 'number' || capacity <= 0) {
        return res.status(400).json({
            error: 'Validation Error',
            message: 'Rack capacity is required and must be a positive number'
        });
    }

    next();
};

export const validateSite = (req: Request, res: Response, next: NextFunction) => {
    const { name, address } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({
            error: 'Validation Error',
            message: 'Site name is required and must be a non-empty string'
        });
    }

    if (!address || typeof address !== 'string' || address.trim().length === 0) {
        return res.status(400).json({
            error: 'Validation Error',
            message: 'Site address is required and must be a non-empty string'
        });
    }

    next();
}; 