import {
    createUWApi,
} from '../uwApiFFIRs/uwApiFFIRS';
import type { UwParentMessage, UwWorkerMessage } from '../workerMessage.type';
import type { IInitMessage } from './message.type';


if (!process.send) {
    console.error('Process cannot be run as main process');
    process.exit(1);
}

const _sendToParent = process.send;
const sendToParent = (message: UwWorkerMessage) => {
    _sendToParent.call(process, message);
};


function initCallback(initMessage: IInitMessage) {
    if (initMessage.action !== 'init') {
        console.error('WRONG MESSAGE', initMessage);
        process.exit(1);
    }
    process.off('message', initCallback);

    const {
        steamPath,
        isHardened,
    } = initMessage.data;

    const api = createUWApi(steamPath, isHardened);
    const callbacksMap = new Map<string, Function>();

    function prepareLogCallback(name: UwWorkerMessage['action']) {
        if (callbacksMap.has(name)) {
            return;
        }
        const cleanFn = (api[name] as Function)((...args: any[]) => {
            sendToParent({
                action: name,
                // @ts-ignore
                data: args,
            });
        });
        callbacksMap.set(name, cleanFn);
    }

    // Listen for messages from the main thread
    process.on('message', (message: UwParentMessage) => {
        // console.log('Fork received complex data:', message);
        if (typeof message !== 'object' || !('action' in message)) {
            throw new Error('WRONG MESSAGE STRUCTURE')!
        }

        switch(message.action) {
            case 'uwApi': {
                const {
                    name: methodName,
                } = message.data;
                const parameters = message.data.parameters || [];

                switch (methodName) {
                    case 'uwInitialize': {
                        api.uwInitialize.apply(api, parameters);
                        break;
                    }
                    case 'uwDeinitialize': {
                        api.uwDeinitialize.apply(api, parameters);
                        break;
                    }
                    case 'uwSetLogCallback': {
                        prepareLogCallback(methodName);
                        break;
                    }
                    case 'uwSetExceptionCallback': {
                        if (callbacksMap.has('uwSetExceptionCallback')) {
                            break;
                        }
                        const cleanFn = api.uwSetExceptionCallback((data) => {
                            sendToParent({
                                action: 'uwSetExceptionCallback',
                                data: [data],
                            });
                        });
                        callbacksMap.set('uwSetExceptionCallback', cleanFn);
                        break;
                    }
                    case 'uwLog': {
                        api[methodName].apply(api, parameters);
                        break;
                    }
                    case 'uwSetPlayerName': {
                        api[methodName].apply(api, parameters);
                        break;
                    }
                    case 'uwSetPlayerColor': {
                        api[methodName].apply(api, parameters);
                        break;
                    }
                    case 'uwSetConnectStartGui': {
                        api[methodName].apply(api, parameters);
                        break;
                    }
                    case 'uwSetConnectAsObserver': {
                        api[methodName].apply(api, parameters);
                        break;
                    }
                    case 'uwConnectFindLan': {
                        const asyncFn = async () => {
                            const result = await api.uwConnectFindLan.apply(api, parameters);

                            sendToParent({
                                action: methodName,
                                data: [result],
                            });
                        };
                        asyncFn();
                        break;
                    }
                    case 'uwConnectDirect': {
                        api[methodName].apply(api, parameters);
                        break;
                    }
                    case 'uwConnectLobbyId': {
                        api[methodName].apply(api, parameters);
                        break;
                    }
                    case 'uwConnectNewServer': {
                        api[methodName].apply(api, parameters);
                        break;
                    }
                    case 'uwTryReconnect': {
                        const asyncFn = async () => {
                            const result = await api.uwConnectFindLan.apply(api, parameters);

                            sendToParent({
                                action: methodName,
                                data: [result],
                            });
                        };
                        asyncFn();
                        break;
                    }
                    case 'uwDisconnect': {
                        api[methodName].apply(api, parameters);
                        break;
                    }
                    case 'uwSetConnectionStateCallback': {
                        prepareLogCallback(methodName);
                        break;
                    }
                    case 'uwSetGameStateCallback': {
                        prepareLogCallback(methodName);
                        break;
                    }
                    case 'uwSetUpdateCallback': {
                        prepareLogCallback(methodName);
                        break;
                    }
                    case 'uwSetMapStateCallback': {
                        prepareLogCallback(methodName);
                        break;
                    }
                    case 'uwSetShootingCallback': {
                        prepareLogCallback(methodName);
                        break;
                    }
                    case 'uwMyPlayer': {
                        const asyncFn = async () => {
                            const result = await api.uwMyPlayer.apply(api, parameters);

                            sendToParent({
                                action: methodName,
                                data: [result],
                            });
                        };
                        asyncFn();
                        break;
                    }
                    case 'uwModifiedEntities': {
                        const asyncFn = async () => {
                            const result = await api.uwModifiedEntities.apply(api, parameters);

                            sendToParent({
                                action: methodName,
                                data: [result],
                            });
                        };
                        asyncFn();
                        break;
                    }

                    case 'uwMapState': {
                        const asyncFn = async () => {
                            const result = await api.uwMapState.apply(api, parameters);

                            sendToParent({
                                action: methodName,
                                data: [result],
                            });
                        };
                        asyncFn();
                        break;
                    }

                    case 'uwConnectionState': {
                        const asyncFn = async () => {
                            const result = await api.uwConnectionState.apply(api, parameters);

                            sendToParent({
                                action: methodName,
                                data: [result],
                            });
                        };
                        asyncFn();
                        break;
                    }
                    case 'uwOrders': {
                        const asyncFn = async () => {
                            const result = await api[methodName].apply(api, parameters);

                            sendToParent({
                                action: methodName,
                                data: [result],
                            });
                        };
                        asyncFn();
                        break;
                    }
                    case 'uwOrder': {
                        api[methodName].apply(api, parameters);
                        break;
                    }
                    case 'uwCommandSelfDestruct': {
                        api[methodName].apply(api, parameters);
                        break;
                    }
                    case 'uwCommandPlaceConstruction': {
                        api[methodName].apply(api, parameters);
                        break;
                    }
                    case 'uwCommandSetRecipe': {
                        api[methodName].apply(api, parameters);
                        break;
                    }
                    case 'uwCommandLoad': {
                        api[methodName].apply(api, parameters);
                        break;
                    }
                    case 'uwCommandUnload': {
                        api[methodName].apply(api, parameters);
                        break;
                    }
                    case 'uwCommandMove': {
                        api[methodName].apply(api, parameters);
                        break;
                    }
                    case 'uwCommandAim': {
                        api[methodName].apply(api, parameters);
                        break;
                    }
                    case 'uwCommandRenounceControl': {
                        api[methodName].apply(api, parameters);
                        break;
                    }
                    case 'uwCommandSetPriority': {
                        api[methodName].apply(api, parameters);
                        break;
                    }
                    case 'uwAllPrototypes': {
                        const asyncFn = async () => {
                            const result = await api[methodName].apply(api, parameters);

                            sendToParent({
                                action: methodName,
                                data: [result],
                            });
                        };
                        asyncFn();
                        break;
                    }
                    case 'uwDefinitionsJson': {
                        const asyncFn = async () => {
                            const result = await api[methodName].apply(api, parameters);

                            sendToParent({
                                action: methodName,
                                data: [result],
                            });
                        };
                        asyncFn();
                        break;
                    }
                    case 'cleanup': {
                        callbacksMap.forEach((cleanUp) => {
                            cleanUp();
                        });
                        callbacksMap.clear();
                        break;
                    }
                    case 'uwRemoveCallback': {
                        // TODO: does it work?
                        const callBackName = parameters[0] as string;
                        const cleanUpFn = callbacksMap.get(parameters[0] as string);
                        if (cleanUpFn) {
                            cleanUpFn();
                            callbacksMap.delete(callBackName);
                        }
                        break;
                    }
                }
                break;
            }
            case 'test': {
                console.log(`Test Log with data: ${message.data.log}`);
                break;
            }
            default: {
                // @ts-ignore
                throw new Error(`Unknown message action ${message.action}`);
            }
        }
    });
}

process.on('message', initCallback);






