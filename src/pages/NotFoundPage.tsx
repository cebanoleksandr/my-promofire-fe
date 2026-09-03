import { Box } from '@mui/material';
import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded';
import { useNavigate } from 'react-router-dom';
import { Button, EmptyState } from '../components/ui';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
      <EmptyState
        icon={<SearchOffRoundedIcon />}
        title="Page not found"
        description="Sorry, the page you are looking for doesn't exist or may have been moved."
        action={
          <Button variant="white" onClick={() => navigate('/')}>
            Back to home
          </Button>
        }
      />
    </Box>
  );
};

export default NotFoundPage;
