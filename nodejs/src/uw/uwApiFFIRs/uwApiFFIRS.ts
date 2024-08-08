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
    restorePointer,
    JsExternal,
    arrayConstructor,
    wrapPointer,

} from 'ffi-rs';
import type {
    IUwMyPlayer,
    IUwOrder,
    IUwProtoGeneric,
    IUwShootingArray,
    IUwShootingData,
    UnregisterUwCallback,

    UwConnectionCallbackType,
    UwGameStateCallbackType,
    UwShootingCallbackType,
    UwUpdateCallbackType,
} from '../types';
import { IUWApi } from '../uwApi.type';
import { ConnectionState, getLibName, MapState, Priority, Prototype } from '../helpers';
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
        ids: DataType.External,
        count: DataType.I32,
    };

    // structs
    const UwLogCallbackStruct = {
        message: DataType.String,
        component: DataType.String,
        severity: DataType.I32,
    };

    const UwShootingUnitStruct = {
        position: DataType.I32,
        force: DataType.I32,
        prototype: DataType.I32,
        id: DataType.I32,
    };

    const UwShootingDataStruct = {
        shooter: UwShootingUnitStruct,
        target: UwShootingUnitStruct,
    };

    const UwShootingArrayStruct = {
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

    const UwOrderStruct = {
        entity: DataType.I32,
        position: DataType.I32,
        order: DataType.I32,
        priority: DataType.I32,
    };

    const UwOrdersStruct = {
        /**
         * Pointer to {UwOrderStruct}
         */
        orders: DataType.External,
        count: DataType.I32,
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
            paramsType: [DataType.External],
        },
        uwModifiedEntities: {
            retType: DataType.Void,
            paramsType: [DataType.External],
        },
        uwConnectionState: {
            retType: DataType.I32,
            paramsType: [],
        },
        uwMapState: {
            retType: DataType.I32,
            paramsType: [],
        },
        // COMMANDS AND ORDERS
        uwOrders: {
            retType: DataType.Void,
            paramsType: [DataType.I32, UwOrdersStruct],
        },
        uwOrder: {
            retType: DataType.Void,
            paramsType: [DataType.I32, UwOrderStruct],
        },
        uwCommandSelfDestruct: {
            retType: DataType.Void,
            paramsType: [DataType.I32],
        },
        uwCommandPlaceConstruction: {
            retType: DataType.Void,
            paramsType: [DataType.I32, DataType.I32, DataType.Float],
        },
        uwCommandSetRecipe: {
            retType: DataType.Void,
            paramsType: [DataType.I32, DataType.I32],
        },
        uwCommandLoad: {
            retType: DataType.Void,
            paramsType: [DataType.I32, DataType.I32],
        },
        uwCommandUnload: {
            retType: DataType.Void,
            paramsType: [DataType.I32],
        },
        uwCommandMove: {
            retType: DataType.Void,
            paramsType: [DataType.I32, DataType.I32, DataType.Float],
        },
        uwCommandAim: {
            retType: DataType.Void,
            paramsType: [DataType.I32, DataType.I32],
        },
        uwCommandRenounceControl: {
            retType: DataType.Void,
            paramsType: [DataType.I32],
        },
        uwCommandSetPriority: {
            retType: DataType.Void,
            paramsType: [DataType.I32, DataType.I32],
        },

        // Prototypes Shit
        uwAllPrototypes: {
            retType: DataType.Void,
            paramsType: [DataType.External],
        },
        uwPrototypeType: {
            retType: DataType.I32,
            paramsType: [DataType.I32],
            runInNewThread: false,
        },
        uwPrototypeJson: {
            retType: DataType.String,
            paramsType: [DataType.I32],
            runInNewThread: false,
        },
        uwDefinitionsJson: {
            retType: DataType.String,
            paramsType: [],
        },
    }, {
        library: LIBRARY_NAME,
        runInNewThread: true,
        errno: false,
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
        uwSetLogCallback: createRegisterFn(UwLogCallbackTypeProto, uwSetLogCallback),
        uwSetExceptionCallback: createRegisterFn(UwExceptionCallbackTypeProto, uwLib.uwSetExceptionCallback),

        uwLog: async (severity, message) => {
            await uwLib.uwLog([severity, message]);
        },
        uwSetPlayerName: async (name) => {
            await uwLib.uwSetPlayerName([name]);
        },
        uwSetPlayerColor: async (r, g, b) => {
            await uwLib.uwSetPlayerColor([r, g, b]);
        },
        uwSetConnectStartGui: async (gui = true, extra = '') => {
            await uwLib.uwSetConnectStartGui([gui, extra]);
        },
        uwSetConnectAsObserver: async () => {
            await uwLib.uwSetConnectAsObserver();
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
            await uwLib.uwConnectDirect([address, port]);
        },
        uwConnectLobbyId: async (lobbyId) => {
            await uwLib.uwConnectLobbyId([lobbyId]);
        },
        uwConnectNewServer: async (visibility = 0, name = '', extraParams = '') => {
            await uwLib.uwConnectNewServer([visibility, name, extraParams]);
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
            await uwLib.uwDisconnect();
        },


        // Game state & callbacks
        uwSetConnectionStateCallback: createRegisterFn<UwConnectionCallbackType>(UwConnectionStateCallbackTypeProto, uwLib.uwSetConnectionStateCallback),
        uwSetGameStateCallback: createRegisterFn<UwGameStateCallbackType>(UwGameStateCallbackTypeProto, uwLib.uwSetGameStateCallback),
        uwSetUpdateCallback: createRegisterFn<UwUpdateCallbackType>(UwUpdateCallbackTypeProto, uwLib.uwSetUpdateCallback),
        uwSetMapStateCallback: createRegisterFn<UwUpdateCallbackType>(UwMapStateCallbackTypeProto, uwLib.uwSetMapStateCallback),
        uwSetShootingCallback: (callback: UwShootingCallbackType) => {
            // TODO: verify it works
            const _callback = (arrayStruct: { count: number; data: JsExternal }) => {
                console.log('SHOOTING callback Data', arrayStruct);
                const arrayPointer = wrapPointer([arrayStruct.data]);

                const ArrayType = arrayConstructor({
                    length: arrayStruct.count,
                    type: DataType.External,
                });

                const shootingPointerArray = restorePointer({
                    retType: [ArrayType],
                    paramsValue: arrayPointer,
                })[0] as unknown as JsExternal[];

                console.log('SHOOTING First restore', shootingPointerArray);

                const shootingData = shootingPointerArray.map<IUwShootingData>((pointer: JsExternal) => {
                    return restorePointer({
                        retType: [UwShootingDataStruct],
                        paramsValue: wrapPointer([pointer]),
                    })[0] as unknown as IUwShootingData;
                });

                console.log('SHOOTING SECOND restore', shootingData);

                callback({
                    count: arrayStruct.count,
                    data: shootingData,
                } satisfies IUwShootingArray);
            }
            return createRegisterFn(UwShootingCallbackTypeProto, uwLib.uwSetShootingCallback)(_callback);
        },

        // my player
        uwMyPlayer: async (): Promise<IUwMyPlayer> => {
            const playerTemplateObj: IUwMyPlayer = {
                admin: false,
                forceEntityId: -1,
                playerEntityId: -1,
                primaryController: false,
            };
            const myPlayerPointer = createPointer({
                paramsType: [UwMyPlayerStruct],
                paramsValue: [playerTemplateObj],
            });
            await uwLib.uwMyPlayer(unwrapPointer(myPlayerPointer));

            const resultPlayer = restorePointer({
                retType: [UwMyPlayerStruct],
                paramsValue: myPlayerPointer,
            })[0] as unknown as IUwMyPlayer;

            // clear pointer
            freePointer({
                paramsType: [UwMyPlayerStruct],
                paramsValue: myPlayerPointer,
                pointerType: PointerType.RsPointer,
            });

            return resultPlayer;
        },

        uwModifiedEntities: async (): Promise<number[]> => {
            const IdsPointer = createPointer({
                paramsType: [DataType.I32Array],
                paramsValue: [[]],
            });

            const UwIdsStructData = {
                ids: unwrapPointer(IdsPointer)[0],
                count: 0,
            };

            const IdsStructPointer = createPointer({
                paramsType: [UwIdsStruct],
                paramsValue: [UwIdsStructData],
            });

            await uwLib.uwModifiedEntities(unwrapPointer(IdsStructPointer));

            const obj = restorePointer({
                retType: [UwIdsStruct],
                paramsValue: IdsStructPointer,
            })[0] as unknown as { ids: JsExternal, count: number };

            const resultIdsPointer = wrapPointer([obj.ids]);

            const IdsTypeArr = arrayConstructor({
                length: obj.count,
                type: DataType.I32Array
            });

            const ids = restorePointer({
                retType: [IdsTypeArr],
                paramsValue: resultIdsPointer,
            })[0] as unknown as number[];

            freePointer({
                paramsType: [UwIdsStruct],
                paramsValue: IdsStructPointer,
                pointerType: PointerType.RsPointer,
            });

            return ids;
        },

        uwConnectionState: async (): Promise<ConnectionState> => {
            return uwLib.uwConnectionState() as ConnectionState;
        },

        uwMapState: async () => {
            return uwLib.uwMapState() as MapState;
        },

        // COMMANDS AND ORDERS
        uwOrders: async (unit: number) => {
            const OrdersArrPointer = createPointer({
                paramsType: [DataType.External],
                paramsValue: [[]],
            });

            const uwOrderStructData = {
                orders: unwrapPointer(OrdersArrPointer)[0],
                count: 0,
            }
            const OrdersStructPointer = createPointer({
                paramsType: [UwOrdersStruct],
                paramsValue: [uwOrderStructData],
            });
            await uwLib.uwOrders([unit, unwrapPointer(OrdersStructPointer)[0]]);

            const resultOrders = restorePointer({
                retType: [UwOrdersStruct],
                paramsValue: OrdersStructPointer,
            })[0] as unknown as { count: number, orders: JsExternal };

            const ArrayType = arrayConstructor({
                length: resultOrders.count,
                type: DataType.External,
            });

            const ordersArrayResult = restorePointer({
                retType: [ArrayType],
                paramsValue: wrapPointer([resultOrders.orders]),
            })[0] as unknown as JsExternal[];

            console.log('UW ORDERS First restore', ordersArrayResult);

            const orders = ordersArrayResult.map<IUwOrder>((pointer: JsExternal) => {
                return restorePointer({
                    retType: [UwOrderStruct],
                    paramsValue: wrapPointer([pointer]),
                })[0] as unknown as IUwOrder;
            });

            console.log('UW ORDERS', orders);
            return orders;
        },
        uwOrder: async (unit: number, order: IUwOrder) => {
            await uwLib.uwOrder([unit, order]);
        },
        uwCommandSelfDestruct: async (unit: number) => {
            await uwLib.uwCommandSelfDestruct([unit]);
        },
        uwCommandPlaceConstruction: async (proto: number, position: number, yaw: number) => {
            await uwLib.uwCommandPlaceConstruction([proto, position, yaw]);
        },
        uwCommandSetRecipe: async (unit: number, recipe: number) => {
            await uwLib.uwCommandSetRecipe([unit, recipe]);
        },
        uwCommandLoad: async (unit: number, resourceType: number) => {
            await uwLib.uwCommandLoad([unit, resourceType]);
        },
        uwCommandUnload: async (unit: number) => {
            await uwLib.uwCommandUnload([unit]);
        },
        uwCommandMove: async (unit: number, position: number, yaw: number) => {
            await uwLib.uwCommandMove([unit, position, yaw]);
        },
        uwCommandAim: async (unit: number, target: number) => {
            await uwLib.uwCommandAim([unit, target]);
        },
        uwCommandRenounceControl: async (unit: number) => {
            await uwLib.uwCommandRenounceControl([unit]);
        },
        uwCommandSetPriority: async (unit: number, priority: Priority) => {
            await uwLib.uwCommandSetPriority([unit, priority]);
        },

        // PROTOTYPES SHIT
        uwAllPrototypes: async () => {
            const IdsPointer = createPointer({
                paramsType: [DataType.I32Array],
                paramsValue: [[]],
            });

            const UwIdsStructData = {
                ids: unwrapPointer(IdsPointer)[0],
                count: 0,
            };

            const IdsStructPointer = createPointer({
                paramsType: [UwIdsStruct],
                paramsValue: [UwIdsStructData],
            });

            await uwLib.uwAllPrototypes(unwrapPointer(IdsStructPointer));

            const obj = restorePointer({
                retType: [UwIdsStruct],
                paramsValue: IdsStructPointer,
            })[0] as unknown as { ids: JsExternal, count: number };

            const resultIdsPointer = wrapPointer([obj.ids]);

            const IdsTypeArr = arrayConstructor({
                length: obj.count,
                type: DataType.I32Array
            });

            const ids = restorePointer({
                retType: [IdsTypeArr],
                paramsValue: resultIdsPointer,
            })[0] as unknown as number[];

            freePointer({
                paramsType: [UwIdsStruct],
                paramsValue: IdsStructPointer,
                pointerType: PointerType.RsPointer,
            });

            const prototypes = new Array<IUwProtoGeneric>(ids.length);
            for (let i = 0; i < ids.length; i++) {
                const id = ids[i];
                const type  = await uwLib.uwPrototypeType([id]) as Prototype;
                const jsonDataStr  = await uwLib.uwPrototypeJson([id]) as string;
                const parsedjson = JSON.parse(jsonDataStr) as { name: string };

                prototypes[i] = {
                    type,
                    name: parsedjson['name'],
                    json: parsedjson,
                };
            }

            return prototypes;
        },

        uwDefinitionsJson: async () => {
            return uwLib.uwDefinitionsJson([]) as string;
        },

        // NON UW API
        cleanup: async () => {
            close(LIBRARY_NAME);
        },
    };


}
