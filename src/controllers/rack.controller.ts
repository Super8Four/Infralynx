import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const createRack = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rack = await prisma.rack.create({
      data: req.body,
    });
    res.status(201).json({
      status: 'success',
      data: rack,
    });
  } catch (error) {
    next(error);
  }
};

export const getRacks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const racks = await prisma.rack.findMany({
      include: {
        devices: true,
        site: true,
      },
    });
    res.status(200).json({
      status: 'success',
      data: racks,
    });
  } catch (error) {
    next(error);
  }
};

export const getRack = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rackId = parseInt(req.params.id, 10);
    const rack = await prisma.rack.findUnique({
      where: { id: rackId },
      include: {
        devices: true,
        site: true,
      },
    });

    if (!rack) {
      throw new AppError('Rack not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: rack,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRack = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rackId = parseInt(req.params.id, 10);
    const rack = await prisma.rack.update({
      where: { id: rackId },
      data: req.body,
      include: {
        devices: true,
        site: true,
      },
    });

    res.status(200).json({
      status: 'success',
      data: rack,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRack = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rackId = parseInt(req.params.id, 10);
    await prisma.rack.delete({
      where: { id: rackId },
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
}; 