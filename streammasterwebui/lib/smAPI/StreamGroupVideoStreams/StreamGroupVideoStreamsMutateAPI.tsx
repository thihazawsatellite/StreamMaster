/* eslint unused-imports/no-unused-imports-ts: off */
/* eslint @typescript-eslint/no-unused-vars: off */
import { invokeHubConnection } from '@/lib/signalr/signalr';
import type * as iptv from '@/lib/iptvApi';

export const SetVideoStreamRanks = async (arg: iptv.SetVideoStreamRanksRequest): Promise<void | null> => {
    await invokeHubConnection<void> ('SetVideoStreamRanks', arg);
};

export const SyncVideoStreamToStreamGroupPOST = async (arg: iptv.SyncVideoStreamToStreamGroupRequest): Promise<void | null> => {
    await invokeHubConnection<void> ('SyncVideoStreamToStreamGroupPOST', arg);
};

export const SyncVideoStreamToStreamGroupDELETE = async (arg: iptv.SyncVideoStreamToStreamGroupRequest): Promise<void | null> => {
    await invokeHubConnection<void> ('SyncVideoStreamToStreamGroupDELETE', arg);
};

export const SetStreamGroupVideoStreamChannelNumbers = async (arg: iptv.SetStreamGroupVideoStreamChannelNumbersRequest): Promise<void | null> => {
    await invokeHubConnection<void> ('SetStreamGroupVideoStreamChannelNumbers', arg);
};

