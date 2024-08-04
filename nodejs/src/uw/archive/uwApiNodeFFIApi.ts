import {
    Library,
    Callback,
} from '@2060.io/ffi-napi';
import * as ref from '@2060.io/ref-napi';
import RefStruct from 'ref-struct-di';
import type {
    IUwIdsStruct,
    IUwMyPlayer,
    UnregisterUwCallback,

    UwConnectionCallbackType,
    UwExceptionCallbackType,
    UwGameStateCallbackType,
    UwLogCallbackType,
    UwShootingCallbackType,
    UwUpdateCallbackType,
} from '../types';
import { IUWApi } from '../uwApi.type';
import { getLibName } from '../helpers';

const Struct = RefStruct(ref);

const LIBRARY_NAME = 'UNNATURAL_API';


function createRegisterFn<C extends (...args: any) => void>(targetFn: Function, callback: Function): UnregisterUwCallback {
    return () => {

    }
}

function createUWApi(steamPath: string, isHardened = false): IUWApi {
    // COMMON
    // const UwIdsStruct = {
    //     ids: DataType.I32Array,
    //     count: DataType.I32,
    // };

    // structs
    const UwLogCallbackStruct = Struct({
        message: ref.types.char,
        component: ref.types.char,
        severity: ref.types.int32,
    });

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

    // const UwShootingArrayStruct = {
    //     // data: UwShootingDataStruct,
    //     data: DataType.External,
    //     count: DataType.I32,
    // };

    // Player
    // const UwMyPlayerStruct = {
    //     playerEntityId: DataType.I32,
    //     forceEntityId: DataType.I32,
    //     primaryController: DataType.Boolean,
    //     admin: DataType.Boolean,
    // };

    // define prototypes
    // const UwLogCallbackTypeProto = funcConstructor({
    //     paramsType: [
    //         UwLogCallbackStruct,
    //     ],
    //     retType: DataType.Void,
    // });
    // const UwExceptionCallbackTypeProto = funcConstructor({
    //     paramsType: [
    //         DataType.String,
    //     ],
    //     retType: DataType.Void,
    // });
    // const UwUpdateCallbackTypeProto = funcConstructor({
    //     paramsType: [
    //         DataType.I32,
    //         DataType.Boolean,
    //     ],
    //     retType: DataType.Void,
    // });
    // // const UwConnectionStateCallbackTypeProto = koffi.proto('UwConnectionStateCallbackType', 'void', ['uint32']);
    // const UwConnectionStateCallbackTypeProto = funcConstructor({
    //     paramsType: [
    //         DataType.I32,
    //     ],
    //     retType: DataType.Void,
    // });
    // // const UwGameStateCallbackTypeProto = koffi.proto('UwGameStateCallbackType', 'void', ['int']);
    // const UwGameStateCallbackTypeProto = funcConstructor({
    //     paramsType: [
    //         DataType.I32,
    //     ],
    //     retType: DataType.Void,
    // });
    // // const UwMapStateCallbackTypeProto = koffi.proto('UwMapStateCallbackType', 'void', ['int']);
    // const UwMapStateCallbackTypeProto = funcConstructor({
    //     paramsType: [
    //         DataType.I32,
    //     ],
    //     retType: DataType.Void,
    // });

    // // const UwShootingCallbackTypeProto = koffi.proto('UwShootingCallbackType', 'void', ['const UwShootingArray *']);
    // const UwShootingCallbackTypeProto = funcConstructor({
    //     paramsType: [
    //         UwShootingArrayStruct,
    //     ],
    //     retType: DataType.Void,
    // });

    const uwLib = Library(`${steamPath}/${getLibName(isHardened)}`, {
        uwInitialize: ['void', ['int']],
        uwDeinitialize: ['void', []],
        uwSetExceptionCallback: ['void', ['pointer']],
        uwSetLogCallback: ['void', ['pointer']],
        uwLog: ['void', ['int', 'string']],
    });

    // const uwLib = define({
    //     uwInitialize: {
    //         library: LIBRARY_NAME,
    //         retType: DataType.Void,
    //         paramsType: [DataType.I32],
    //     },
    //     uwDeinitialize: {
    //         library: LIBRARY_NAME,
    //         retType: DataType.Void,
    //         paramsType: [],
    //     },
    //     uwSetExceptionCallback: {
    //         library: LIBRARY_NAME,
    //         retType: DataType.Void,
    //         paramsType: [DataType.External],
    //     },
    //     uwSetLogCallback: {
    //         library: LIBRARY_NAME,
    //         retType: DataType.Void,
    //         paramsType: [DataType.External],
    //     },
    //     uwLog: {
    //         library: LIBRARY_NAME,
    //         retType: DataType.Void,
    //         paramsType: [DataType.I32, DataType.String],
    //     },
    //     uwSetPlayerName: {
    //         library: LIBRARY_NAME,
    //         retType: DataType.Void,
    //         paramsType: [DataType.String],
    //     },
    //     uwSetPlayerColor: {
    //         library: LIBRARY_NAME,
    //         retType: DataType.Void,
    //         paramsType: [DataType.Float, DataType.Float, DataType.Float],
    //     },
    //     uwSetConnectStartGui: {
    //         library: LIBRARY_NAME,
    //         retType: DataType.Void,
    //         paramsType: [DataType.Boolean, DataType.String],
    //     },
    //     uwSetConnectAsObserver: {
    //         library: LIBRARY_NAME,
    //         retType: DataType.Void,
    //         paramsType: [DataType.Boolean],
    //     },
    //     uwConnectFindLan: {
    //         library: LIBRARY_NAME,
    //         retType: DataType.Boolean,
    //         paramsType: [DataType.I64],
    //     },
    //     uwConnectDirect: {
    //         library: LIBRARY_NAME,
    //         retType: DataType.Void,
    //         paramsType: [DataType.I32],
    //     },
    //     uwConnectLobbyId: {
    //         library: LIBRARY_NAME,
    //         retType: DataType.Void,
    //         paramsType: [DataType.I64],
    //     },
    //     uwConnectNewServer: {
    //         library: LIBRARY_NAME,
    //         retType: DataType.Void,
    //         paramsType: [DataType.I32, DataType.String, DataType.String],
    //     },
    //     uwTryReconnect: {
    //         library: LIBRARY_NAME,
    //         retType: DataType.Boolean,
    //         paramsType: [],
    //     },
    //     uwDisconnect: {
    //         library: LIBRARY_NAME,
    //         retType: DataType.Void,
    //         paramsType: [],
    //     },
    //     uwSetUpdateCallback: {
    //         library: LIBRARY_NAME,
    //         retType: DataType.Void,
    //         paramsType: [DataType.External],
    //     },
    //     uwSetConnectionStateCallback: {
    //         library: LIBRARY_NAME,
    //         retType: DataType.Void,
    //         paramsType: [DataType.External],
    //     },
    //     uwSetGameStateCallback: {
    //         library: LIBRARY_NAME,
    //         retType: DataType.Void,
    //         paramsType: [DataType.External],
    //     },
    //     uwSetMapStateCallback: {
    //         library: LIBRARY_NAME,
    //         retType: DataType.Void,
    //         paramsType: [DataType.External],
    //     },
    //     uwSetShootingCallback: {
    //         library: LIBRARY_NAME,
    //         retType: DataType.Void,
    //         paramsType: [DataType.External],
    //     },
    //     uwMyPlayer: {
    //         library: LIBRARY_NAME,
    //         retType: DataType.Void,
    //         paramsType: [UwMyPlayerStruct],
    //     },
    //     uwModifiedEntities: {
    //         library: LIBRARY_NAME,
    //         retType: DataType.Void,
    //         paramsType: [UwIdsStruct],
    //     }
    // });

    console.log('UW API PREPARED - DONE');

    return {
        UW_VERSION: 21,
        uwInitialize: (version: number) => {
            uwLib.uwInitialize(version);
        },
        uwDeinitialize: () => {
            uwLib.uwDeinitialize();
        },
        uwSetLogcallback: (callback: UwLogCallbackType) => {
            const callbackDelegate = Callback('void', ['int', UwLogCallbackStruct], (data) => {
                console.log('CALLBACK CALLED WITH', data);
                callback(data);
            });
            uwLib.uwSetLogCallback(callbackDelegate);
            return () => {};
        },
        uwSetExceptionCallback: (callback: UwExceptionCallbackType) => {
            const callbackDelegate = Callback('void', ['string'], callback);
            uwLib.uwSetLogCallback(callbackDelegate);
            return () => {};
        },


        uwLog: (severity, message) => {
            console.log('CALLING LOG');
            uwLib.uwLog(severity, message);
        },

        uwSetPlayerName: (name) => {
            // uwLib.uwSetPlayerName([name]);
        },
        uwSetPlayerColor: uwLib.uwSetPlayerColor,
        uwSetConnectStartGui: (gui = true, extra = '') => {
            uwLib.uwSetConnectStartGui([gui, extra]);
        },
        uwSetConnectAsObserver: uwLib.uwSetConnectAsObserver,

        uwConnectFindLan: (timeoutMicroseconds = 3_000_000): boolean => {
            return uwLib.uwConnectFindLan([timeoutMicroseconds]);
        },
        uwConnectDirect: uwLib.uwConnectDirect,
        uwConnectLobbyId: uwLib.uwConnectLobbyId,
        uwConnectNewServer: (visibility = 0, name = '', extraParams = '') => {
            uwLib.uwConnectNewServer([visibility, name, extraParams]);
        },
        uwTryReconnect: () => {
            return uwLib.uwTryReconnect([]);
        },
        uwDisconnect: uwLib.uwDisconnect,


        // Game state & callbacks
        uwSetConnectionStateCallback: () => {},
        uwSetGameStateCallback: () => {},
        uwSetUpdateCallback: () => {},
        uwSetMapStateCallback: () => {},
        uwSetShootingCallback: (callback: UwShootingCallbackType) => {
            // TODO: verify it works
        },

        // my player
        uwMyPlayer: (): IUwMyPlayer | null => {
            // const uwPlayer: Partial<IUwMyPlayer> = {};
            // const isSuccess = _uwMyPlayer(uwPlayer);
            // if (isSuccess) {
            //     return uwPlayer as IUwMyPlayer;
            // }
            return null;
        },

        // entities
        uwModifiedEntities: (): number[] => {
            // const modifiedEntities: Partial<IUwIdsStruct> = {};
            // _uwModifiedEntities(modifiedEntities);
            // return modifiedEntities.ids as number[];
            return [];
        },
        cleanup: () => {

        },

        _proto: {
        },
        _struct: {
            UwLogCallbackStruct,
        }
    };


}

export default createUWApi;
