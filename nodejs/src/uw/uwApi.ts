import { IUWApi } from './uwApi.type';
import {
    createUWApi as createUWApiFFIRS,
} from './uwApiFFIRs/uwApiFFIRS';
// import createUWApiWorker from './uwApiWorker/api';
import createUWApiFork from './uwApiFork/api';

export type UwApi = IUWApi;

async function createUWApi(
    steamPath: string,
    isHardened = false,
    runtime: 'thread' | 'default' | 'fork' = 'fork'
): Promise<UwApi> {
    if (runtime === 'default') {
        return createUWApiFFIRS(steamPath, isHardened);
    }

    // if (runtime === 'thread') {
    //     return createUWApiWorker(steamPath, isHardened);
    // }

    return createUWApiFork(steamPath, isHardened);
}

export default createUWApi;
