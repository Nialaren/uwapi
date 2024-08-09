import { IUWApi } from './uwApi.type';
import {
    createUWApi as createUWApiFFIRS,
} from './uwApiFFIRs/uwApiFFIRS';

export type UwApi = IUWApi;

async function createUWApi(
    steamPath: string,
    isHardened = false,
): Promise<UwApi> {
    return createUWApiFFIRS(steamPath, isHardened);
}

export default createUWApi;
