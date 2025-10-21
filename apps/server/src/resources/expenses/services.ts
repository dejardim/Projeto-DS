import { createId } from '@paralleldrive/cuid2';
import { and, eq } from 'drizzle-orm';
import { db } from '../../database/connection';
import { ExpenseCategoryTable, ExpenseTable, PaymentOptionsTable } from '../../database/schema';

export interface CreateExpenseData {
    category?: string;
    paymentOption?: string;
    month: number;
    year: number;
    date: number;
    fixed: boolean;
    amount: number;
    description: string;
    metadata?: Record<string, any>;
}

export interface UpdateExpenseData extends Partial<CreateExpenseData> {}

export class ExpensesService {
    async create(spreadsheetUid: string, data: CreateExpenseData) {
        const uid = createId();

        const [expense] = await db
            .insert(ExpenseTable)
            .values({
                uid,
                spreadsheet: spreadsheetUid,
                category: data.category,
                paymentOption: data.paymentOption,
                month: data.month,
                year: data.year,
                date: data.date,
                fixed: data.fixed,
                amount: data.amount,
                description: data.description,
                metadata: JSON.stringify(data.metadata || {}),
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            .returning();

        return expense;
    }

    async getAll(
        spreadsheetUid: string,
        month?: number,
        year?: number,
        category?: string,
    ) {
        const conditions = [eq(ExpenseTable.spreadsheet, spreadsheetUid)];

        if (month && year) {
            conditions.push(eq(ExpenseTable.month, month));
            conditions.push(eq(ExpenseTable.year, year));
        }

        if (category) {
            conditions.push(eq(ExpenseTable.category, category));
        }

        const expenses = await db
            .select({
                uid: ExpenseTable.uid,
                description: ExpenseTable.description,
                amount: ExpenseTable.amount,
                date: ExpenseTable.date,
                month: ExpenseTable.month,
                year: ExpenseTable.year,
                fixed: ExpenseTable.fixed,
                createdAt: ExpenseTable.createdAt,
                category: {
                    uid: ExpenseCategoryTable.uid,
                    name: ExpenseCategoryTable.name,
                },
                paymentOption: {
                    uid: PaymentOptionsTable.uid,
                    name: PaymentOptionsTable.name,
                }
            })
            .from(ExpenseTable)
            .leftJoin(ExpenseCategoryTable, eq(ExpenseTable.category, ExpenseCategoryTable.uid))
            .leftJoin(PaymentOptionsTable, eq(ExpenseTable.paymentOption, PaymentOptionsTable.uid))
            .where(and(...conditions));

        return expenses;
    }

    async getById(spreadsheetUid: string, expenseUid: string) {
        const [expense] = await db
            .select()
            .from(ExpenseTable)
            .where(
                and(
                    eq(ExpenseTable.uid, expenseUid),
                    eq(ExpenseTable.spreadsheet, spreadsheetUid),
                ),
            )
            .limit(1);

        return expense;
    }

    async update(
        spreadsheetUid: string,
        expenseUid: string,
        data: UpdateExpenseData,
    ) {
        const updateData: any = { ...data, updatedAt: new Date() };

        if (data.metadata) {
            updateData.metadata = JSON.stringify(data.metadata);
        }

        const [updated] = await db
            .update(ExpenseTable)
            .set(updateData)
            .where(
                and(
                    eq(ExpenseTable.uid, expenseUid),
                    eq(ExpenseTable.spreadsheet, spreadsheetUid),
                ),
            )
            .returning();

        return updated;
    }

    async delete(spreadsheetUid: string, expenseUid: string) {
        const [deleted] = await db
            .update(ExpenseTable)
            .set({
                deletedAt: new Date(),
            })
            .where(
                and(
                    eq(ExpenseTable.uid, expenseUid),
                    eq(ExpenseTable.spreadsheet, spreadsheetUid),
                ),
            )
            .returning();

        return deleted;
    }

    async getByCategory(
        spreadsheetUid: string,
        category: string,
        month?: number,
        year?: number,
    ) {
        const conditions = [
            eq(ExpenseTable.spreadsheet, spreadsheetUid),
            eq(ExpenseTable.category, category),
        ];

        if (month && year) {
            conditions.push(eq(ExpenseTable.month, month));
            conditions.push(eq(ExpenseTable.year, year));
        }

        const expenses = await db
            .select()
            .from(ExpenseTable)
            .where(and(...conditions));

        return expenses;
    }
}
