import { Box } from '@mui/material';
import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, EmptyState } from '../components/ui';

const NotFoundPage = () => {
  const { t } = useTranslation('notFound');
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
      <EmptyState
        icon={<SearchOffRoundedIcon />}
        title={t('title')}
        description={t('description')}
        action={
          <Button variant="white" onClick={() => navigate('/')}>
            {t('backToHome')}
          </Button>
        }
      />
    </Box>
  );
};

export default NotFoundPage;
