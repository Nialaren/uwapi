import path from 'node:path';
import { fork,  } from 'node:child_process';
import { IUWApi } from '../uwApi.type';
import {
    UW_VERSION,
} from '../uwApiFFIRs/uwApiFFIRS';
import { UwWorkerMessage } from '../workerMessage.type';
import { UnregisterUwCallback } from '../types';
import { Severity } from '../helpers';
import { IInitMessage } from './message.type';


export type UwApi = IUWApi;

async function createUWApi(
    steamPath: string,
    isHardened = false,
): Promise<UwApi> {

    const callbacksMap = new Map<string, Function>();

    const childProcess = fork(path.resolve(__dirname, 'uwChildProcess.js'), {
        // stdio: 'ignore',
    });

    childProcess.on('error', (error) => {
        console.error('SHIT HAPPENS', error);
    });

    childProcess.on('exit', (exitCode) => {
        if (exitCode !== 0) {
            console.error('WORKER DIES WITH PAIN', exitCode);
        }
        console.log('WORKER ENDED');
    });

    childProcess.on('message', (message: UwWorkerMessage) => {
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

    /**
     * SEND INITIALIZE MESSAGE
     */
    childProcess.send({
        action: 'init',
        data: {
            steamPath,
            isHardened,
        },
    } satisfies IInitMessage);

    function callWorkerFunction(name: string, ...parameters: unknown[]) {
        childProcess.send({
            action: 'uwApi',
            data: {
                name,
                parameters: parameters.filter((param) => typeof param !== 'undefined'),
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
        // TODO: multiple calls?
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
        uwInitialize: async (version: number) => {
            callWorkerFunction('uwInitialize', version);
        },
        uwDeinitialize: async () => {
            callWorkerFunction('uwDeinitialize');
        },
        uwSetLogCallback: createCallbackRegisterCall('uwSetLogCallback'),
        uwSetExceptionCallback: createCallbackRegisterCall('uwSetExceptionCallback'),
        uwLog: async (severity: Severity, message: string) => {
            callWorkerFunction('uwLog', severity, message);
        },

        uwSetPlayerName: async (name: string) => {
            callWorkerFunction('uwSetPlayerName', name);
        },

        uwSetPlayerColor: async (r: number, g: number, b: number) => {
            callWorkerFunction('uwSetPlayerColor', r, g, b);
        },

        uwSetConnectStartGui: async (start?: boolean, extra?: string) => {
            callWorkerFunction('uwSetConnectStartGui', start, extra);
        },

        uwSetConnectAsObserver: async (observer: boolean) => {
            callWorkerFunction('uwSetConnectAsObserver', observer);
        },

        uwConnectFindLan: (timeoutMicroseconds = 3_000_000) => {
            return callWorkerFunctionWithReturn('uwConnectFindLan', timeoutMicroseconds);
        },

        uwConnectDirect: async (address: string, port: number) => {
            callWorkerFunction('uwConnectDirect', address, port);
        },

        uwConnectLobbyId: async (lobbyId: number) => {
            callWorkerFunction('uwConnectLobbyId', lobbyId);
        },

        uwConnectNewServer: async (visibility?: number, name?: string, extraParams?: string) => {
            callWorkerFunction('uwConnectNewServer', visibility, name, extraParams);
        },

        uwTryReconnect: () => {
            return callWorkerFunctionWithReturn('uwTryReconnect');
        },

        uwDisconnect: async () => {
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

        cleanup: async () => {
            callWorkerFunction('cleanup');
            callbacksMap.clear();
            return new Promise((resolve) => {
                setTimeout(() => {
                    childProcess.kill();
                    resolve();
                }, 1000);
            });
        },
    } as IUWApi;
}

export default createUWApi;
