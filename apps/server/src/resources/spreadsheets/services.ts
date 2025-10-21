import { createId } from '@paralleldrive/cuid2';
import bcrypt from 'bcrypt';
import { and, eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { db } from '../../database/connection';
import {
    AbstractsTable,
    ExpenseCategoryTable,
    ExpenseTable,
    PaymentOptionsTable,
    RevenueTable,
    SpreadsheetsTable,
} from '../../database/schema';

export interface CreateSpreadsheetData {
    name: string;
    email?: string;
    username: string;
    password: string;
}

export interface LoginData {
    username: string;
    password: string;
}

export interface CreateAbstractData {
    name: string;
    mount: number;
    year: number;
    budgets: {
        revenue: { planned: number };
        expenses: Array<{ category: string; planned: number }>;
    };
}

export class SpreadsheetsService {
    async signup(data: CreateSpreadsheetData) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const uid = createId();

        const [spreadsheet] = await db
            .insert(SpreadsheetsTable)
            .values({
                uid,
                name: data.name,
                email: data.email,
                username: data.username,
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            .returning();

        const token = jwt.sign(
            { uid: spreadsheet.uid, username: spreadsheet.username },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: '7d' },
        );

        return { spreadsheet: { ...spreadsheet, password: undefined }, token };
    }

    async login(data: LoginData) {
        const [spreadsheet] = await db
            .select()
            .from(SpreadsheetsTable)
            .where(eq(SpreadsheetsTable.username, data.username))
            .limit(1);

        if (!spreadsheet) {
            throw new Error('Invalid credentials');
        }

        const isValidPassword = await bcrypt.compare(
            data.password,
            spreadsheet.password,
        );
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
            { uid: spreadsheet.uid, username: spreadsheet.username },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: '7d' },
        );

        return { spreadsheet: { ...spreadsheet, password: undefined }, token };
    }

    async createAbstract(spreadsheetUid: string, data: CreateAbstractData) {
        // Check if abstract already exists for this month/year
        const existing = await db
            .select()
            .from(AbstractsTable)
            .where(
                and(
                    eq(AbstractsTable.spreadsheet, spreadsheetUid),
                    eq(AbstractsTable.mount, data.mount),
                    eq(AbstractsTable.year, data.year),
                ),
            )
            .limit(1);

        if (existing.length > 0) {
            throw new Error('Abstract already exists for this month/year');
        }

        const uid = createId();
        const [abstract] = await db
            .insert(AbstractsTable)
            .values({
                uid,
                spreadsheet: spreadsheetUid,
                name: data.name,
                mount: data.mount,
                year: data.year,
                budgets: JSON.stringify(data.budgets),
                notes: JSON.stringify({}),
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            .returning();

        return abstract;
    }

    async getAllAbstracts(spreadsheetUid: string) {
        const abstracts = await db
            .select()
            .from(AbstractsTable)
            .where(eq(AbstractsTable.spreadsheet, spreadsheetUid))
            .orderBy(AbstractsTable.year, AbstractsTable.mount);

        return abstracts.map((a) => ({
            ...a,
            budgets: JSON.parse(a.budgets as string),
            notes: JSON.parse(a.notes as string),
        }));
    }

    async getAbstractWithAnalytics(
        spreadsheetUid: string,
        mount: number,
        year: number,
    ) {
        const [abstract] = await db
            .select()
            .from(AbstractsTable)
            .where(
                and(
                    eq(AbstractsTable.spreadsheet, spreadsheetUid),
                    eq(AbstractsTable.mount, mount),
                    eq(AbstractsTable.year, year),
                ),
            )
            .limit(1);

        if (!abstract) {
            throw new Error('Abstract not found');
        }

        // Get actual revenues and expenses for the period
        const revenues = await db
            .select()
            .from(RevenueTable)
            .where(
                and(
                    eq(RevenueTable.spreadsheet, spreadsheetUid),
                    eq(RevenueTable.month, mount),
                    eq(RevenueTable.year, year),
                ),
            );

        const expenses = await db
            .select()
            .from(ExpenseTable)
            .where(
                and(
                    eq(ExpenseTable.spreadsheet, spreadsheetUid),
                    eq(ExpenseTable.month, mount),
                    eq(ExpenseTable.year, year),
                ),
            );

        // Calculate totals
        const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);
        const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

        // Get previous month data for trends
        const prevMonth = mount === 1 ? 12 : mount - 1;
        const prevYear = mount === 1 ? year - 1 : year;

        const prevRevenues = await db
            .select()
            .from(RevenueTable)
            .where(
                and(
                    eq(RevenueTable.spreadsheet, spreadsheetUid),
                    eq(RevenueTable.month, prevMonth),
                    eq(RevenueTable.year, prevYear),
                ),
            );

        const prevExpenses = await db
            .select()
            .from(ExpenseTable)
            .where(
                and(
                    eq(ExpenseTable.spreadsheet, spreadsheetUid),
                    eq(ExpenseTable.month, prevMonth),
                    eq(ExpenseTable.year, prevYear),
                ),
            );

        const prevTotalRevenue = prevRevenues.reduce(
            (sum, r) => sum + r.amount,
            0,
        );
        const prevTotalExpenses = prevExpenses.reduce(
            (sum, e) => sum + e.amount,
            0,
        );

        // Calculate trends
        const revenueTrend = this.calculateTrend(
            totalRevenue,
            prevTotalRevenue,
        );
        const expenseTrend = this.calculateTrend(
            totalExpenses,
            prevTotalExpenses,
        );

        const budgets = JSON.parse(abstract.budgets as string);

        return {
            abstract: { ...abstract, budgets: JSON.parse(abstract.budgets as string) },
            analytics: {
                actual: {
                    revenue: totalRevenue,
                    expenses: totalExpenses,
                    balance: totalRevenue - totalExpenses,
                },
                planned: {
                    revenue: budgets.revenue.planned,
                    expenses: budgets.expenses.reduce(
                        (sum: number, e: any) => sum + e.planned,
                        0,
                    ),
                },
                variance: {
                    revenue: totalRevenue - budgets.revenue.planned,
                    expenses:
                        totalExpenses -
                        budgets.expenses.reduce(
                            (sum: number, e: any) => sum + e.planned,
                            0,
                        ),
                },
                trends: {
                    revenue: revenueTrend,
                    expenses: expenseTrend,
                },
                projections: {
                    revenue: this.calculateProjection(totalRevenue, mount),
                    expenses: this.calculateProjection(totalExpenses, mount),
                },
            },
        };
    }

    private calculateTrend(
        current: number,
        previous: number,
    ): 'up' | 'down' | 'stable' {
        if (previous === 0) return 'stable';
        const threshold = 0.05; // 5%
        const change = (current - previous) / previous;

        if (change > threshold) return 'up';
        if (change < -threshold) return 'down';
        return 'stable';
    }

    private calculateProjection(
        actualAmount: number,
        currentMonth: number,
    ): number {
        if (currentMonth === 0) return 0;
        return (actualAmount / currentMonth) * 12;
    }

    async updateAbstractNotes(
        spreadsheetUid: string,
        abstractUid: string,
        notes: any,
    ) {
        const [updated] = await db
            .update(AbstractsTable)
            .set({
                notes: JSON.stringify(notes),
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(AbstractsTable.uid, abstractUid),
                    eq(AbstractsTable.spreadsheet, spreadsheetUid),
                ),
            )
            .returning();

        return updated;
    }

    async getRecentTransactions(
        spreadsheetUid: string,
        page: number = 1,
        limit: number = 25,
    ) {
        const offset = (page - 1) * limit;

        // Get revenues
        const revenues = await db
            .select({
                uid: RevenueTable.uid,
                amount: RevenueTable.amount,
                description: RevenueTable.description,
                month: RevenueTable.month,
                year: RevenueTable.year,
                date: RevenueTable.date,
                paymentOption: RevenueTable.paymentOption,
                createdAt: RevenueTable.createdAt,
            })
            .from(RevenueTable)
            .where(eq(RevenueTable.spreadsheet, spreadsheetUid))
            .orderBy(RevenueTable.createdAt)
            .limit(limit)
            .offset(offset);

        // Get expenses
        const expenses = await db
            .select({
                uid: ExpenseTable.uid,
                amount: ExpenseTable.amount,
                description: ExpenseTable.description,
                month: ExpenseTable.month,
                year: ExpenseTable.year,
                date: ExpenseTable.date,
                paymentOption: ExpenseTable.paymentOption,
                category: ExpenseTable.category,
                fixed: ExpenseTable.fixed,
                createdAt: ExpenseTable.createdAt,
            })
            .from(ExpenseTable)
            .where(eq(ExpenseTable.spreadsheet, spreadsheetUid))
            .orderBy(ExpenseTable.createdAt)
            .limit(limit)
            .offset(offset);

        // Add type field and combine
        const revenuesWithType = revenues.map((r) => ({
            ...r,
            type: 'revenue' as const,
        }));
        const expensesWithType = expenses.map((e) => ({
            ...e,
            type: 'expense' as const,
        }));

        // Combine and sort by createdAt (most recent first)
        const allTransactions = [...revenuesWithType, ...expensesWithType]
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
            )
            .slice(0, limit);

        return {
            transactions: allTransactions,
            pagination: {
                page,
                limit,
                hasMore: allTransactions.length === limit,
            },
        };
    }
}
