import { useState } from 'react';
import { Box, Radio, Typography } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { colors } from '../../theme';
import { Button, IconButton, TextField } from '../ui';
import BasePopup from './BasePopup';

export interface GenerateCodePopupProps {
  isVisible: boolean;
  loading?: boolean;
  onClose: () => void;
  onGenerate: (customCode?: string) => void;
}

type CodeFormat = 'auto' | 'custom';

/**
 * Поп-ап "Set code format" (Figma) поверх BasePopup: Auto / Custom-код генерации.
 */
export function GenerateCodePopup({
  isVisible,
  loading = false,
  onClose,
  onGenerate,
}: GenerateCodePopupProps) {
  const [format, setFormat] = useState<CodeFormat>('auto');
  const [customCode, setCustomCode] = useState('PromofireApp');

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  const handleGenerate = () => {
    onGenerate(format === 'custom' ? customCode.trim() : undefined);
  };

  return (
    <BasePopup isVisible={isVisible} onClose={handleClose}>
      <Box sx={{ width: '100%', minWidth: 380 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: 20, fontWeight: 600, lineHeight: '28px' }}>
            Set code format
          </Typography>
          <IconButton size={24} aria-label="Close" onClick={handleClose}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}
              onClick={() => setFormat('auto')}
            >
              <Radio
                checked={format === 'auto'}
                size="small"
                sx={{ color: colors.interface.grey3, '&.Mui-checked': { color: colors.brand.main } }}
              />
              <Typography sx={{ fontSize: 14, fontWeight: 500, color: colors.interface.black }}>
                Auto
              </Typography>
            </Box>
            <Typography sx={{ ml: 4.5, mt: 0.5, fontSize: 13, color: colors.interface.grey2 }}>
              Example: 01HRVJKBTD1H79GXBPXH8Q4E1A
            </Typography>
          </Box>

          <Box>
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}
              onClick={() => setFormat('custom')}
            >
              <Radio
                checked={format === 'custom'}
                size="small"
                sx={{ color: colors.interface.grey3, '&.Mui-checked': { color: colors.brand.main } }}
              />
              <Typography sx={{ fontSize: 14, fontWeight: 500, color: colors.interface.black }}>
                Custom
              </Typography>
            </Box>
            {format === 'custom' && (
              <Box sx={{ ml: 4.5, mt: 1 }}>
                <TextField
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  placeholder="PromofireApp"
                />
              </Box>
            )}
          </Box>
        </Box>

        <Box sx={{ mt: 3, display: 'flex', gap: 1.5 }}>
          <Button variant="white" fullWidth disabled={loading} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            fullWidth
            loading={loading}
            disabled={format === 'custom' && !customCode.trim()}
            onClick={handleGenerate}
          >
            Generate
          </Button>
        </Box>
      </Box>
    </BasePopup>
  );
}

export default GenerateCodePopup;
