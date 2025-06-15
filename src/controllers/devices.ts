import { Request, Response } from 'express';
import DatabaseService from '../services/database';
import { PrismaClient } from '@prisma/client';

interface Device {
    id: number;
    name: string;
    type: string;
    status: string;
    rackId?: number;
    siteId?: number;
    createdAt: Date;
    updatedAt: Date;
}

class DeviceController {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = DatabaseService.getInstance().getPrismaClient();
    }

    async getAllDevices(req: Request, res: Response): Promise<void> {
        try {
            const devices = await this.prisma.device.findMany({
                include: {
                    rack: true,
                    site: true
                }
            });
            res.json(devices);
        } catch (error) {
            console.error('Error fetching devices:', error);
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to fetch devices'
            });
        }
    }

    async getDeviceById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id || isNaN(Number(id))) {
                res.status(400).json({
                    error: 'Bad Request',
                    message: 'Invalid device ID'
                });
                return;
            }

            const device = await this.prisma.device.findUnique({
                where: { id: Number(id) },
                include: {
                    rack: true,
                    site: true
                }
            });
            
            if (!device) {
                res.status(404).json({
                    error: 'Not Found',
                    message: 'Device not found'
                });
                return;
            }

            res.json(device);
        } catch (error) {
            console.error('Error fetching device:', error);
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to fetch device'
            });
        }
    }

    async createDevice(req: Request, res: Response): Promise<void> {
        try {
            const { name, type, status, rackId, siteId } = req.body;

            const deviceData = {
                name,
                type,
                status,
                ...(rackId && { rack: { connect: { id: Number(rackId) } } }),
                ...(siteId && { site: { connect: { id: Number(siteId) } } })
            };

            const newDevice = await this.prisma.device.create({
                data: deviceData,
                include: {
                    rack: true,
                    site: true
                }
            });

            res.status(201).json(newDevice);
        } catch (error: any) {
            console.error('Error creating device:', error);
            if (error?.code === 'P2002') {
                res.status(400).json({
                    error: 'Bad Request',
                    message: 'A device with this name already exists'
                });
                return;
            }
            if (error?.code === 'P2025') {
                res.status(400).json({
                    error: 'Bad Request',
                    message: 'Referenced rack or site does not exist'
                });
                return;
            }
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to create device'
            });
        }
    }
}

export default DeviceController;