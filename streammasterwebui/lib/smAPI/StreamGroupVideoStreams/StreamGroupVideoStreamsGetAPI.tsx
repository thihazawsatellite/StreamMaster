/* eslint unused-imports/no-unused-imports-ts: off */
/* eslint @typescript-eslint/no-unused-vars: off */
import { invokeHubConnection } from '@/lib/signalr/signalr';
import type * as iptv from '@/lib/iptvApi';


export const GetStreamGroupVideoStreamIds = async (arg: iptv.VideoStreamIsReadOnly[]): Promise<iptv.VideoStreamIsReadOnly[] | null> => {
    return await invokeHubConnection<iptv.VideoStreamIsReadOnly[]> ('GetStreamGroupVideoStreamIds', arg);
};

export const GetPagedStreamGroupVideoStreams = async (arg: iptv.PagedResponseOfVideoStreamDto): Promise<iptv.VideoStreamDto[] | null> => {
    return await invokeHubConnection<iptv.VideoStreamDto[]> ('GetPagedStreamGroupVideoStreams', arg);
};

