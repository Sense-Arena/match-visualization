import { capitalizeFirstLetter } from '@core/utils/capitalize';
import { objKeys } from '@core/utils/mapping';
import { clsx, Select } from '@sensearena/ui';
import { useStore, useStoreMap } from 'effector-react';
import { memo, useEffect } from 'react';
import { calcsLoading } from '../calc.ms';
import { extractCombinedKey } from '../calculations/operations';
import { $msSettings, saveOpponentConfig } from '../store.ms';
import { OpponentCfgPayload } from '../types';
import { stStyles } from './st.css';
import { useOpponentConfigFields } from './useConfigFields';

export const OpponentConfigForm = memo(() => {
  const loading = useStore(calcsLoading);

  const { trade } = useStoreMap({
    store: $msSettings,
    keys: [],
    fn: state => {
      const { tradeOrder } = extractCombinedKey(state.courtStepsHistory.at(-1));

      return {
        trade: state.unityTradesA.find(t => t.order === tradeOrder),
      };
    },
  });

  const preparedSelectFields = useOpponentConfigFields();

  useEffect(() => {
    if (!preparedSelectFields || !trade || loading) return;
    saveOpponentConfig(
      objKeys(preparedSelectFields).reduce((acc, next) => {
        const nextValue = trade.config.opponent[next] ?? preparedSelectFields[next]!.dv;
        acc[next] =
          next === 'serve_speed'
            ? typeof nextValue === 'string'
              ? nextValue
              : `${nextValue[0]}__${nextValue[1]}`
            : nextValue;
        return acc;
      }, {} as OpponentCfgPayload),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  if (!preparedSelectFields || loading) {
    return null;
  }

  const keysArr = objKeys(preparedSelectFields);

  return (
    <div>
      {keysArr.map(sfk => {
        const value = trade?.config.opponent[sfk] ?? preparedSelectFields[sfk]?.dv;
        const renderValue = sfk === 'serve_speed' ? (typeof value === 'string' ? value : `${value[0]}__${value[1]}`) : value;
        return (
          <Select
            key={sfk}
            label={capitalizeFirstLetter(sfk.replace('_', ' '))}
            selectedOption={renderValue}
            selectedOptionLabel={preparedSelectFields[sfk]?.ops.find(o => o.value === renderValue)?.title ?? ''}
            options={preparedSelectFields[sfk]?.ops ?? []}
            value={renderValue}
            onChangeSelect={value =>
              saveOpponentConfig({
                [sfk]: value,
              })
            }
            fullWidth
            className={clsx(keysArr.at(-1) === sfk ? undefined : stStyles.mb1, stStyles.selectWidth)}
          />
        );
      })}
    </div>
  );
});

OpponentConfigForm.displayName = 'OpponentConfigForm';
