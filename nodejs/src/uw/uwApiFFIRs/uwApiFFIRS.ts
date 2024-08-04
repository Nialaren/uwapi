import {
    open,
    close,

    DataType,
    createPointer,
    funcConstructor,
    freePointer,
    PointerType,
    unwrapPointer,
    load,
} from 'ffi-rs';
import type {
    // IUwIdsStruct,
    IUwMyPlayer,
    UnregisterUwCallback,

    UwConnectionCallbackType,
    UwGameStateCallbackType,
    UwLogCallbackType,
    UwShootingCallbackType,
    UwUpdateCallbackType,
} from '../types';
import { IUWApi } from '../uwApi.type';
import { getLibName } from '../helpers';
import { define } from './ffiRsHelpers';

const LIBRARY_NAME = 'UNNATURAL_API';

export const UW_VERSION = 21;


function createRegisterFn<C extends (...args: any) => void>(fnType: any, targetFn: Function) {
    return (callback: C): UnregisterUwCallback => {
        const callbackHandle = createPointer({
            paramsType: [fnType],
            paramsValue: [callback],
        });
        const callAsync = async () => {
            await targetFn(unwrapPointer(callbackHandle));
        };
        callAsync();
        return () => {
            freePointer({
                paramsType: [fnType],
                paramsValue: callbackHandle,
                pointerType: PointerType.RsPointer,
            });
        }
    };
}

export function createUWApi(steamPath: string, isHardened = false): IUWApi {
    // COMMON
    const UwIdsStruct = {
        ids: DataType.I32Array,
        count: DataType.I32,
    };

    // structs
    const UwLogCallbackStruct = {
        message: DataType.String,
        component: DataType.String,
        severity: DataType.I32,
    };

    // const UwShootingUnitStruct = {
    //     position: DataType.I32,
    //     force: DataType.I32,
    //     prototype: DataType.I32,
    //     id: DataType.I32,
    // };

    // const UwShootingDataStruct = {
    //     shooter: UwShootingUnitStruct,
    //     target: UwShootingUnitStruct,
    // };

    const UwShootingArrayStruct = {
        // data: UwShootingDataStruct,
        data: DataType.External,
        count: DataType.I32,
    };

    // Player
    const UwMyPlayerStruct = {
        playerEntityId: DataType.I32,
        forceEntityId: DataType.I32,
        primaryController: DataType.Boolean,
        admin: DataType.Boolean,
    };

    // define prototypes
    const UwLogCallbackTypeProto = funcConstructor({
        paramsType: [
            UwLogCallbackStruct,
        ],
        retType: DataType.Void,
    });
    const UwExceptionCallbackTypeProto = funcConstructor({
        paramsType: [
            DataType.String,
        ],
        retType: DataType.Void,
    });
    const UwUpdateCallbackTypeProto = funcConstructor({
        paramsType: [
            DataType.I32,
            DataType.Boolean,
        ],
        retType: DataType.Void,
    });
    const UwConnectionStateCallbackTypeProto = funcConstructor({
        paramsType: [
            DataType.I32,
        ],
        retType: DataType.Void,
    });
    const UwGameStateCallbackTypeProto = funcConstructor({
        paramsType: [
            DataType.I32,
        ],
        retType: DataType.Void,
    });
    const UwMapStateCallbackTypeProto = funcConstructor({
        paramsType: [
            DataType.I32,
        ],
        retType: DataType.Void,
    });

    const UwShootingCallbackTypeProto = funcConstructor({
        paramsType: [
            UwShootingArrayStruct,
        ],
        retType: DataType.Void,
    });

    open({
        library: LIBRARY_NAME,
        path: `${steamPath}/${getLibName(isHardened)}`,
    });

    const uwLib = define({
        uwDeinitialize: {
            retType: DataType.Void,
            paramsType: [],
        },
        uwSetExceptionCallback: {
            retType: DataType.Void,
            paramsType: [DataType.External],
        },
        uwLog: {
            retType: DataType.Void,
            paramsType: [DataType.I32, DataType.String],
        },
        uwSetPlayerName: {
            retType: DataType.Void,
            paramsType: [DataType.String],
        },
        uwSetPlayerColor: {
            retType: DataType.Void,
            paramsType: [DataType.Float, DataType.Float, DataType.Float],
        },
        uwSetConnectStartGui: {
            retType: DataType.Void,
            paramsType: [DataType.Boolean, DataType.String],
        },
        uwSetConnectAsObserver: {
            retType: DataType.Void,
            paramsType: [DataType.Boolean],
        },
        uwConnectFindLan: {
            retType: DataType.Boolean,
            paramsType: [DataType.I64],
        },
        uwConnectDirect: {
            retType: DataType.Void,
            paramsType: [DataType.I32],
        },
        uwConnectLobbyId: {
            retType: DataType.Void,
            paramsType: [DataType.I64],
        },
        uwConnectNewServer: {
            retType: DataType.Void,
            paramsType: [DataType.I32, DataType.String, DataType.String],
        },
        uwTryReconnect: {
            retType: DataType.Boolean,
            paramsType: [],
        },
        uwDisconnect: {
            retType: DataType.Void,
            paramsType: [],
        },
        uwSetUpdateCallback: {
            retType: DataType.Void,
            paramsType: [DataType.External],
            freeResultMemory: true,
        },
        uwSetConnectionStateCallback: {
            retType: DataType.Void,
            paramsType: [DataType.External],
        },
        uwSetGameStateCallback: {
            retType: DataType.Void,
            paramsType: [DataType.External],
        },
        uwSetMapStateCallback: {
            retType: DataType.Void,
            paramsType: [DataType.External],
        },
        uwSetShootingCallback: {
            retType: DataType.Void,
            paramsType: [DataType.External],
        },
        uwMyPlayer: {
            retType: DataType.Void,
            paramsType: [UwMyPlayerStruct],
        },
        uwModifiedEntities: {
            retType: DataType.Void,
            paramsType: [UwIdsStruct],
        }
    }, {
        library: LIBRARY_NAME,
        runInNewThread: true,
    });

    const uwSetLogCallback = async (callback: unknown[]) => {
        await load({
            library: LIBRARY_NAME,
            funcName: 'uwSetLogCallback',
            errno: true,
            runInNewThread: true,
            retType: DataType.Void,
            paramsType: [DataType.External],
            paramsValue: callback,
        });
    };

    const uwInitialize = (version: number) => {
        return load({
            library: LIBRARY_NAME,
            funcName: 'uwInitialize',
            errno: true,
            runInNewThread: true,
            retType: DataType.Void,
            paramsType: [DataType.I32],
            paramsValue: [version],
        });
    };

    console.log('UW API PREPARED - DONE');

    return {
        UW_VERSION,
        uwInitialize: async (version: number) => {
            await uwInitialize(version);
        },
        uwDeinitialize: async () => {
            await uwLib.uwDeinitialize([]);
        },
        uwSetLogCallback: (callback: UwLogCallbackType) => {
            return createRegisterFn(UwLogCallbackTypeProto, uwSetLogCallback)(callback);
        },
        uwSetExceptionCallback: createRegisterFn(UwExceptionCallbackTypeProto, uwLib.uwSetExceptionCallback),


        uwLog: async (severity, message) => {
            uwLib.uwLog([severity, message]);
        },

        uwSetPlayerName: async (name) => {
            uwLib.uwSetPlayerName([name]);
        },
        uwSetPlayerColor: async (r, g, b) => {
            uwLib.uwSetPlayerColor([r, g, b]);
        },
        uwSetConnectStartGui: async (gui = true, extra = '') => {
            uwLib.uwSetConnectStartGui([gui, extra]);
        },
        uwSetConnectAsObserver: async () => {
            uwLib.uwSetConnectAsObserver();
        },

        uwConnectFindLan: async (timeoutMicroseconds = 3_000_000): Promise<boolean> => {
            const result = await uwLib.uwConnectFindLan([timeoutMicroseconds]);
            if (typeof result === 'boolean') {
                return result;
            }
            if (typeof result === 'object' && 'value' in result) {
                return !!result.value;
            }
            return false;
        },
        uwConnectDirect: async (address, port) => {
            uwLib.uwConnectDirect([address, port]);
        },
        uwConnectLobbyId: async (lobbyId) => {
            uwLib.uwConnectLobbyId([lobbyId]);
        },
        uwConnectNewServer: async (visibility = 0, name = '', extraParams = '') => {
            uwLib.uwConnectNewServer([visibility, name, extraParams]);
        },
        uwTryReconnect: async () => {
            const result = await uwLib.uwTryReconnect([]);
            if (typeof result === 'boolean') {
                return result;
            }
            if (typeof result === 'object' && 'value' in result) {
                return !!result.value;
            }
            return false;
        },
        uwDisconnect: async () => {
            uwLib.uwDisconnect();
        },


        // Game state & callbacks
        uwSetConnectionStateCallback: createRegisterFn<UwConnectionCallbackType>(UwConnectionStateCallbackTypeProto, uwLib.uwSetConnectionStateCallback),
        uwSetGameStateCallback: createRegisterFn<UwGameStateCallbackType>(UwGameStateCallbackTypeProto, uwLib.uwSetGameStateCallback),
        uwSetUpdateCallback: createRegisterFn<UwUpdateCallbackType>(UwUpdateCallbackTypeProto, uwLib.uwSetUpdateCallback),
        uwSetMapStateCallback: createRegisterFn<UwUpdateCallbackType>(UwMapStateCallbackTypeProto, uwLib.uwSetMapStateCallback),
        uwSetShootingCallback: (callback: UwShootingCallbackType) => {
            // TODO: verify it works
            return createRegisterFn(UwShootingCallbackTypeProto, uwLib.uwSetShootingCallback)(callback);
        },

        // my player
        uwMyPlayer: async (): Promise<IUwMyPlayer | null> => {
            // const uwPlayer: Partial<IUwMyPlayer> = {};
            // const isSuccess = _uwMyPlayer(uwPlayer);
            // if (isSuccess) {
            //     return uwPlayer as IUwMyPlayer;
            // }
            return null;
        },

        // entities
        uwModifiedEntities: async (): Promise<number[]> => {
            // const modifiedEntities: Partial<IUwIdsStruct> = {};
            // _uwModifiedEntities(modifiedEntities);
            // return modifiedEntities.ids as number[];
            return [];
        },
        cleanup: async () => {
            close(LIBRARY_NAME);
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
