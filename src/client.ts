import { ErrorCode, WebClient, LogLevel } from '@slack/web-api';

type Config = {
    token: string;
    channel: string;
    logger?: {
        error: (...message: any[]) => void;
    };
};

export class SlackClient {
    #config: Config = {
        token: '',
        channel: '',
        logger: {
            error: (...message) => console.error(message), // eslint-disable-line no-console
        },
    };

    #web;

    constructor(config: Config) {
        this.#config = { ...this.#config, ...config };

        if (!config.token) {
            throw new Error('Token required');
        }

        if (!config.channel) {
            throw new Error('Channel required');
        }

        this.#web = new WebClient(config.token, { logLevel: LogLevel.DEBUG });
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

        const content = { blocks: [] };

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
