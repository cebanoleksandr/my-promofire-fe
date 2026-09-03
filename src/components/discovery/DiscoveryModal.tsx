import { Box, Typography } from '@mui/material';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { colors } from '../../theme';
import { Button, IconButton } from '../ui';
import BasePopup from '../popups/BasePopup';

export interface DiscoveryModalProps {
  isVisible: boolean;
  onSkip: () => void;
  onStart: () => void;
}

/**
 * Стартовая модалка онбординга ("Let's discover Promofire") — предлагает
 * пройти пошаговый тур по разделам или пропустить его насовсем.
 */
export function DiscoveryModal({ isVisible, onSkip, onStart }: DiscoveryModalProps) {
  return (
    <BasePopup isVisible={isVisible} onClose={onSkip}>
      <Box sx={{ width: '100%', minWidth: 380, textAlign: 'center', position: 'relative' }}>
        <IconButton
          size={24}
          aria-label="Close"
          onClick={onSkip}
          sx={{ position: 'absolute', right: 0, top: 0 }}
        >
          <CloseRoundedIcon />
        </IconButton>

        <Box
          sx={{
            width: 56,
            height: 56,
            mx: 'auto',
            mb: 2,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: colors.brand.main + '1a',
            color: colors.brand.main,
          }}
        >
          <ExploreOutlinedIcon sx={{ fontSize: 28 }} />
        </Box>

        <Typography sx={{ fontSize: 20, fontWeight: 600, lineHeight: '28px' }}>
          Let's discover Promofire
        </Typography>
        <Typography
          sx={{ mt: 1, fontSize: 14, lineHeight: '22px', color: colors.interface.grey }}
        >
          Complete a brief product intro to start working faster
        </Typography>

        <Box sx={{ mt: 3, display: 'flex', gap: 1.5 }}>
          <Button variant="white" fullWidth onClick={onSkip}>
            Skip
          </Button>
          <Button fullWidth onClick={onStart}>
            Start discovery
          </Button>
        </Box>
      </Box>
    </BasePopup>
  );
}

export default DiscoveryModal;
