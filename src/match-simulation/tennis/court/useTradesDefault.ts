import { useStoreMap } from 'effector-react';
import { useEffect } from 'react';
import { calcDefaultPositions } from '../calc.ms';
import { extractCombinedKey } from '../calculations/operations';
import { $msSettings } from '../store.ms';

export const useTradesDefault = () => {
  const { tradeOrder, img } = useStoreMap({
    store: $msSettings,
    keys: [],
    fn: state => {
      const { tradeOrder } = extractCombinedKey(state.courtStepsHistory.at(-1));

      return {
        tradeOrder,
        img: state.img,
      };
    },
  });

  useEffect(() => {
    if (!img.width || !img.height) return;
    calcDefaultPositions();
  }, [tradeOrder, img]);
};
