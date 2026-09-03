import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Paper, Popper, Typography } from '@mui/material';
import { colors, customShadows } from '../../theme';
import { Button } from '../ui';
import type { DiscoveryStep } from './steps';

export interface DiscoveryTooltipProps {
  step: DiscoveryStep;
  /** 1-based индекс текущего шага в отфильтрованном списке. */
  index: number;
  total: number;
  onNext: () => void;
  /** Клик по "Finish" на последнем шаге. */
  onClose: () => void;
  /** Клик по "Skip" — прерывает тур на любом шаге. */
  onSkip: () => void;
}

/**
 * Один шаг тура: перекидывает на страницу шага и показывает поповер,
 * прикреплённый к соответствующему пункту сайдбара/шапки
 * (data-discovery-target="...").
 */
export function DiscoveryTooltip({
  step,
  index,
  total,
  onNext,
  onClose,
  onSkip,
}: DiscoveryTooltipProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (location.pathname !== step.route) {
      navigate(step.route);
    }
  }, [step.route, location.pathname, navigate]);

  useEffect(() => {
    // rAF, а не прямой setState в теле эффекта — даём сайдбару/шапке
    // домаунтиться после навигации, прежде чем искать якорь в DOM
    const raf = requestAnimationFrame(() => {
      const el = document.querySelector<HTMLElement>(
        `[data-discovery-target="${step.anchor}"]`,
      );
      setAnchorEl(el);
    });
    return () => cancelAnimationFrame(raf);
  }, [step.anchor]);

  const isLast = index === total;

  if (!anchorEl) return null;

  return (
    <Popper
      open
      anchorEl={anchorEl}
      placement={step.placement ?? 'right-start'}
      modifiers={[{ name: 'offset', options: { offset: [0, 12] } }]}
      sx={{ zIndex: 1300 }}
    >
      <Paper
        elevation={0}
        sx={{
          width: 280,
          p: 2,
          borderRadius: '12px',
          border: `1px solid ${colors.interface.grey3}`,
          boxShadow: customShadows.soft,
          bgcolor: colors.interface.white,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: 15, fontWeight: 600 }}>{step.title}</Typography>
          <Typography sx={{ fontSize: 12, color: colors.interface.grey2 }}>
            {index}/{total}
          </Typography>
        </Box>

        <Typography
          sx={{ mt: 1, fontSize: 13, lineHeight: '20px', color: colors.interface.grey }}
        >
          {step.description}
        </Typography>

        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button size="XS" variant="white" onClick={onSkip}>
            Skip
          </Button>
          <Button size="XS" onClick={isLast ? onClose : onNext}>
            {isLast ? 'Finish' : 'Okay'}
          </Button>
        </Box>
      </Paper>
    </Popper>
  );
}

export default DiscoveryTooltip;
