import { eq, and } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { db } from '../../database/connection';
import { PaymentOptionsTable } from '../../database/schema';

export interface CreatePaymentOptionData {
  name: string;
}

export interface UpdatePaymentOptionData extends Partial<CreatePaymentOptionData> {}

export class PaymentOptionsService {
  async create(spreadsheetUid: string, data: CreatePaymentOptionData) {
    const uid = createId();
    
    const [paymentOption] = await db.insert(PaymentOptionsTable).values({
      uid,
      spreadsheet: spreadsheetUid,
      name: data.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    return paymentOption;
  }

  async getAll(spreadsheetUid: string) {
    const paymentOptions = await db
      .select()
      .from(PaymentOptionsTable)
      .where(eq(PaymentOptionsTable.spreadsheet, spreadsheetUid));

    return paymentOptions;
  }

  async getById(spreadsheetUid: string, paymentOptionUid: string) {
    const [paymentOption] = await db
      .select()
      .from(PaymentOptionsTable)
      .where(
        and(
          eq(PaymentOptionsTable.uid, paymentOptionUid),
          eq(PaymentOptionsTable.spreadsheet, spreadsheetUid)
        )
      )
      .limit(1);

    return paymentOption;
  }

  async update(spreadsheetUid: string, paymentOptionUid: string, data: UpdatePaymentOptionData) {
    const [updated] = await db
      .update(PaymentOptionsTable)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(
        and(
          eq(PaymentOptionsTable.uid, paymentOptionUid),
          eq(PaymentOptionsTable.spreadsheet, spreadsheetUid)
        )
      )
      .returning();

    return updated;
  }

  async delete(spreadsheetUid: string, paymentOptionUid: string) {
    const [deleted] = await db
      .update(PaymentOptionsTable)
      .set({
        deletedAt: new Date()
      })
      .where(
        and(
          eq(PaymentOptionsTable.uid, paymentOptionUid),
          eq(PaymentOptionsTable.spreadsheet, spreadsheetUid)
        )
      )
      .returning();

    return deleted;
  }
}
