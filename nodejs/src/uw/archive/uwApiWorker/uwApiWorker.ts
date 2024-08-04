import {
    parentPort as _parentPort,
    isMainThread,
    workerData,
    threadId,
} from 'node:worker_threads';
import {
    createUWApi,
} from '../uwApiFFIRs/uwApiFFIRS';
import type { UwParentMessage } from '../workerMessage.type';

if (isMainThread || _parentPort === null) {
    console.error('Worker cannot be run as main process');
    process.exit(1);
}

const parentPort = _parentPort;
const {
    steamPath,
    isHardened = false,
} = workerData as { steamPath: string, isHardened: boolean };

const api = createUWApi(steamPath, isHardened);
const callbacksMap = new Map<string, Function>();

console.log('WORKER THREAD ID', threadId);

// Listen for messages from the main thread
parentPort.on('message', (message: UwParentMessage) => {
    console.log('Worker thread received complex data:', message);
    if (typeof message !== 'object' || !('action' in message)) {
        throw new Error('WRONG MESSAGE STRUCTURE')!
    }

    switch(message.action) {
        case 'uwApi': {
            const {
                name: methodName,
                parameters = [],
            } = message.data;

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
                    if (callbacksMap.has('uwSetLogCallback')) {
                        break;
                    }
                    const cleanFn = api.uwSetLogCallback((data) => {
                        parentPort.postMessage({
                            action: 'uwSetLogCallback',
                            data: [data],
                        });
                    });
                    callbacksMap.set('uwSetLogCallback', cleanFn);
                    break;
                }
                case 'uwSetExceptionCallback': {
                    if (callbacksMap.has('uwSetExceptionCallback')) {
                        break;
                    }
                    const cleanFn = api.uwSetExceptionCallback((data) => {
                        parentPort.postMessage({
                            action: 'uwSetExceptionCallback',
                            data: [data],
                        });
                    });
                    callbacksMap.set('uwSetExceptionCallback', cleanFn);
                    break;
                }
                case 'uwLog': {
                    api.uwLog.apply(api, parameters);
                    break;
                }
                case 'uwSetPlayerName': {
                    break;
                }
                case 'uwSetPlayerColor': {
                    break;
                }
                case 'uwSetConnectStartGui': {
                    break;
                }
                case 'uwSetConnectAsObserver': {
                    break;
                }
                case 'uwConnectFindLan': {
                    break;
                }
                case 'uwConnectDirect': {
                    break;
                }
                case 'uwConnectLobbyId': {
                    break;
                }
                case 'uwConnectNewServer': {
                    break;
                }
                case 'uwTryReconnect': {
                    break;
                }
                case 'uwDisconnect': {
                    break;
                }
                case 'uwSetConnectionStateCallback': {
                    break;
                }
                case 'uwSetGameStateCallback': {
                    break;
                }
                case 'uwSetUpdateCallback': {
                    break;
                }
                case 'uwSetMapStateCallback': {
                    break;
                }
                case 'uwSetShootingCallback': {
                    break;
                }
                case 'uwMyPlayer': {
                    break;
                }
                case 'uwModifiedEntities': {
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
