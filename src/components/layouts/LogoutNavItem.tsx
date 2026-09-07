import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useLogout } from '../../network/hooks';
import { NavItem } from '../ui';
import { ConfirmPopup } from '../popups/ConfirmPopup';

/**
 * Пункт "Log out" с подтверждением через ConfirmPopup.
 */
export function LogoutNavItem() {
  const { t } = useTranslation('layout');
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
        label={t('logout.navLabel')}
        icon={<LogoutOutlinedIcon />}
        onClick={() => setOpen(true)}
      />
      <ConfirmPopup
        isVisible={open}
        title={t('logout.title')}
        description={t('logout.description')}
        confirmLabel={t('logout.confirm')}
        tone="danger"
        loading={logout.isPending}
        onConfirm={handleConfirm}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

export default LogoutNavItem;
