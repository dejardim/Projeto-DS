import type { Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { ExpensesService } from './services';

const expensesService = new ExpensesService();

export const validateCreateExpense = [
  body('month').isInt({ min: 1, max: 12 }).withMessage('Month must be between 1 and 12'),
  body('year').isInt({ min: 2000 }).withMessage('Year must be valid'),
  body('date').isInt({ min: 1, max: 31 }).withMessage('Date must be between 1 and 31'),
  body('fixed').isBoolean().withMessage('Fixed must be a boolean'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').optional().isString(),
  body('paymentOption').optional().isString(),
  body('metadata').optional().isObject(),
];

export const validateUpdateExpense = [
  body('month').optional().isInt({ min: 1, max: 12 }).withMessage('Month must be between 1 and 12'),
  body('year').optional().isInt({ min: 2000 }).withMessage('Year must be valid'),
  body('date').optional().isInt({ min: 1, max: 31 }).withMessage('Date must be between 1 and 31'),
  body('fixed').optional().isBoolean().withMessage('Fixed must be a boolean'),
  body('amount').optional().isNumeric().withMessage('Amount must be a number'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('category').optional().isString(),
  body('paymentOption').optional().isString(),
  body('metadata').optional().isObject(),
];

export const validateExpenseParams = [
  param('expenseUid').notEmpty().withMessage('Expense ID is required'),
];

export const validateQueryParams = [
  query('month').optional().isInt({ min: 1, max: 12 }).withMessage('Month must be between 1 and 12'),
  query('year').optional().isInt({ min: 2000 }).withMessage('Year must be valid'),
  query('category').optional().isString(),
];

export class ExpensesController {
  async create(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const spreadsheetUid = (req as any).user.uid;
      const result = await expensesService.create(spreadsheetUid, req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const spreadsheetUid = (req as any).user.uid;
      const { month, year, category } = req.query;
      
      const result = await expensesService.getAll(
        spreadsheetUid,
        month ? parseInt(month as string) : undefined,
        year ? parseInt(year as string) : undefined,
        category as string
      );
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const spreadsheetUid = (req as any).user.uid;
      const { expenseUid } = req.params;
      
      const result = await expensesService.getById(spreadsheetUid, expenseUid);
      
      if (!result) {
        return res.status(404).json({ error: 'Expense not found' });
      }
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const spreadsheetUid = (req as any).user.uid;
      const { expenseUid } = req.params;
      
      const result = await expensesService.update(spreadsheetUid, expenseUid, req.body);
      
      if (!result) {
        return res.status(404).json({ error: 'Expense not found' });
      }
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const spreadsheetUid = (req as any).user.uid;
      const { expenseUid } = req.params;
      
      const result = await expensesService.delete(spreadsheetUid, expenseUid);
      
      if (!result) {
        return res.status(404).json({ error: 'Expense not found' });
      }
      
      res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getByCategory(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const spreadsheetUid = (req as any).user.uid;
      const { category } = req.params;
      const { month, year } = req.query;
      
      const result = await expensesService.getByCategory(
        spreadsheetUid,
        category,
        month ? parseInt(month as string) : undefined,
        year ? parseInt(year as string) : undefined
      );
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
