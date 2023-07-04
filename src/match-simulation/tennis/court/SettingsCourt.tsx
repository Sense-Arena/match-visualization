import { Divider, Paragraph } from '@sensearena/ui';
import { ActionableCourt } from './ActionableCourt';
import { SettingsCourtBtns, SettingsCourtBtnsProps } from './SettingsCourtBtns';
import { oppSideId } from './constants';
import { stStyles } from './st.css';

type Props = SettingsCourtBtnsProps;

export const SettingsCourt = ({ createMS, editMS, goBack, loading, id }: Props) => {
  return (
    <div>
      <Divider className={stStyles.sideTextWrap.top}>
        <Paragraph variant="caption" id={oppSideId}>
          Opponent side
        </Paragraph>
      </Divider>
      <div className={stStyles.courtWrap}>
        <ActionableCourt />
      </div>
      <Divider className={stStyles.sideTextWrap.bottom}>
        <Paragraph variant="caption">My side</Paragraph>
      </Divider>

      <SettingsCourtBtns createMS={createMS} editMS={editMS} goBack={goBack} loading={loading} id={id} />
    </div>
  );
};