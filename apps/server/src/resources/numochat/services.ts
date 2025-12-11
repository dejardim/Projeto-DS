import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { CategoriesService } from '../categories/services';
import { ExpensesService } from '../expenses/services';
import { PaymentOptionsService } from '../payment-options/services';
import { RevenuesService } from '../revenues/services';

const categoriesService = new CategoriesService();
const paymentOptionsService = new PaymentOptionsService();
const expensesService = new ExpensesService();
const revenuesService = new RevenuesService();

export interface NumoChatRequest {
    command: string;
}

export interface NumoChatTransactionData {
    type: 'revenue' | 'expense';
    description: string;
    amount: number;
    category?: string;
    categoryName?: string;
    paymentOption?: string;
    paymentOptionName?: string;
    month: number;
    year: number;
    date: number;
    fixed?: boolean;
}

export interface NumoChatResponse {
    success: boolean;
    message: string;
    data?: NumoChatTransactionData;
}

// Zod schema para parsing estruturado da OpenAI
const TransactionSchema = z.object({
    type: z
        .enum(['revenue', 'expense'])
        .describe(
            'Tipo da transacao: revenue para receitas, expense para despesas/gastos',
        ),
    description: z.string().describe('Descricao da transacao'),
    amount: z.number().describe('Valor em centavos (ex: 50 reais = 5000)'),
    categoryUid: z
        .string()
        .nullable()
        .describe(
            'UID da categoria (apenas para despesas, null se nao informado ou se for receita)',
        ),
    paymentOptionUid: z
        .string()
        .nullable()
        .describe('UID da opcao de pagamento (null se nao informado)'),
    month: z.number().min(1).max(12).describe('Mes da transacao (1-12)'),
    year: z.number().describe('Ano da transacao'),
    date: z.number().min(1).max(31).describe('Dia do mes da transacao (1-31)'),
    fixed: z
        .boolean()
        .describe(
            'Se e uma despesa fixa (apenas para despesas, false por padrao)',
        ),
});

export class NumoChatService {
    private openai: OpenAI | null = null;

    private getOpenAIClient(): OpenAI {
        if (!this.openai) {
            const apiKey = process.env.OPENAI_API_KEY;
            if (!apiKey) {
                throw new Error('OPENAI_API_KEY nao configurada');
            }
            this.openai = new OpenAI({
                apiKey,
                timeout: 60000,
            });
        }
        return this.openai;
    }

    async processCommand(
        spreadsheetUid: string,
        request: NumoChatRequest,
    ): Promise<NumoChatResponse> {
        const { command } = request;

        if (!command || command.trim().length === 0) {
            return {
                success: false,
                message:
                    'Comando vazio. Por favor, digite o que deseja adicionar.',
            };
        }

        try {
            // Buscar categorias e payment options do usuario
            const [categories, paymentOptions] = await Promise.all([
                categoriesService.getAll(spreadsheetUid),
                paymentOptionsService.getAll(spreadsheetUid),
            ]);

            // Formatar opcoes para o prompt
            const categoriesInfo = categories.map((c) => ({
                uid: c.uid,
                name: c.name,
            }));
            const paymentOptionsInfo = paymentOptions.map((p) => ({
                uid: p.uid,
                name: p.name,
            }));

            // Parsear comando com OpenAI
            const parsed = await this.parseCommandWithOpenAI(
                command,
                categoriesInfo,
                paymentOptionsInfo,
            );

            // Criar transacao no banco
            if (parsed.type === 'expense') {
                await expensesService.create(spreadsheetUid, {
                    description: parsed.description,
                    amount: parsed.amount,
                    month: parsed.month,
                    year: parsed.year,
                    date: parsed.date,
                    fixed: parsed.fixed,
                    category: parsed.categoryUid || undefined,
                    paymentOption: parsed.paymentOptionUid || undefined,
                });
            } else {
                await revenuesService.create(spreadsheetUid, {
                    description: parsed.description,
                    amount: parsed.amount,
                    month: parsed.month,
                    year: parsed.year,
                    date: parsed.date,
                    paymentOption: parsed.paymentOptionUid || undefined,
                });
            }

            // Buscar nomes para exibicao
            const categoryName = parsed.categoryUid
                ? categories.find((c) => c.uid === parsed.categoryUid)?.name
                : undefined;
            const paymentOptionName = parsed.paymentOptionUid
                ? paymentOptions.find((p) => p.uid === parsed.paymentOptionUid)
                      ?.name
                : undefined;

            const typeLabel = parsed.type === 'revenue' ? 'Receita' : 'Despesa';

            return {
                success: true,
                message: `${typeLabel} adicionada com sucesso!`,
                data: {
                    type: parsed.type,
                    description: parsed.description,
                    amount: parsed.amount,
                    category: parsed.categoryUid || undefined,
                    categoryName,
                    paymentOption: parsed.paymentOptionUid || undefined,
                    paymentOptionName,
                    month: parsed.month,
                    year: parsed.year,
                    date: parsed.date,
                    fixed: parsed.fixed,
                },
            };
        } catch (error) {
            console.error('Erro ao processar comando NumoChat:', error);
            const errorMessage =
                error instanceof Error ? error.message : 'Erro desconhecido';
            return {
                success: false,
                message: `Nao foi possivel processar o comando: ${errorMessage}. Tente algo como: "adiciona despesa de 100 reais em transporte"`,
            };
        }
    }

    private async parseCommandWithOpenAI(
        command: string,
        categories: { uid: string; name: string }[],
        paymentOptions: { uid: string; name: string }[],
    ): Promise<z.infer<typeof TransactionSchema>> {
        const client = this.getOpenAIClient();

        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        const currentDate = now.getDate();

        const systemPrompt = `Voce e um assistente que interpreta comandos em linguagem natural para adicionar transacoes financeiras.

Sua tarefa e extrair informacoes do comando do usuario e retornar um JSON estruturado.

REGRAS IMPORTANTES:
1. Se o usuario menciona "gasto", "gastei", "paguei", "comprei", "despesa" -> type = "expense"
2. Se o usuario menciona "recebi", "ganhei", "receita", "salario", "pagamento recebido" -> type = "revenue"
3. Converta valores para centavos (50 reais = 5000, 10.50 = 1050)
4. Se nao especificado, use a data atual: mes ${currentMonth}, ano ${currentYear}, dia ${currentDate}
5. Para despesas fixas (aluguel, assinatura, mensalidade), marque fixed = true
6. Tente associar a categoria ou forma de pagamento mais apropriada baseado no contexto

CATEGORIAS DISPONIVEIS (use o uid correspondente):
${categories.length > 0 ? categories.map((c) => `- "${c.name}" (uid: ${c.uid})`).join('\n') : 'Nenhuma categoria cadastrada'}

FORMAS DE PAGAMENTO DISPONIVEIS (use o uid correspondente):
${paymentOptions.length > 0 ? paymentOptions.map((p) => `- "${p.name}" (uid: ${p.uid})`).join('\n') : 'Nenhuma forma de pagamento cadastrada'}

Se o usuario mencionar uma categoria ou forma de pagamento que nao existe na lista, use null.
Se o usuario nao mencionar categoria ou forma de pagamento, tente inferir do contexto ou use null.`;

        const response = await client.responses.parse({
            model: 'gpt-4o-mini',
            input: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: command },
            ],
            text: {
                format: zodTextFormat(TransactionSchema, 'transaction'),
            },
            temperature: 0.3,
        });

        const parsed = response.output_parsed;
        if (!parsed) {
            throw new Error('Nao foi possivel interpretar o comando');
        }

        return parsed;
    }
}
