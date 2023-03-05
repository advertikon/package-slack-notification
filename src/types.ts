export type Message = {
    text?: string;
    blocks?: (HeaderBlock | SectionBlock)[];
};

type HeaderBlock = {
    type: 'header';
    text: TextField;
};

type SectionBlock = {
    type: 'section';
    fields?: TextField[];
    text?: TextField;
};

type TextField = {
    type: TextType;
    text: string;
    emoji?: boolean;
};

type TextType = 'plain_text' | 'mrkdwn';

export type Config = {
    packageName: string;
    errorWebhook?: string;
};
