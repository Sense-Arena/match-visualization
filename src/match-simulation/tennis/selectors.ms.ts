import { combine } from 'effector';
import { $msUI } from './calc.ms';
import { extractCombinedKey } from './calculations/operations';
import { $msSettings } from './store.ms';

export const $prevTrades = combine([$msUI, $msSettings], ([infos, msSettings]) => {
  const { tradeOrder } = extractCombinedKey(msSettings.courtStepsHistory.at(-1));

  return infos.filter(t => t.tradeOrder < tradeOrder);
});
