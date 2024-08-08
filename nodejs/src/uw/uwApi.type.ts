import { ConnectionState, MapState, Priority, Severity } from './helpers';
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
    IUwOrder,
    IUwProtoGeneric,
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
    uwMyPlayer: () => Promise<IUwMyPlayer>;

    // entities
    uwModifiedEntities: ()  => Promise<number[]>;

    uwConnectionState: () => Promise<ConnectionState>;

    uwMapState: () => Promise<MapState>;

    // COMMANDS AND ORDERS
    uwOrders: (unit: number) => Promise<IUwOrder[]>;
    uwOrder: (unit: number, order: IUwOrder) => Promise<void>;
    uwCommandSelfDestruct: (unit: number) => Promise<void>;
    uwCommandPlaceConstruction: (proto: number, position: number, yaw: number) => Promise<void>;
    uwCommandSetRecipe: (unit: number, recipe: number) => Promise<void>;
    uwCommandLoad: (unit: number, resourceType: number) => Promise<void>;
    uwCommandUnload: (unit: number) => Promise<void>;
    uwCommandMove: (unit: number, position: number, yaw: number) => Promise<void>;
    uwCommandAim: (unit: number, target: number) => Promise<void>;
    uwCommandRenounceControl: (unit: number) => Promise<void>;
    uwCommandSetPriority: (unit: number, priority: Priority) => Promise<void>;

    // PROTOTYPES SHIT
    uwAllPrototypes: () => Promise<IUwProtoGeneric[]>;
    uwDefinitionsJson: () => Promise<string>;

    cleanup: () => Promise<void>;

    _proto?: any,
    _struct?: any,
}
