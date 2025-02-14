import { formatJSONDateString, getTopToolOptions } from '@lib/common/common';
import { useEpgFilesGetPagedEpgFilesQuery, useEpgFilesUpdateEpgFileMutation, type EpgFileDto, type M3UFileDto, type UpdateEpgFileRequest } from '@lib/iptvApi';
import { Checkbox, type CheckboxChangeEvent } from 'primereact/checkbox';
import { Toast } from 'primereact/toast';
import { memo, useCallback, useMemo, useRef } from 'react';
import NumberEditorBodyTemplate from '../NumberEditorBodyTemplate';
import StringEditorBodyTemplate from '../StringEditorBodyTemplate';
import DataSelector from '../dataSelector/DataSelector';
import { type ColumnMeta } from '../dataSelector/DataSelectorTypes';
import EPGFileRefreshDialog from './EPGFileRefreshDialog';
import EPGFileRemoveDialog from './EPGFileRemoveDialog';

const EPGFilesDataSelector = () => {
  const toast = useRef<Toast>(null);

  const [epgFilesUpdateEpgFileMutation] = useEpgFilesUpdateEpgFileMutation();

  const onEPGUpdateClick = useCallback(
    async (id: number, auto?: boolean | null, hours?: number | null, name?: string | null, url?: string | null) => {
      if (id < 1) {
        return;
      }

      if (auto === undefined && !url && !hours && !name) {
        return;
      }

      const tosend = {} as UpdateEpgFileRequest;

      tosend.id = id;

      if (auto !== undefined) {
        tosend.autoUpdate = auto;
      }

      if (hours) {
        tosend.hoursToUpdate = hours;
      }

      if (name) {
        tosend.name = name;
      }

      if (url !== undefined) {
        tosend.url = url;
      }

      await epgFilesUpdateEpgFileMutation(tosend)
        .then(() => {
          if (toast.current) {
            toast.current.show({
              detail: `EPG File Update Successful`,
              life: 3000,
              severity: 'success',
              summary: 'Successful',
            });
          }
        })
        .catch((e) => {
          if (toast.current) {
            toast.current.show({
              detail: `EPG File Update Failed`,
              life: 3000,
              severity: 'error',
              summary: 'Error ' + e.message,
            });
          }
        });
    },
    [epgFilesUpdateEpgFileMutation],
  );

  const lastDownloadedTemplate = useCallback((rowData: EpgFileDto) => {
    if (rowData.id === 0) {
      return <div />;
    }

    return <div className="flex justify-content-center ">{formatJSONDateString(rowData.lastDownloaded ?? '')}</div>;
  }, []);

  const nameEditorBodyTemplate = useCallback(
    (rowData: EpgFileDto) => {
      if (rowData.id === 0) {
        return (
          <div
            className="p-0 relative"
            style={{
              ...{
                backgroundColor: 'var(--mask-bg)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              },
            }}
          >
            {rowData.name}
          </div>
        );
      }

      return (
        <StringEditorBodyTemplate
          onChange={async (e) => {
            await onEPGUpdateClick(rowData.id, null, null, e);
          }}
          value={rowData.name}
        />
      );
    },
    [onEPGUpdateClick],
  );

  const programmeCountTemplate = useCallback((rowData: EpgFileDto) => {
    if (rowData.id === 0) {
      return <div />;
    }

    return <div>{rowData.programmeCount}</div>;
  }, []);

  const targetActionBodyTemplate = useCallback(
    (rowData: EpgFileDto) => {
      if (rowData.id === 0) {
        return <div />;
      }

      return (
        <div className="flex grid p-0 justify-content-end align-items-center">
          <div className="col-8 flex p-0 justify-content-between align-items-center">
            <div className="col-8 flex p-0 justify-content-between align-items-center">
              <Checkbox
                checked={rowData.autoUpdate}
                onChange={async (e: CheckboxChangeEvent) => {
                  await onEPGUpdateClick(rowData.id, e.checked ?? false);
                }}
                tooltip="Enable Auto Update"
                tooltipOptions={getTopToolOptions}
              />

              <NumberEditorBodyTemplate
                onChange={async (e) => {
                  await onEPGUpdateClick(rowData.id, null, e);
                }}
                suffix=" hours"
                value={rowData.hoursToUpdate}
              />
            </div>
          </div>
          <div className="col-4 p-0 justify-content-end align-items-center">
            <EPGFileRefreshDialog selectedFile={rowData} />
            <EPGFileRemoveDialog selectedFile={rowData} />
          </div>
        </div>
      );
    },
    [onEPGUpdateClick],
  );

  const urlEditorBodyTemplate = useCallback(
    (rowData: M3UFileDto) => {
      if (rowData.id === 0) {
        return (
          <div
            className="p-0 relative"
            style={{
              ...{
                backgroundColor: 'var(--mask-bg)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              },
            }}
          >
            {rowData.url}
          </div>
        );
      }

      return (
        <StringEditorBodyTemplate
          onChange={async (e) => {
            await onEPGUpdateClick(rowData.id, null, null, null, e);
          }}
          tooltip={rowData.url}
          value={rowData.url}
        />
      );
    },
    [onEPGUpdateClick],
  );

  const columns = useMemo((): ColumnMeta[] => {
    return [
      {
        bodyTemplate: nameEditorBodyTemplate,
        field: 'name',
        filter: true,
        header: 'Name',
        sortable: true,
        width: '32rem',
      },
      {
        bodyTemplate: lastDownloadedTemplate,
        field: 'lastDownloaded',
        header: 'Downloaded',
        sortable: true,
        width: '12rem',
      },
      {
        bodyTemplate: programmeCountTemplate,
        field: 'programmeCount',
        header: 'Programmes',
        sortable: true,
        width: '20rem',
      },
      { bodyTemplate: urlEditorBodyTemplate, field: 'url', sortable: true },
      {
        align: 'center',
        bodyTemplate: targetActionBodyTemplate,
        field: 'autoUpdate',
        width: '10rem',
      },
    ];
  }, [lastDownloadedTemplate, nameEditorBodyTemplate, programmeCountTemplate, targetActionBodyTemplate, urlEditorBodyTemplate]);

  return (
    <>
      <Toast position="bottom-right" ref={toast} />
      <DataSelector
        columns={columns}
        defaultSortField="name"
        emptyMessage="No EPG Files"
        id="epgfilesdataselector"
        queryFilter={useEpgFilesGetPagedEpgFilesQuery}
        selectedItemsKey="selectSelectedEPGFileDtoItems"
        style={{ height: 'calc(50vh - 120px)' }}
      />
    </>
  );
};

EPGFilesDataSelector.displayName = 'EPGFilesDataSelector';

export default memo(EPGFilesDataSelector);
