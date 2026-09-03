import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useCurrentAccount, useCurrentWorkspace } from '../../network/hooks';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  closeDiscoveryAC,
  nextDiscoveryStepAC,
  openDiscoveryModalAC,
  startDiscoveryTourAC,
} from '../../store/discoverySlice';
import { isDiscoverySeen, markDiscoverySeen } from '../../lib/discovery-storage';
import { discoverySteps } from './steps';
import { DiscoveryModal } from './DiscoveryModal';
import { DiscoveryTooltip } from './DiscoveryTooltip';

/**
 * Живёт внутри MainLayout: решает, показать ли стартовую модалку онбординга
 * первому визиту аккаунта, и ведёт пошаговый тур по разделам сайдбара/шапки.
 */
export function DiscoveryGate() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const account = useCurrentAccount();
  const workspace = useCurrentWorkspace();
  const { stage, step } = useAppSelector((s) => s.discovery);

  const accountId = account.data?.id;
  const role = workspace.data?.role;

  const steps = useMemo(
    () => discoverySteps.filter((s) => !s.hideFor || !role || !s.hideFor.includes(role)),
    [role],
  );

  useEffect(() => {
    if (accountId && stage === 'idle' && !isDiscoverySeen(accountId)) {
      dispatch(openDiscoveryModalAC());
    }
  }, [accountId, stage, dispatch]);

  const finish = () => {
    if (accountId) markDiscoverySeen(accountId);
    dispatch(closeDiscoveryAC());
  };

  // Тур пройден полностью (не пропущен модалкой) — возвращаем на дашборд
  const finishTour = () => {
    finish();
    navigate('/');
  };

  const current = stage === 'tour' ? steps[step - 1] : undefined;

  useEffect(() => {
    // Отфильтровали шаг под роль в середине тура (не должно случаться,
    // но не оставлять же тур подвисшим) — просто закрываем
    if (stage === 'tour' && !current) finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, current]);

  return (
    <>
      <DiscoveryModal
        isVisible={stage === 'modal'}
        onSkip={finish}
        onStart={() => {
          if (accountId) markDiscoverySeen(accountId);
          dispatch(startDiscoveryTourAC());
        }}
      />
      {current && (
        <>
          {/* Блокирует клики по остальной странице, пока идёт тур —
              не даёт уйти в сторону от текущего шага */}
          <Box sx={{ position: 'fixed', inset: 0, zIndex: 1250, cursor: 'default' }} />
          <DiscoveryTooltip
            step={current}
            index={step}
            total={steps.length}
            onNext={() => dispatch(nextDiscoveryStepAC())}
            onClose={finishTour}
            onSkip={finish}
          />
        </>
      )}
    </>
  );
}

export default DiscoveryGate;
