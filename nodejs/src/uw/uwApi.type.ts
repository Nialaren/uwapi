import { IEntity } from './entity.type';
import { ConnectionState, MapState, OverviewFlags, Priority, Severity } from './helpers';
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
    IUwMapInfo,
    IUwTile,
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

    // MAP SHIT
    uwOverviewIds: (position: number) => Promise<number[]>;
    uwAreaRange: (x: number, y: number, z: number, radius: number) => Promise<number[]>;
    uwAreaConnected: (position: number, radius: number) => Promise<number[]>;
    uwAreaNeighborhood: (position: number, radius: number) => Promise<number[]>;
    uwAreaExtended: (position: number, radius: number) => Promise<number[]>;
    uwTestVisible: (x: number, y: number, z: number, x2: number, y2: number, z2: number) => Promise<boolean>;

    // tests
    uwTestShooting: (
        shooterPosition: number,
        shooterProto: number,
        targetPosition: number,
        targetProto: number,
    ) => Promise<boolean>;

    uwDistanceEstimate: (a: number, b: number) => Promise<number>;
    uwYaw: (position: number, towards: number) => Promise<number>;
    uwTestConstructionPlacement: (constructionPrototype: number, position: number) => Promise<boolean>;
    uwFindConstructionPlacement: (constructionPrototype: number, position: number) => Promise<number>;
    // Map INFO
    uwMapInfo: () => Promise<IUwMapInfo>;
    uwTilesCount: () => Promise<number>;
    uwTile: (index: number) => Promise<IUwTile>;

    // Map updating
    uwOverviewExtract: () => Promise<OverviewFlags[]>;

    // WORLD FUNS
    uwAllEntities: () => Promise<number[]>;
    uwModifiedEntities: () => Promise<number[]>;
    uwModifiedEntitiesResolved: () => Promise<IEntity[]>;

    // COMPONENT FUN

    cleanup: () => Promise<void>;

    _proto?: number,
}
