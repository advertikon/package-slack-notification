import { ErrorCode, WebClient, LogLevel } from '@slack/web-api';
import { WebClientOptions } from '@slack/web-api/dist/WebClient.js';

type Config = {
    token: string;
    channel: string;
    logger?: {
        error: (...message: any[]) => void;
    };
    debug?: boolean;
};

export class SlackClient {
    #config: Config = {
        token: '',
        channel: '',
        logger: {
            error: (...message) => console.error(message), // eslint-disable-line no-console
        },
        debug: false,
    };

    #web;

    constructor(config: Config) {
        this.#config = { ...this.#config, ...config };
        const settings = {} as WebClientOptions;

        if (!config.token) {
            throw new Error('Token required');
        }

        if (!config.channel) {
            throw new Error('Channel required');
        }

        if (config.debug) {
            settings.logLevel = LogLevel.DEBUG;
        }

        this.#web = new WebClient(config.token, settings);
    }

    async #postMessage(content: { text?: string; blocks? }) {
        try {
            await this.#web.chat.postMessage({
                ...content,
                channel: this.#config.channel,
            });
        } catch (error) {
            switch (error.code) {
                case ErrorCode.PlatformError:
                    this.#config.logger.error(error.data);
                    break;
                case ErrorCode.RequestError:
                    this.#config.logger.error(error.original);
                    break;
                case ErrorCode.HTTPError:
                    this.#config.logger.error(error);
                    break;
                case ErrorCode.RateLimitedError:
                    this.#config.logger.error(error);
                    break;
                default:
                    this.#config.logger.error(error);
            }
        }
    }

    async message(header: string, text: string) {
        if (arguments.length === 1) {
            text = header;
            header = '';
        }

        const content = { blocks: [], text };

        if (header) {
            content.blocks.push({
                type: 'header',
                text: {
                    type: 'plain_text',
                    text: header,
                    emoji: true,
                },
            });

            content.blocks.push({
                type: 'divider',
            });
        }

        content.blocks.push({
            type: 'section',
            text: {
                type: 'mrkdwn',
                text,
            },
        });

        await this.#postMessage(content);
    }
}
