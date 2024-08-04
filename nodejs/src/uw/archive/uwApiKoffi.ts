import * as koffi from 'koffi';
import type {
    IUwIdsStruct,
    IUwMyPlayer,
    UnregisterUwCallback,

    UwConnectionCallbackType,
    UwGameStateCallbackType,
    UwLogCallbackType,
    UwShootingCallbackType,
    UwUpdateCallbackType,
} from '../types';
import { getLibName } from '../helpers';

function createRegisterFn<C extends (...args: any) => void>(fnType: koffi.IKoffiCType, targetFn: koffi.KoffiFunction) {
    return (callback: C): UnregisterUwCallback => {
        const callbackHandle = koffi.register(
            callback,
            koffi.pointer(fnType),
        );
        targetFn(callbackHandle);
        return () => {
            koffi.unregister(callbackHandle);
        }
    };
}


function createUWApiKoffi(steamPath: string, isHardened = false) {
    // COMMON
    const UwIdsStruct = koffi.struct('UwIds', {
        // ids: 'uint32 *',
        ids: 'uint32 *',
        count: 'uint32',
    });

    // structs
    const UwLogCallbackStruct = koffi.struct('UwLogCallback', {
        message: 'str',
        component: 'str',
        severity: 'int',
    });

    const UwShootingUnitStruct = koffi.struct('UwShootingUnit', {
        position: 'uint32',
        force: 'uint32',
        prototype: 'uint32',
        id: 'uint32',
    });

    const UwShootingDataStruct = koffi.struct('UwShootingData', {
        shooter: UwShootingUnitStruct,
        target: UwShootingUnitStruct,
    });

    const UwShootingArrayStruct = koffi.struct('UwShootingArray', {
        data: koffi.pointer(UwShootingDataStruct),
        count: 'uint32',
    });

    // define prototypes
    const UwLogCallbackTypeProto = koffi.proto('UwLogCallbackType', 'void', ['const UwLogCallback *']);
    const UwExceptionCallbackTypeProto = koffi.proto('UwExceptionCallbackType', 'void', ['const char *']);
    const UwUpdateCallbackTypeProto = koffi.proto('UwUpdateCallbackType', 'void', ['uint32', 'bool']);
    const UwConnectionStateCallbackTypeProto = koffi.proto('UwConnectionStateCallbackType', 'void', ['uint32']);
    const UwGameStateCallbackTypeProto = koffi.proto('UwGameStateCallbackType', 'void', ['int']);
    const UwMapStateCallbackTypeProto = koffi.proto('UwMapStateCallbackType', 'void', ['int']);

    const UwShootingCallbackTypeProto = koffi.proto('UwShootingCallbackType', 'void', ['const UwShootingArray *']);

    const uwLib = koffi.load(`${steamPath}/${getLibName(isHardened)}`);

    const uwInitialize = uwLib.func('uwInitialize', 'void', ['uint32']);
    const uwDeinitialize = uwLib.func('void uwDeinitialize()');

    // register callbacks functions
    const _uwSetExceptionCallback = uwLib.func('uwSetExceptionCallback', 'void', [koffi.pointer(UwExceptionCallbackTypeProto)] );
    const _uwSetLogCallback = uwLib.func('uwSetLogCallback', 'void', [koffi.pointer(UwLogCallbackTypeProto)]);

    // other fns
    const uwLog = uwLib.func('uwLog', 'void', ['int', 'str']);
    const uwSetPlayerName = uwLib.func('uwSetPlayerName', 'void', ['str']);
    const uwSetPlayerColor = uwLib.func('uwSetPlayerColor', 'void', ['float', 'float', 'float']);
    const uwSetConnectStartGui = uwLib.func('void uwSetConnectStartGui(bool enabled, const char *extraCmdParams)');
    const uwSetConnectAsObserver = uwLib.func('uwSetConnectAsObserver', 'void', ['bool']);

    const uwConnectFindLan = uwLib.func('uwConnectFindLan', 'bool', ['uint64']);
    const uwConnectDirect = uwLib.func('uwConnectDirect', 'void', ['str', 'uint16']);
    const uwConnectLobbyId = uwLib.func('uwConnectLobbyId', 'void', ['uint64']);
    const uwConnectNewServer = uwLib.func('uwConnectNewServer', 'void', ['uint32', 'char *', 'char *']);
    const uwTryReconnect = uwLib.func('bool uwTryReconnect(void)');
    const uwDisconnect = uwLib.func('uwDisconnect', 'void', []);

    // Game state callbacks
    const _uwSetUpdateCallback = uwLib.func('uwSetUpdateCallback', 'void', [koffi.pointer(UwUpdateCallbackTypeProto)]);
    const _uwSetConnectionStateCallback = uwLib.func('uwSetConnectionStateCallback', 'void', [koffi.pointer(UwConnectionStateCallbackTypeProto)]);
    const _uwSetGameStateCallback = uwLib.func('uwSetGameStateCallback', 'void', [koffi.pointer(UwGameStateCallbackTypeProto)]);
    const _uwSetMapStateCallback = uwLib.func('uwSetMapStateCallback', 'void', [koffi.pointer(UwMapStateCallbackTypeProto)]);
    const _uwSetShootingCallback = uwLib.func('uwSetShootingCallback', 'void', [koffi.pointer(UwShootingCallbackTypeProto)]);

    // Player
    const UwMyPlayerStruct = koffi.struct('UwMyPlayer', {
        playerEntityId: 'uint32',
        forceEntityId: 'uint32',
        primaryController: 'bool',
        admin: 'bool',
    });

    const _uwMyPlayer = uwLib.func('uwMyPlayer', 'bool', ['_Out_ UwMyPlayer *']);

    // Entities

    const _uwModifiedEntities = uwLib.func('uwModifiedEntities', 'void', ['_Out_ UwIds *'])

    // Constructions

    // Orders


    return {
        UW_VERSION: 21,
        uwInitialize,
        uwDeinitialize,
        uwSetLogcallback: (callback: UwLogCallbackType) => {
            return createRegisterFn(UwLogCallbackTypeProto, _uwSetLogCallback)((codedData: typeof UwLogCallbackStruct) => {
                callback(koffi.decode(codedData, UwLogCallbackStruct));
            });
        },
        uwSetExceptionCallback: createRegisterFn(UwExceptionCallbackTypeProto, _uwSetExceptionCallback),


        uwLog,

        uwSetPlayerName,
        uwSetPlayerColor,
        uwSetConnectStartGui: (start = true, extra = '') => {
            uwSetConnectStartGui(start, extra);
        },
        uwSetConnectAsObserver,

        uwConnectFindLan: (timeoutMicroseconds = 3_000_000): boolean => {
            return uwConnectFindLan(timeoutMicroseconds);
        },
        uwConnectDirect,
        uwConnectLobbyId,
        uwConnectNewServer: (visibility = 0, name = '', extraParams = '') => {
            uwConnectNewServer(visibility, name, extraParams);
        },
        uwTryReconnect,
        uwDisconnect,


        // Game state & callbacks
        uwSetConnectionStateCallback: createRegisterFn<UwConnectionCallbackType>(UwConnectionStateCallbackTypeProto, _uwSetConnectionStateCallback),
        uwSetGameStateCallback: createRegisterFn<UwGameStateCallbackType>(UwGameStateCallbackTypeProto, _uwSetGameStateCallback),
        uwSetUpdateCallback: createRegisterFn<UwUpdateCallbackType>(UwUpdateCallbackTypeProto, _uwSetUpdateCallback),
        uwSetMapStateCallback: createRegisterFn<UwUpdateCallbackType>(UwMapStateCallbackTypeProto, _uwSetMapStateCallback),
        uwSetShootingCallback: (callback: UwShootingCallbackType) => {
            // TODO: verify it works
            return createRegisterFn(UwShootingCallbackTypeProto, _uwSetShootingCallback)((codedData: typeof UwShootingArrayStruct) => {
                callback(koffi.decode(codedData, UwShootingArrayStruct));
            });
        },

        // my player
        uwMyPlayer: (): IUwMyPlayer | null => {
            const uwPlayer: Partial<IUwMyPlayer> = {};
            const isSuccess = _uwMyPlayer(uwPlayer);
            if (isSuccess) {
                return uwPlayer as IUwMyPlayer;
            }
            return null;
        },

        // entities
        uwModifiedEntities: (): number[] => {
            const modifiedEntities: Partial<IUwIdsStruct> = {};
            _uwModifiedEntities(modifiedEntities);
            return modifiedEntities.ids as number[];

        },

        cleanup: () => {
            console.log('CALLING CLEANUP');
            uwLib.unload();
            koffi.reset();
        },

        _proto: {
            UwLogCallbackTypeProto,
            UwExceptionCallbackTypeProto,
        },
        _struct: {
            UwLogCallbackStruct,
        }
    };
}

export default createUWApiKoffi;
