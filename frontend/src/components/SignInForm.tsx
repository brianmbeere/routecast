import { useState } from 'preact/hooks';
import { type FunctionalComponent } from 'preact';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../hooks/initializeFirebase';
import { useNavigate } from 'react-router-dom';
import {
  Container, TextField, Button, Typography, Box, Paper, CircularProgress, Link
} from '@mui/material';

const SignInForm: FunctionalComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
        px: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: '100%',
          borderRadius: 3,
          boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
        }}
      >
        <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
          Sign In
        </Typography>
        <Box component="form" display="flex" flexDirection="column" gap={2} noValidate>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail((e.target as HTMLInputElement)?.value || '')}
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword((e.target as HTMLInputElement)?.value || '')}
            fullWidth
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button
            variant="contained"
            onClick={handleSignIn}
            fullWidth
            size="large"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Do not have an account?{' '}
            <Link href="/signup" underline="hover">
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignInForm;
