import { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress, Divider, IconButton, Typography } from '@mui/material';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { useDispatch } from 'react-redux';
import {
  useCurrentWorkspace,
  useInviteMember,
  useMyTeam,
  useProfile,
  useRemoveMember,
  useUpdateProfile,
} from '../network/hooks';
import { Button, TextField } from '../components/ui';
import { ConfirmPopup } from '../components/popups/ConfirmPopup';
import { setAlertAC } from '../store/alertSlice';
import { Role } from '../types/membership';
import { colors } from '../theme';
import type { TeamMember } from '../types/membership';

function Row({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 3,
        py: 4,
      }}
    >
      <Box sx={{ width: 200, flexShrink: 0 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: colors.interface.black }}>
          {label}
        </Typography>
        {description && (
          <Typography sx={{ mt: 0.5, fontSize: 13, color: colors.interface.grey }}>
            {description}
          </Typography>
        )}
      </Box>
      <Box sx={{ flex: 1, minWidth: 280, maxWidth: 560 }}>{children}</Box>
    </Box>
  );
}

function EditableField({
  label,
  value,
  saving,
  onSave,
}: {
  label: string;
  value: string;
  saving?: boolean;
  onSave: (next: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState(value);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  const confirm = () => {
    const trimmed = draft.trim();
    setEditing(false);
    if (trimmed !== value) onSave(trimmed);
    else setDraft(value);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
      <TextField
        ref={inputRef}
        label={label}
        value={draft}
        disabled={!editing || saving}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') confirm();
          if (e.key === 'Escape') cancel();
        }}
        endIcon={
          editing ? undefined : (
            <BorderColorOutlinedIcon
              sx={{ cursor: 'pointer', pointerEvents: 'auto' }}
              onClick={() => setEditing(true)}
            />
          )
        }
      />
      {editing && (
        <>
          <IconButton
            size="small"
            aria-label="Save"
            disabled={saving}
            onClick={confirm}
            sx={{
              border: `1px solid ${colors.interface.grey3}`,
              borderRadius: '8px',
            }}
          >
            <CheckRoundedIcon sx={{ fontSize: 18, color: colors.brand.main }} />
          </IconButton>
          <IconButton
            size="small"
            aria-label="Cancel"
            disabled={saving}
            onClick={cancel}
            sx={{
              border: `1px solid ${colors.interface.grey3}`,
              borderRadius: '8px',
            }}
          >
            <CloseRoundedIcon sx={{ fontSize: 18, color: colors.interface.grey }} />
          </IconButton>
        </>
      )}
    </Box>
  );
}

const ProfilePage = () => {
  const dispatch = useDispatch();

  const profile = useProfile();
  const workspace = useCurrentWorkspace();
  const updateProfile = useUpdateProfile();

  const isOwner = workspace.data?.role === Role.OWNER;

  const team = useMyTeam(
    isOwner ? { role: Role.ADMIN, limit: 100 } : { limit: 100 },
  );
  const inviteMember = useInviteMember();
  const removeMember = useRemoveMember();

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [adminToRemove, setAdminToRemove] = useState<TeamMember | null>(null);

  const save = (dto: { firstName?: string; lastName?: string }) => {
    updateProfile.mutate(dto, {
      onError: (e) => dispatch(setAlertAC({ text: e.message, mode: 'error' })),
    });
  };

  const submitInvite = () => {
    const email = inviteEmail.trim();
    if (!email) return;
    inviteMember.mutate(
      { email, role: Role.ADMIN },
      {
        onSuccess: () => {
          dispatch(setAlertAC({ text: `Invitation sent to ${email}`, mode: 'success' }));
          setInviteEmail('');
          setInviteOpen(false);
        },
        onError: (e) => dispatch(setAlertAC({ text: e.message, mode: 'error' })),
      },
    );
  };

  if (profile.isPending) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  const p = profile.data;
  const admins = team.data?.data ?? [];

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      <Typography sx={{ fontSize: 24, fontWeight: 700, lineHeight: '32px' }}>
        Profile
      </Typography>
      <Divider sx={{ mt: 2 }} />

      <Row label="General">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField label="Email" value={p?.email ?? ''} locked readOnly />
          <EditableField
            key={`first-${p?.firstName ?? ''}`}
            label="First name"
            value={p?.firstName ?? ''}
            saving={updateProfile.isPending}
            onSave={(firstName) => save({ firstName })}
          />
          <EditableField
            key={`last-${p?.lastName ?? ''}`}
            label="Last name"
            value={p?.lastName ?? ''}
            saving={updateProfile.isPending}
            onSave={(lastName) => save({ lastName })}
          />
        </Box>
      </Row>

      {isOwner && (
        <>
          <Divider />
          <Row
            label="Team"
            description="All members have access to the same features as you"
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography
                sx={{ fontSize: 14, fontWeight: 500, color: colors.interface.black2 }}
              >
                Admin
              </Typography>

              {admins.map((m) => (
                <Box
                  key={m.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                    minHeight: 42,
                    px: 1.5,
                    borderRadius: '8px',
                    border: `1px solid ${colors.interface.grey3}`,
                    bgcolor: colors.interface.white,
                  }}
                >
                  <Typography sx={{ fontSize: 14, color: colors.interface.black }}>
                    {m.displayName}
                  </Typography>
                  <IconButton
                    size="small"
                    aria-label={`Remove ${m.displayName}`}
                    onClick={() => setAdminToRemove(m)}
                  >
                    <DeleteOutlineRoundedIcon
                      sx={{ fontSize: 18, color: colors.interface.grey }}
                    />
                  </IconButton>
                </Box>
              ))}

              {inviteOpen ? (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    type="email"
                    placeholder="admin@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submitInvite()}
                  />
                  <Button
                    size="M"
                    loading={inviteMember.isPending}
                    onClick={submitInvite}
                  >
                    Send
                  </Button>
                  <Button
                    size="M"
                    variant="white"
                    onClick={() => {
                      setInviteOpen(false);
                      setInviteEmail('');
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              ) : (
                <Button
                  size="M"
                  variant="second"
                  fullWidth
                  startIcon={<AddCircleOutlineRoundedIcon sx={{ fontSize: 18 }} />}
                  onClick={() => setInviteOpen(true)}
                >
                  Invite Admin
                </Button>
              )}
            </Box>
          </Row>
        </>
      )}

      <ConfirmPopup
        isVisible={!!adminToRemove}
        title="Remove admin?"
        description={
          adminToRemove
            ? `${adminToRemove.displayName} will lose access to this workspace.`
            : undefined
        }
        confirmLabel="Remove"
        tone="danger"
        loading={removeMember.isPending}
        onClose={() => setAdminToRemove(null)}
        onConfirm={() => {
          if (!adminToRemove) return;
          removeMember.mutate(adminToRemove.id, {
            onSuccess: () => setAdminToRemove(null),
            onError: (e) => dispatch(setAlertAC({ text: e.message, mode: 'error' })),
          });
        }}
      />
    </Box>
  );
};

export default ProfilePage;
