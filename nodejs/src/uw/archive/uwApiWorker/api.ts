import path from 'node:path';
import { Worker, threadId } from 'node:worker_threads';
import { IUWApi } from '../uwApi.type';
import {
    UW_VERSION,
} from '../ffiRs/uwApiFFIRS';
import { UwWorkerMessage } from '../workerMessage.type';
import { UnregisterUwCallback } from '../types';
import { Severity } from '../helpers';

console.log('MAIN THREAD ID', threadId);



export type UwApi = IUWApi;

async function createUWApi(
    steamPath: string,
    isHardened = false,
): Promise<UwApi> {
    const callbacksMap = new Map<string, Function>();

    const worker = new Worker(path.resolve(__dirname, 'uwApiWorker.js'), {
        workerData: {
            steamPath,
            isHardened,
        },
        stdout: true,
        stderr: true,
    });

    worker.on('error', (error) => {
        console.error('SHIT HAPPENS', error);
    });
    worker.on('exit', (exitCode) => {
        if (exitCode !== 0) {
            console.error('WORKER DIES WITH PAIN', exitCode);
        }
        console.log('WORKER ENDED');
    });

    worker.on('message', (message: UwWorkerMessage) => {
        if (message.action.startsWith('uw')) {
            if (!callbacksMap.has(message.action)) {
                return;
            }
            callbacksMap.get(message.action)!(...message.data);
            return;
        }
        switch(message.action) {
            default: {
                console.warn(`unknown action from worker ${message.action}`);
            }
        }
    });

    function callWorkerFunction(name: string, ...parameters: unknown[]) {
        worker.postMessage({
            action: 'uwApi',
            data: {
                name,
                parameters,
            },
        });
    }

    function createCallbackRegisterCall(name: string) {
        return (callback: Function): UnregisterUwCallback => {
            callbacksMap.set(name, callback);
            callWorkerFunction(name);
            return () => {
                callbacksMap.delete(name);
                callWorkerFunction('uwRemoveCallback', name);
            };
        }
    }

    function callWorkerFunctionWithReturn<R>(name: string, ...params: unknown[]): Promise<R> {
        // TODO: MULTIPLE CALLS?
        return new Promise<R>((resolve, _) => {
            const callback = (arg: R) => {
                // clean
                callbacksMap.delete(name);
                resolve(arg);
            };
            callbacksMap.set(name, callback);
            callWorkerFunction(name, ...params);
        });
    }

    return {
        UW_VERSION,
        uwInitialize: (version: number) => {
            callWorkerFunction('uwInitialize', version);
        },
        uwDeinitialize: () => {
            callWorkerFunction('uwDeinitialize');
        },
        uwSetLogCallback: createCallbackRegisterCall('uwSetLogCallback'),
        uwSetExceptionCallback: createCallbackRegisterCall('uwSetExceptionCallback'),
        uwLog: (severity: Severity, message: string) => {
            callWorkerFunction('uwLog', severity, message);
        },

        uwSetPlayerName: (name: string) => {
            callWorkerFunction('uwSetPlayerName', name);
        },

        uwSetPlayerColor: (r: number, g: number, b: number) => {
            callWorkerFunction('uwSetPlayerColor', r, g, b);
        },

        uwSetConnectStartGui: (start?: boolean, extra?: string) => {
            callWorkerFunction('uwSetConnectStartGui', start, extra);
        },

        uwSetConnectAsObserver: (observer: boolean) => {
            callWorkerFunction('uwSetConnectAsObserver', observer);
        },

        uwConnectFindLan: (timeoutMicroseconds?: number) => {
            return callWorkerFunctionWithReturn('uwConnectFindLan', timeoutMicroseconds);
        },

        uwConnectDirect: (address: string, port: number) => {
            callWorkerFunction('uwConnectDirect', address, port);
        },

        uwConnectLobbyId: (lobbyId: number) => {
            callWorkerFunction('uwConnectLobbyId', lobbyId);
        },

        uwConnectNewServer: (visibility?: number, name?: string, extraParams?: string) => {
            callWorkerFunction('uwConnectNewServer', visibility, name, extraParams);
        },

        uwTryReconnect: () => {
            return callWorkerFunctionWithReturn('uwTryReconnect');
        },

        uwDisconnect: () => {
            callWorkerFunction('uwDisconnect');
        },

        // Game state & callbacks
        uwSetConnectionStateCallback: createCallbackRegisterCall('uwSetConnectionStateCallback'),
        uwSetGameStateCallback: createCallbackRegisterCall('uwSetGameStateCallback'),
        uwSetUpdateCallback: createCallbackRegisterCall('uwSetUpdateCallback'),
        uwSetMapStateCallback: createCallbackRegisterCall('uwSetMapStateCallback'),
        uwSetShootingCallback: createCallbackRegisterCall('uwSetShootingCallback'),
        // my player
        uwMyPlayer: () => {
            return callWorkerFunctionWithReturn('uwMyPlayer');
        },

        // entities
        uwModifiedEntities: () => {
            return callWorkerFunctionWithReturn('uwModifiedEntities');
        },

        cleanup: () => {
            callWorkerFunction('cleanup');
            callbacksMap.clear();
        },
    };
}

export default createUWApi;
