'use client';
import { memo } from 'react';

import StandardHeader from '@components/StandardHeader';
import { PlayListEditorIcon } from '@lib/common/icons';
import ChannelGroupVideoStreamDataSelector from './ChannelGroupVideoStreamDataSelector';
import PlayListDataSelector from './PlayListDataSelector';

const PlayListEditor = () => {
  const id = 'playlisteditor';

  return (
    <StandardHeader className="playListEditor" displayName="PLAYLIST" icon={<PlayListEditorIcon />}>
      <div className="col-4 m-0 p-0 pr-1">
        <PlayListDataSelector id={id} />
      </div>
      <div className="col-8 m-0 p-0">
        <ChannelGroupVideoStreamDataSelector id={id} />
      </div>
    </StandardHeader>
  );
};

PlayListEditor.displayName = 'Playlist Editor';

export default memo(PlayListEditor);
