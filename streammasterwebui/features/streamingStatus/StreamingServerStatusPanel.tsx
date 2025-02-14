import DataSelector from '@components/dataSelector/DataSelector';
import { ColumnMeta } from '@components/dataSelector/DataSelectorTypes';
import { VideoStreamSelector } from '@components/videoStream/VideoStreamSelector';
import { formatJSONDateString, getIconUrl, getTopToolOptions } from '@lib/common/common';
import {
  ChangeVideoStreamChannelRequest,
  SimulateStreamFailureRequest,
  StreamStatisticsResult,
  useVideoStreamsGetAllStatisticsForAllUrlsQuery,
} from '@lib/iptvApi';
import { ChangeVideoStreamChannel, SimulateStreamFailure } from '@lib/smAPI/VideoStreams/VideoStreamsMutateAPI';
import useSettings from '@lib/useSettings';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { memo, useCallback, useMemo, useRef, type CSSProperties } from 'react';

type StreamingServerStatusPanelProps = {
  readonly className?: string;
  readonly style?: CSSProperties;
};

export const StreamingServerStatusPanel = ({ className, style }: StreamingServerStatusPanelProps) => {
  const setting = useSettings();
  const toast = useRef<Toast>(null);

  const getStreamingStatus = useVideoStreamsGetAllStatisticsForAllUrlsQuery();

  const onChangeVideoStreamChannel = useCallback(async (playingVideoStreamId: string, newVideoStreamId: string) => {
    if (playingVideoStreamId === undefined || playingVideoStreamId === '' || newVideoStreamId === undefined || newVideoStreamId === '') {
      return;
    }

    var toSend = {} as ChangeVideoStreamChannelRequest;

    toSend.playingVideoStreamId = playingVideoStreamId;
    toSend.newVideoStreamId = newVideoStreamId;

    await ChangeVideoStreamChannel(toSend)
      .then(() => {
        if (toast.current) {
          toast.current.show({
            detail: `Changed Client Channel`,
            life: 3000,
            severity: 'success',
            summary: 'Successful',
          });
        }
      })
      .catch(() => {
        if (toast.current) {
          toast.current.show({
            detail: `Failed Client Channel`,
            life: 3000,
            severity: 'error',
            summary: 'Error',
          });
        }
      });
  }, []);

  const videoStreamTemplate = useCallback(
    (rowData: StreamStatisticsResult) => {
      return (
        <VideoStreamSelector
          onChange={async (e) => {
            await onChangeVideoStreamChannel(rowData.videoStreamId ?? '', e.id);
          }}
          value={rowData.m3UStreamName}
        />
      );
    },
    [onChangeVideoStreamChannel],
  );

  const onFailStream = useCallback(async (rowData: StreamStatisticsResult) => {
    if (!rowData.streamUrl || rowData.streamUrl === undefined || rowData.streamUrl === '') {
      return;
    }

    var toSend = {} as SimulateStreamFailureRequest;
    toSend.streamUrl = rowData.streamUrl;

    await SimulateStreamFailure(toSend)
      .then(() => {
        if (toast.current) {
          toast.current.show({
            detail: `Next Stream`,
            life: 3000,
            severity: 'success',
            summary: 'Successful',
          });
        }
      })
      .catch(() => {
        if (toast.current) {
          toast.current.show({
            detail: `Next Stream Failed`,
            life: 3000,
            severity: 'error',
            summary: 'Error',
          });
        }
      });
  }, []);

  const imageBodyTemplate = useCallback(
    (rowData: StreamStatisticsResult) => {
      const iconUrl = getIconUrl(rowData.logo, setting.defaultIcon, setting.cacheIcon);

      return (
        <div className="flex align-content-center flex-wrap">
          <img alt={rowData.logo ?? 'logo'} className="flex align-items-center justify-content-center max-w-full max-h-2rem h-2rem" src={iconUrl} />
        </div>
      );
    },
    [setting],
  );

  const inputBitsPerSecondTemplate = useCallback((rowData: StreamStatisticsResult) => {
    if (rowData.inputBitsPerSecond === undefined) return <div>0</div>;

    const kbps = rowData.inputBitsPerSecond / 1000;
    const roundedKbps = Math.ceil(kbps);

    return <div>{roundedKbps.toLocaleString('en-US')}</div>;
  }, []);

  const inputElapsedTimeTemplate = useCallback((rowData: StreamStatisticsResult) => {
    return <div>{rowData.inputElapsedTime?.split('.')[0]}</div>;
  }, []);

  const inputStartTimeTemplate = useCallback((rowData: StreamStatisticsResult) => {
    return <div>{formatJSONDateString(rowData.inputStartTime ?? '')}</div>;
  }, []);

  const dataSource = useMemo((): StreamStatisticsResult[] => {
    if (getStreamingStatus.data === undefined || getStreamingStatus.data.length === 0 || getStreamingStatus.data === null) {
      return [];
    }

    let data = [] as StreamStatisticsResult[];

    getStreamingStatus.data.forEach((item) => {
      if (data.findIndex((x) => x.m3UStreamId === item.m3UStreamId) === -1) {
        data.push(item);
      }
    });

    return data;
  }, [getStreamingStatus.data]);

  const streamCount = useCallback(
    (rowData: StreamStatisticsResult) => {
      if (getStreamingStatus.data === undefined || getStreamingStatus.data === null) {
        return <div>0</div>;
      }
      return <div>{getStreamingStatus.data.filter((x) => x.m3UStreamId === rowData.m3UStreamId).length}</div>;
    },
    [getStreamingStatus.data],
  );

  const targetActionBodyTemplate = useCallback(
    (rowData: StreamStatisticsResult) => {
      return (
        <div className="dataselector p-inputgroup align-items-center justify-content-end">
          <Button
            // className="p-button-danger"
            icon="pi pi-angle-right"
            onClick={async () => await onFailStream(rowData)}
            rounded
            text
            tooltip="Next Stream"
            tooltipOptions={getTopToolOptions}
          />
        </div>
      );
    },
    [onFailStream],
  );

  const sourceColumns = useMemo((): ColumnMeta[] => {
    return [
      {
        bodyTemplate: imageBodyTemplate,
        field: 'icon',
        style: {
          maxWidth: '4rem',
          width: '4rem',
        } as CSSProperties,
      },

      { field: 'videoStreamName', header: 'Name' },
      {
        align: 'center',
        bodyTemplate: videoStreamTemplate,
        field: 'videoStreamTemplate',
        header: 'Video Stream',
        style: {
          maxWidth: '18rem',
          width: '18rem',
        } as CSSProperties,
      },
      {
        align: 'center',
        field: 'rank',
        header: 'Rank',
        style: {
          maxWidth: '4rem',
          width: '4rem',
        } as CSSProperties,
      },

      {
        align: 'center',
        bodyTemplate: streamCount,
        field: 'Count',
        header: 'Count',
        style: {
          maxWidth: '4rem',
          width: '4rem',
        } as CSSProperties,
      },
      {
        align: 'center',
        bodyTemplate: inputBitsPerSecondTemplate,
        field: 'inputBitsPerSecond',
        header: 'Input kbps',
        style: {
          maxWidth: '10rem',
          width: '10rem',
        } as CSSProperties,
      },
      {
        align: 'center',
        bodyTemplate: inputElapsedTimeTemplate,
        field: 'inputElapsedTime',
        header: 'Input Elapsed',
        style: {
          maxWidth: '10rem',
          width: '10rem',
        } as CSSProperties,
      },
      {
        align: 'center',
        bodyTemplate: inputStartTimeTemplate,
        field: 'inputStartTime',
        header: 'Input Start',
        style: {
          maxWidth: '10rem',
          width: '10rem',
        } as CSSProperties,
      },
      {
        align: 'center',
        bodyTemplate: targetActionBodyTemplate,
        field: 'Actions',
        style: {
          maxWidth: '8rem',
          width: '8rem',
        } as CSSProperties,
      },
    ];
  }, [
    imageBodyTemplate,
    inputBitsPerSecondTemplate,
    inputElapsedTimeTemplate,
    inputStartTimeTemplate,
    streamCount,
    targetActionBodyTemplate,
    videoStreamTemplate,
  ]);

  return (
    <>
      <Toast position="bottom-right" ref={toast} />
      <div className="m3uFilesEditor flex flex-column col-12 flex-shrink-0 ">
        <DataSelector
          className={className}
          columns={sourceColumns}
          dataSource={dataSource}
          defaultSortField="m3UStreamName"
          emptyMessage="No Streams"
          id="StreamingServerStatusPanel"
          isLoading={getStreamingStatus.isLoading}
          key="m3UStreamId"
          selectedItemsKey="selectSelectedItems"
          style={style}
        />
      </div>
    </>
  );
};

StreamingServerStatusPanel.displayName = 'Streaming Server Status';

export default memo(StreamingServerStatusPanel);
