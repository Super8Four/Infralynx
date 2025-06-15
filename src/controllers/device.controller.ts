import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const createDevice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const device = await prisma.device.create({
      data: req.body,
    });
    res.status(201).json({
      status: 'success',
      data: device,
    });
  } catch (error) {
    next(error);
  }
};

export const getDevices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const devices = await prisma.device.findMany({
      include: {
        rack: true,
        site: true,
      },
    });
    res.status(200).json({
      status: 'success',
      data: devices,
    });
  } catch (error) {
    next(error);
  }
};

export const getDevice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deviceId = parseInt(req.params.id, 10);
    const device = await prisma.device.findUnique({
      where: { id: deviceId },
      include: {
        rack: true,
        site: true,
      },
    });

    if (!device) {
      throw new AppError('Device not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: device,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDevice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deviceId = parseInt(req.params.id, 10);
    const device = await prisma.device.update({
      where: { id: deviceId },
      data: req.body,
      include: {
        rack: true,
        site: true,
      },
    });

    res.status(200).json({
      status: 'success',
      data: device,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDevice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deviceId = parseInt(req.params.id, 10);
    await prisma.device.delete({
      where: { id: deviceId },
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
}; 