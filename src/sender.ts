import fetch from 'node-fetch';
import { Message } from './types.js';

export class SlackSender {
    constructor(private readonly packageName: string, private readonly errorWebhook: string) {}

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
        const messageText = message instanceof Error ? message.message : message;

        const payload: Message = {
            text: `${this.packageName}. Error: ${messageText}`,
            blocks: [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: `${this.packageName} :radioactive_sign:`,
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

        return SlackSender.send(this.errorWebhook, payload);
    }
}
