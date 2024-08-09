import type { IMessageBase } from './workerMessage.type';

export interface IInitMessage extends IMessageBase {
    action: 'init';
    data: {
        steamPath: string;
        isHardened: boolean;
    };
}
