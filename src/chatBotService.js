import client from 'twilio';
import { OpenAIClient } from './config/openaiClient.js';

export class ChatBotService {
    constructor(apiKey) {
        this.openaiClient = new OpenAIClient(apiKey);
    }

    async sendMessage(messages) {
        try {
            const body = {
                model: 'gpt-3.5-turbo',
                messages: messages,
                max_tokens: 50,
                temperature: 0.7,
            };
            const response = await this.openaiClient.sendMessage(body);
            // Ajusta esto según la estructura de respuesta de tu OpenAIClient

            return response || 'Sin respuesta';
        } catch (error) {
            console.error('Error al comunicarse con OpenAI:', error);
            throw new Error('No se pudo obtener respuesta del chatbot.');
        }
    }

    async twilioPostMessage(message) {
        try {
            const twilio = client(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
            const msg = await twilio.messages.create({
                from: process.env.TWILIO_SANDBOX_NUMBER,
                to: process.env.MY_WHATSAPP,
                body: message,
            });
            return msg.sid;
        } catch (err) {
            console.error('Error enviando WhatsApp:', err);
            throw err;
        }
    }
}