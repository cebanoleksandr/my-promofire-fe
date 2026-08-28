import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useLogout } from '../../network/hooks';
import { NavItem } from '../ui';
import { ConfirmPopup } from '../popups/ConfirmPopup';

/**
 * Пункт "Log out" с подтверждением через ConfirmPopup.
 */
export function LogoutNavItem() {
  const navigate = useNavigate();
  const logout = useLogout();
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        setOpen(false);
        navigate('/login', { replace: true });
      },
    });
  };

  return (
    <>
      <NavItem
        label="Log out"
        icon={<LogoutOutlinedIcon />}
        onClick={() => setOpen(true)}
      />
      <ConfirmPopup
        isVisible={open}
        title="Log out?"
        description="You’ll need to sign in again to access your workspace."
        confirmLabel="Log out"
        tone="danger"
        loading={logout.isPending}
        onConfirm={handleConfirm}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

export default LogoutNavItem;
