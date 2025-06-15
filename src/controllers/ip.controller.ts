import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// IP Prefix Controllers
export const createIPPrefix = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const prefix = await prisma.iPPrefix.create({
      data: req.body,
      include: {
        site: true,
        parent: true,
        children: true,
        ipAddresses: true,
      },
    });
    res.status(201).json({
      status: 'success',
      data: prefix,
    });
  } catch (error) {
    next(error);
  }
};

export const getIPPrefixes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const prefixes = await prisma.iPPrefix.findMany({
      include: {
        site: true,
        parent: true,
        children: true,
        ipAddresses: true,
      },
    });
    res.status(200).json({
      status: 'success',
      data: prefixes,
    });
  } catch (error) {
    next(error);
  }
};

export const getIPPrefix = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const prefixId = parseInt(req.params.id, 10);
    const prefix = await prisma.iPPrefix.findUnique({
      where: { id: prefixId },
      include: {
        site: true,
        parent: true,
        children: true,
        ipAddresses: true,
      },
    });

    if (!prefix) {
      throw new AppError('IP Prefix not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: prefix,
    });
  } catch (error) {
    next(error);
  }
};

export const updateIPPrefix = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const prefixId = parseInt(req.params.id, 10);
    const prefix = await prisma.iPPrefix.update({
      where: { id: prefixId },
      data: req.body,
      include: {
        site: true,
        parent: true,
        children: true,
        ipAddresses: true,
      },
    });

    res.status(200).json({
      status: 'success',
      data: prefix,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteIPPrefix = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const prefixId = parseInt(req.params.id, 10);
    await prisma.iPPrefix.delete({
      where: { id: prefixId },
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// IP Address Controllers
export const createIPAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const address = await prisma.iPAddress.create({
      data: req.body,
      include: {
        device: true,
        prefix: true,
      },
    });
    res.status(201).json({
      status: 'success',
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

export const getIPAddresses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const addresses = await prisma.iPAddress.findMany({
      include: {
        device: true,
        prefix: true,
      },
    });
    res.status(200).json({
      status: 'success',
      data: addresses,
    });
  } catch (error) {
    next(error);
  }
};

export const getIPAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const addressId = parseInt(req.params.id, 10);
    const address = await prisma.iPAddress.findUnique({
      where: { id: addressId },
      include: {
        device: true,
        prefix: true,
      },
    });

    if (!address) {
      throw new AppError('IP Address not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

export const updateIPAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const addressId = parseInt(req.params.id, 10);
    const address = await prisma.iPAddress.update({
      where: { id: addressId },
      data: req.body,
      include: {
        device: true,
        prefix: true,
      },
    });

    res.status(200).json({
      status: 'success',
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteIPAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const addressId = parseInt(req.params.id, 10);
    await prisma.iPAddress.delete({
      where: { id: addressId },
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
}; 