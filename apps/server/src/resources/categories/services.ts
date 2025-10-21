import { createId } from '@paralleldrive/cuid2';
import { and, eq } from 'drizzle-orm';
import { db } from '../../database/connection';
import { ExpenseCategoryTable } from '../../database/schema';

export interface CreateCategoryData {
    name: string;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {}

export class CategoriesService {
    async create(spreadsheetUid: string, data: CreateCategoryData) {
        const uid = createId();

        const [category] = await db
            .insert(ExpenseCategoryTable)
            .values({
                uid,
                spreadsheet: spreadsheetUid,
                name: data.name,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            .returning();

        return category;
    }

    async getAll(spreadsheetUid: string) {
        const categories = await db
            .select()
            .from(ExpenseCategoryTable)
            .where(eq(ExpenseCategoryTable.spreadsheet, spreadsheetUid));

        return categories;
    }

    async getById(spreadsheetUid: string, categoryUid: string) {
        const [category] = await db
            .select()
            .from(ExpenseCategoryTable)
            .where(
                and(
                    eq(ExpenseCategoryTable.uid, categoryUid),
                    eq(ExpenseCategoryTable.spreadsheet, spreadsheetUid),
                ),
            )
            .limit(1);

        return category;
    }

    async update(
        spreadsheetUid: string,
        categoryUid: string,
        data: UpdateCategoryData,
    ) {
        const [updated] = await db
            .update(ExpenseCategoryTable)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(ExpenseCategoryTable.uid, categoryUid),
                    eq(ExpenseCategoryTable.spreadsheet, spreadsheetUid),
                ),
            )
            .returning();

        return updated;
    }

    async delete(spreadsheetUid: string, categoryUid: string) {
        const [deleted] = await db
            .update(ExpenseCategoryTable)
            .set({
                deletedAt: new Date(),
            })
            .where(
                and(
                    eq(ExpenseCategoryTable.uid, categoryUid),
                    eq(ExpenseCategoryTable.spreadsheet, spreadsheetUid),
                ),
            )
            .returning();

        return deleted;
    }
}
