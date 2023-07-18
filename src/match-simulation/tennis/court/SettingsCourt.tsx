import { Divider, Paragraph } from '@sensearena/ui';
import { useRef } from 'react';
import { ActionableCourt } from './ActionableCourt';
import { SettingsCourtBtns, SettingsCourtBtnsProps } from './SettingsCourtBtns';
import { oppSideId } from './constants';
import { stStyles } from './st.css';

type Props = SettingsCourtBtnsProps & {
  basePath?: string;
};

export const SettingsCourt = ({ createMS, editMS, goBack, loading, id, basePath = '/' }: Props) => {
  const courtAreaRef = useRef<HTMLDivElement>(null);
  return (
    <div>
      <Divider className={stStyles.sideTextWrap.top}>
        <Paragraph variant="caption" id={oppSideId}>
          Opponent side
        </Paragraph>
      </Divider>
      <div className={stStyles.courtWrap} ref={courtAreaRef}>
        <ActionableCourt basePath={basePath} courtAreaRef={courtAreaRef} />
      </div>
      <Divider className={stStyles.sideTextWrap.bottom}>
        <Paragraph variant="caption">My side</Paragraph>
      </Divider>

      <SettingsCourtBtns createMS={createMS} editMS={editMS} goBack={goBack} loading={loading} id={id} />
    </div>
  );
};
