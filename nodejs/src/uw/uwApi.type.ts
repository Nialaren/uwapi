import { Severity } from './helpers';
import type {
    UwLogCallbackType,
    UnregisterUwCallback,
    UwExceptionCallbackType,
    UwConnectionCallbackType,
    UwGameStateCallbackType,
    UwUpdateCallbackType,
    UwShootingCallbackType,
    UwMapStateCallbackType,
    IUwMyPlayer,
} from './types';

export interface IUWApi {
    UW_VERSION: number;
    uwInitialize: (version: number) => Promise<void>;
    uwDeinitialize: () => Promise<void>;
    uwSetLogCallback: (callback: UwLogCallbackType)  => UnregisterUwCallback;
    uwSetExceptionCallback: (callback: UwExceptionCallbackType)  => UnregisterUwCallback;
    uwLog: (severity: Severity, message: string) => Promise<void>;

    uwSetPlayerName: (name: string) => Promise<void>;
    uwSetPlayerColor: (r: number, g: number, b: number) => Promise<void>;
    uwSetConnectStartGui: (start?: boolean, extra?: string) => Promise<void>;
    uwSetConnectAsObserver: (observer: boolean) => Promise<void>;

    uwConnectFindLan: (timeoutMicroseconds?: number) => Promise<boolean>;
    uwConnectDirect: (address: string, port: number) => Promise<void>;
    uwConnectLobbyId: (lobbyId: number) => Promise<void>;
    uwConnectNewServer: (visibility?: number, name?: string, extraParams?: string) => Promise<void>;
    uwTryReconnect: () => Promise<boolean>;
    uwDisconnect: () => Promise<void>;

    // Game state & callbacks
    uwSetConnectionStateCallback: (callback: UwConnectionCallbackType)  => UnregisterUwCallback;
    uwSetGameStateCallback: (callback: UwGameStateCallbackType)  => UnregisterUwCallback;
    uwSetUpdateCallback: (callback: UwUpdateCallbackType)  => UnregisterUwCallback;
    uwSetMapStateCallback: (callback: UwMapStateCallbackType)  => UnregisterUwCallback;
    uwSetShootingCallback: (callback: UwShootingCallbackType)  => UnregisterUwCallback;
    // my player
    uwMyPlayer: () => Promise<IUwMyPlayer | null>;

    // entities
    uwModifiedEntities: ()  => Promise<number[]>;

    cleanup: () => Promise<void>;

    _proto?: any,
    _struct?: any,
}
