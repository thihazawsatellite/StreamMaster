import { getChannelGroupMenuItem } from '@lib/common/common';
import {
  ChannelGroupDto,
  StreamGroupChannelGroupSyncStreamGroupChannelGroupsApiArg,
  useChannelGroupsGetChannelGroupIdNamesQuery,
  useStreamGroupChannelGroupGetChannelGroupsFromStreamGroupQuery,
  useStreamGroupChannelGroupSyncStreamGroupChannelGroupsMutation,
} from '@lib/iptvApi';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';

type StreamGroupChannelGroupsInputs = {
  readonly className?: string;
  readonly streamGroupId: number | undefined;
};

const StreamGroupChannelGroupsSelector = ({ className, streamGroupId }: StreamGroupChannelGroupsInputs) => {
  const { data: selectedData } = useStreamGroupChannelGroupGetChannelGroupsFromStreamGroupQuery(
    streamGroupId === undefined ? skipToken : streamGroupId > 0 ? streamGroupId : skipToken,
  );
  const { data: channelGroups } = useChannelGroupsGetChannelGroupIdNamesQuery();

  const [syncStreamGroupChannelGroupsMutation, { isLoading }] = useStreamGroupChannelGroupSyncStreamGroupChannelGroupsMutation();

  return (
    <div className={`"flex w-full ${className}"`}>
      <MultiSelect
        className="sm-selector flex w-full"
        disabled={isLoading}
        filter
        filterInputAutoFocus
        itemTemplate={(option) => getChannelGroupMenuItem(option.name, option.name + '  |  ' + option.totalCount)}
        maxSelectedLabels={1}
        onChange={async (e: MultiSelectChangeEvent) => {
          const toSend = {} as StreamGroupChannelGroupSyncStreamGroupChannelGroupsApiArg;
          toSend.streamGroupId = streamGroupId;
          toSend.channelGroupIds = e.value;
          await syncStreamGroupChannelGroupsMutation(toSend)
            .then(() => {})
            .catch((error) => {
              console.error(error);
            });
        }}
        optionLabel="name"
        optionValue="id"
        options={channelGroups}
        placeholder="Groups"
        scrollHeight="40vh"
        selectedItemsLabel="{0} groups selected"
        showSelectAll={false}
        value={selectedData?.map((x: ChannelGroupDto) => x.id) ?? []}
      />
    </div>
  );
};

export default StreamGroupChannelGroupsSelector;
