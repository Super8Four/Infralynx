import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const createSite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const site = await prisma.site.create({
      data: req.body,
    });
    res.status(201).json({
      status: 'success',
      data: site,
    });
  } catch (error) {
    next(error);
  }
};

export const getSites = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sites = await prisma.site.findMany({
      include: {
        devices: true,
        racks: true,
      },
    });
    res.status(200).json({
      status: 'success',
      data: sites,
    });
  } catch (error) {
    next(error);
  }
};

export const getSite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const siteId = parseInt(req.params.id, 10);
    const site = await prisma.site.findUnique({
      where: { id: siteId },
      include: {
        devices: true,
        racks: true,
      },
    });

    if (!site) {
      throw new AppError('Site not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: site,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const siteId = parseInt(req.params.id, 10);
    const site = await prisma.site.update({
      where: { id: siteId },
      data: req.body,
      include: {
        devices: true,
        racks: true,
      },
    });

    res.status(200).json({
      status: 'success',
      data: site,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const siteId = parseInt(req.params.id, 10);
    await prisma.site.delete({
      where: { id: siteId },
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
}; 