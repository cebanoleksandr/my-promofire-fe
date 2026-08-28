import { useState, type MouseEvent } from 'react';
import { Box, ButtonBase, Divider, Popover } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import {
  useCurrentWorkspace,
  useMyWorkspaces,
  useSelectWorkspace,
} from '../../network/hooks';
import { WorkspaceItem } from '../ui';
import { colors, customShadows } from '../../theme';
import { CreateWorkspacePopup } from './CreateWorkspacePopup';

/**
 * Верхний блок сайдбара: текущий воркспейс + дропдаун со списком
 * воркспейсов и кнопкой «Add workspace».
 */
export function WorkspaceSwitcher() {
  const { data: current } = useCurrentWorkspace();
  const { data: workspaces } = useMyWorkspaces();
  const select = useSelectWorkspace();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleSelect = (membershipId: string) => {
    setAnchorEl(null);
    if (membershipId === current?.membershipId || select.isPending) return;
    select.mutate({ membershipId });
  };

  return (
    <>
      <WorkspaceItem
        name={current?.name ?? 'No workspace'}
        caption={current?.role ?? ''}
        variant="main"
        onClick={(e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              mt: 0.5,
              minWidth: anchorEl?.offsetWidth ?? 240,
              p: 0.5,
              borderRadius: '12px',
              border: `1px solid ${colors.interface.grey3}`,
              boxShadow: customShadows.contour,
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          {workspaces?.map((w) => (
            <WorkspaceItem
              key={w.membershipId}
              name={w.workspaceName}
              caption={w.role}
              variant="list"
              selected={w.membershipId === current?.membershipId}
              onClick={() => handleSelect(w.membershipId)}
            />
          ))}

          <Divider sx={{ my: 0.5 }} />

          <ButtonBase
            disableRipple
            onClick={() => {
              setAnchorEl(null);
              setCreateOpen(true);
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 1.25,
              py: 1,
              borderRadius: '8px',
              fontSize: 14,
              fontWeight: 500,
              color: colors.interface.black2,
              '&:hover': { bgcolor: colors.interface.grey4 },
            }}
          >
            <AddRoundedIcon sx={{ fontSize: 18 }} />
            Add workspace
          </ButtonBase>
        </Box>
      </Popover>

      <CreateWorkspacePopup
        isVisible={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </>
  );
}

export default WorkspaceSwitcher;
