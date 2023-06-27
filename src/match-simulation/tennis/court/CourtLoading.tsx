import { Spinner } from '@sensearena/ui';
import { useStore } from 'effector-react';
import { memo } from 'react';
import { calcsLoading } from '../calc.ms';
import { stStyles } from './st.css';

export const CourtLoading = memo(() => {
  const loading = useStore(calcsLoading);

  if (!loading) return null;

  return (
    <div className={stStyles.loading}>
      <Spinner size="l" />
    </div>
  );
});

CourtLoading.displayName = 'CourtLoading';
