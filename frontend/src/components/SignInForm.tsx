import { useState } from 'preact/hooks';
import { type FunctionalComponent } from "preact";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../hooks/initializeFirebase';
import { useNavigate } from 'react-router-dom';
import {
  Container, TextField, Button, Typography, Box, Paper
} from '@mui/material';

const SignInForm: FunctionalComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in successfully');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" gutterBottom>
          Sign In
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
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
          <Button variant="contained" onClick={handleSignIn} fullWidth>
            Sign In
          </Button>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don't have an account? <a href="/signup">Sign Up</a>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default SignInForm;
