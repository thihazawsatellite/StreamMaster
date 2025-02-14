import ChannelGroupAddDialog from '@components/channelGroups/ChannelGroupAddDialog';
import ChannelGroupDeleteDialog from '@components/channelGroups/ChannelGroupDeleteDialog';
import ChannelGroupEditDialog from '@components/channelGroups/ChannelGroupEditDialog';
import ChannelGroupVisibleDialog from '@components/channelGroups/ChannelGroupVisibleDialog';
import DataSelector from '@components/dataSelector/DataSelector';
import { ColumnMeta } from '@components/dataSelector/DataSelectorTypes';
import { TriSelectShowHidden } from '@components/selectors/TriSelectShowHidden';
import { ChannelGroupDto, useChannelGroupsGetPagedChannelGroupsQuery } from '@lib/iptvApi';
import { useShowHidden } from '@lib/redux/slices/useShowHidden';
import { memo, useCallback, useEffect, useMemo } from 'react';

export type PlayListDataSelectorProps = {
  readonly hideAddRemoveControls?: boolean;
  readonly hideControls?: boolean;
  readonly id: string;
  readonly name?: string;
  readonly useReadOnly?: boolean;
};

const PlayListDataSelector = ({
  hideAddRemoveControls = false,
  hideControls = false,
  id,
  name = 'Playlist',
  useReadOnly = true,
}: PlayListDataSelectorProps) => {
  const dataKey = id + '-PlayListDataSelector';
  const { showHidden, setShowHidden } = useShowHidden(dataKey);

  // const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (showHidden === undefined && showHidden !== null) {
      setShowHidden(null);
    }
  }, [setShowHidden, showHidden]);

  const sourceActionBodyTemplate = useCallback(
    (data: ChannelGroupDto) => (
      <div className="flex p-0 justify-content-end align-items-center">
        <div hidden={data.isReadOnly === true && useReadOnly}>
          <ChannelGroupDeleteDialog iconFilled={false} id={dataKey} value={data} />
        </div>

        <ChannelGroupEditDialog value={data} />
        <ChannelGroupVisibleDialog id={dataKey} skipOverLayer value={data} />
      </div>
    ),
    [dataKey, useReadOnly],
  );

  const columns = useMemo((): ColumnMeta[] => {
    return [
      { field: 'name', filter: true, sortable: true },
      {
        field: 'streams',
        fieldType: 'streams',
        header: 'Streams (active/total)',
        width: '6rem',
      },
      {
        align: 'right',
        bodyTemplate: sourceActionBodyTemplate,
        field: 'isHidden',
        fieldType: 'isHidden',
        header: 'Actions',
        width: '8rem',
      },
    ];
  }, [sourceActionBodyTemplate]);

  const sourceRightHeaderTemplate = useCallback(() => {
    return (
      <div className="flex justify-content-end align-items-center w-full gap-1">
        {hideControls !== true && (
          <>
            <TriSelectShowHidden dataKey={dataKey} />
            <ChannelGroupVisibleDialog id={dataKey} skipOverLayer={false} />
            <ChannelGroupDeleteDialog iconFilled id={dataKey} />
          </>
        )}

        <ChannelGroupAddDialog />
      </div>
    );
  }, [hideControls, dataKey]);

  return (
    <DataSelector
      columns={columns}
      defaultSortField="name"
      emptyMessage="No Channel Groups"
      headerName={name === undefined ? 'Playlist' : name}
      headerRightTemplate={hideAddRemoveControls === true ? null : sourceRightHeaderTemplate()}
      hideControls={hideControls}
      id={dataKey}
      // onSelectionChange={(value, selectAll) => {
      //   console.log('onSelectionChange', value, selectAll);
      //   dispatch(iptvApi.util.invalidateTags(['ChannelGroups']));
      // }}
      queryFilter={useChannelGroupsGetPagedChannelGroupsQuery}
      selectedItemsKey="selectSelectedChannelGroupDtoItems"
      selectionMode="multiple"
      style={{ height: 'calc(100vh - 40px)' }}
    />
  );
};

PlayListDataSelector.displayName = 'Play List Editor';

export default memo(PlayListDataSelector);
