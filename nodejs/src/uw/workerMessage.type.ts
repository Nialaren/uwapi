import { ConnectionState, GameState, MapState } from './helpers';
import type {
    IUWLogData,
    IUwMyPlayer,
    IUwShootingArray,
} from './types';
import { IUWApi } from './uwApi.type';

export interface IMessageBase {
    action: string;
    data: unknown;
}

export interface ITestMessage extends IMessageBase {
    action: 'test';
    data: {
        log: string;
    };
}

export interface IUwApiCall extends IMessageBase {
    action: 'uwApi',
    data: {
        name: keyof IUWApi | 'uwRemoveCallback';
        parameters: unknown[];
    }
}


export type UwParentMessage =
    | IUwApiCall
    | ITestMessage;


export interface ILogCallbackMessage extends IMessageBase {
    action: 'uwSetLogCallback',
    data: [IUWLogData],
}
export interface IExceptionCallbackMessage extends IMessageBase {
    action: 'uwSetExceptionCallback',
    data: [string],
}

export interface IConnectionStateCallbackMessage extends IMessageBase {
    action: 'uwSetConnectionStateCallback',
    data: [ConnectionState],
}
export interface IGameStateCallbackMessage extends IMessageBase {
    action: 'uwSetGameStateCallback',
    data: [GameState],
}
export interface IUpdateCallbackMessage extends IMessageBase {
    action: 'uwSetUpdateCallback',
    data: [number, boolean],
}
export interface IMapStateCallbackMessage extends IMessageBase {
    action: 'uwSetMapStateCallback',
    data: [MapState],
}
export interface IShootingCallbackMessage extends IMessageBase {
    action: 'uwSetShootingCallback',
    data: [IUwShootingArray],
}


export interface IUwConnectFindLanMessage extends IMessageBase {
    action: 'uwConnectFindLan',
    data: [boolean],
}

export interface IUwTryReconnectMessage extends IMessageBase {
    action: 'uwTryReconnect',
    data: [boolean],
}

export interface IUwMyPlayerMessage extends IMessageBase {
    action: 'uwMyPlayer',
    data: [IUwMyPlayer],
}

export interface IUwModifiedEntititesMessage extends IMessageBase {
    action: 'uwModifiedEntities',
    data: [number[]],
}

export type UwWorkerMessage =
    // Callbacks
    | ILogCallbackMessage
    | IExceptionCallbackMessage
    | IConnectionStateCallbackMessage
    | IGameStateCallbackMessage
    | IUpdateCallbackMessage
    | IMapStateCallbackMessage
    | IShootingCallbackMessage

    // Messages with return
    | IUwTryReconnectMessage
    | IUwMyPlayerMessage
    | IUwModifiedEntititesMessage
    | IUwConnectFindLanMessage;
