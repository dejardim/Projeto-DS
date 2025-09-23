import { ENV } from '@config/env';
import { CustomError } from '@utils/custom-error';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: ENV.OPENAI_AI_KEY });

interface CompletionsPayload {
    message: string;
}

export async function completions({ message }: CompletionsPayload) {
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: message },
            ],
            model: 'gpt-4.1-mini',
            temperature: 0.3,
        });
    } catch (error) {
        if (error instanceof Error) {
            throw new CustomError(error.message, 500);
        }
        console.log(error);
        throw new CustomError('An unknown error occurred', 500);
    }
}
