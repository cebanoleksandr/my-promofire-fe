import { Alert, Box, CircularProgress, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useMyWorkspaces, useSelectWorkspace } from '../../network/hooks';
import { WorkspaceItem } from '../../components/ui';
import { colors, customShadows } from '../../theme';

const SelectWorkspacePage = () => {
  const navigate = useNavigate();
  const { data: workspaces, isPending, error } = useMyWorkspaces();
  const select = useSelectWorkspace();

  const pick = (membershipId: string) => {
    if (select.isPending) return;
    select.mutate(
      { membershipId },
      { onSuccess: () => navigate('/', { replace: true }) },
    );
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        bgcolor: colors.interface.grey4,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 420,
          p: 4,
          borderRadius: '16px',
          border: `1px solid ${colors.interface.grey3}`,
          boxShadow: customShadows.soft,
          bgcolor: colors.interface.white,
        }}
      >
        <Typography sx={{ fontSize: 24, fontWeight: 700, lineHeight: '32px' }}>
          Choose a workspace
        </Typography>
        <Typography
          sx={{ mt: 1, fontSize: 14, lineHeight: '22px', color: colors.interface.grey }}
        >
          Pick which workspace to open.
        </Typography>

        {(error || select.error) && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {(select.error ?? error)?.message}
          </Alert>
        )}

        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {isPending && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress size={22} />
            </Box>
          )}

          {workspaces?.map((w) => (
            <WorkspaceItem
              key={w.membershipId}
              name={w.workspaceName}
              caption={w.role}
              variant="list"
              disabled={select.isPending}
              onClick={() => pick(w.membershipId)}
            />
          ))}

          {!isPending && workspaces?.length === 0 && (
            <Typography sx={{ py: 2, textAlign: 'center', color: colors.interface.grey2 }}>
              No workspaces available
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default SelectWorkspacePage;
