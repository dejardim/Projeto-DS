import { createId } from '@paralleldrive/cuid2';
import { and, eq } from 'drizzle-orm';
import { db } from '../../database/connection';
import { PaymentOptionsTable, RevenueTable } from '../../database/schema';

export interface CreateRevenueData {
    paymentOption?: string;
    month: number;
    year: number;
    date: number;
    amount: number;
    description: string;
}

export interface UpdateRevenueData extends Partial<CreateRevenueData> {}

export class RevenuesService {
    async create(spreadsheetUid: string, data: CreateRevenueData) {
        const uid = createId();

        const [revenue] = await db
            .insert(RevenueTable)
            .values({
                uid,
                spreadsheet: spreadsheetUid,
                paymentOption: data.paymentOption,
                month: data.month,
                year: data.year,
                date: data.date,
                amount: data.amount,
                description: data.description,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            .returning();

        return revenue;
    }

    async getAll(spreadsheetUid: string, month?: number, year?: number) {
        const conditions = [eq(RevenueTable.spreadsheet, spreadsheetUid)];

        if (month && year) {
            conditions.push(eq(RevenueTable.month, month));
            conditions.push(eq(RevenueTable.year, year));
        }

        const revenues = await db
            .select({
                uid: RevenueTable.uid,
                description: RevenueTable.description,
                amount: RevenueTable.amount,
                date: RevenueTable.date,
                month: RevenueTable.month,
                year: RevenueTable.year,
                createdAt: RevenueTable.createdAt,
                paymentOption: {
                    uid: PaymentOptionsTable.uid,
                    name: PaymentOptionsTable.name,
                },
            })
            .from(RevenueTable)
            .leftJoin(
                PaymentOptionsTable,
                eq(RevenueTable.paymentOption, PaymentOptionsTable.uid),
            )
            .where(and(...conditions));

        return revenues;
    }

    async getById(spreadsheetUid: string, revenueUid: string) {
        const [revenue] = await db
            .select()
            .from(RevenueTable)
            .where(
                and(
                    eq(RevenueTable.uid, revenueUid),
                    eq(RevenueTable.spreadsheet, spreadsheetUid),
                ),
            )
            .limit(1);

        return revenue;
    }

    async update(
        spreadsheetUid: string,
        revenueUid: string,
        data: UpdateRevenueData,
    ) {
        const [updated] = await db
            .update(RevenueTable)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(RevenueTable.uid, revenueUid),
                    eq(RevenueTable.spreadsheet, spreadsheetUid),
                ),
            )
            .returning();

        return updated;
    }

    async delete(spreadsheetUid: string, revenueUid: string) {
        const [deleted] = await db
            .update(RevenueTable)
            .set({
                deletedAt: new Date(),
            })
            .where(
                and(
                    eq(RevenueTable.uid, revenueUid),
                    eq(RevenueTable.spreadsheet, spreadsheetUid),
                ),
            )
            .returning();

        return deleted;
    }
}
