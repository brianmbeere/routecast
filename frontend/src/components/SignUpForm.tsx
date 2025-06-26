import { useState } from 'preact/hooks';
import { type FunctionalComponent } from "preact";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../hooks/initializeFirebase';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper
} from '@mui/material';
import { getFirestore, setDoc, doc } from 'firebase/firestore';

const SignUpForm: FunctionalComponent = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [organization, setOrganization] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [useCase, setUseCase] = useState<string>('');
  const [linkedin, setLinkedin] = useState<string>('');
  const navigate = useNavigate();

  const handleSignUp = async (): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const db = getFirestore();
      await setDoc(doc(db, 'users', user.uid), {
        fullName,
        organization,
        title,
        country,
        useCase,
        linkedin,
        email,
        createdAt: new Date().toISOString(),
      });
      navigate('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Unexpected error occurred.');
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" gutterBottom>
          Sign Up
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Full Name"
            value={fullName}
            onChange={e => setFullName((e.target as HTMLInputElement)?.value || '')}
            fullWidth
          />
          <TextField
            label="Organization/Company"
            value={organization}
            onChange={e => setOrganization((e.target as HTMLInputElement)?.value || '')}
            fullWidth
          />
          <TextField
            label="Professional Title/Role"
            value={title}
            onChange={e => setTitle((e.target as HTMLInputElement)?.value || '')}
            fullWidth
          />
          <TextField
            label="Country"
            value={country}
            onChange={e => setCountry((e.target as HTMLInputElement)?.value || '')}
            fullWidth
          />
          <TextField
            label="Intended Use Case / Reason for Using"
            value={useCase}
            onChange={e => setUseCase((e.target as HTMLInputElement)?.value || '')}
            fullWidth
          />
          <TextField
            label="LinkedIn or Professional Profile URL (optional)"
            value={linkedin}
            onChange={e => setLinkedin((e.target as HTMLInputElement)?.value || '')}
            fullWidth
          />
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
          <Button variant="contained" onClick={handleSignUp} fullWidth>
            Sign Up
          </Button>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account? <a href="/signin">Sign In</a>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignUpForm;
