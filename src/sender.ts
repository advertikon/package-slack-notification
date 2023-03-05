import fetch from 'node-fetch';
import { Config, Message } from './types.js';

export class SlackSender {
    constructor(private readonly config: Config) {
        if (!this.config.packageName) {
            throw new Error('Package name required');
        }
    }

    private static async send(url: string, message: Message) {
        return fetch(url, {
            method: 'post',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(message),
        });
    }

    async error(message: string | Error) {
        if (!this.config.errorWebhook) {
            throw new Error('Webhook URL is not configured');
        }

        const messageText = message instanceof Error ? message.message : message;

        const payload: Message = {
            text: `${this.config.packageName}. Error: ${messageText}`,
            blocks: [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: `${this.config.packageName} :radioactive_sign:`,
                        emoji: true,
                    },
                },
                {
                    type: 'section',
                    text: {
                        type: 'plain_text',
                        text: message instanceof Error ? message.stack : `Error: ${message}`,
                    },
                },
            ],
        };

        return SlackSender.send(this.config.errorWebhook, payload);
    }
}
