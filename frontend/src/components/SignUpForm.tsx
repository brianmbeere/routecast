import { useState } from 'preact/hooks';
import { type FunctionalComponent } from 'preact';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../hooks/initializeFirebase';
import { useNavigate } from 'react-router-dom';
import {
  Container, TextField, Button, Typography, Box, Paper, CircularProgress, Link, MenuItem
} from '@mui/material';
import { getFirestore, setDoc, doc } from 'firebase/firestore';

const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Kenya', 'India', 'Germany', 'France', 'Australia', 'South Africa', 'Nigeria', 'Other'
];
const ROLES = [
  'Fleet Manager', 'Driver', 'Logistics Coordinator', 'Business Owner', 'Data Analyst', 'Developer', 'Other'
];

const SignUpForm: FunctionalComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [title, setTitle] = useState('');
  const [country, setCountry] = useState('');
  const [useCase, setUseCase] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    setLoading(true);
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
    } catch (err: any) {
      setError(err.message || 'Unexpected error occurred.');
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
          Sign Up
        </Typography>
        <Box component="form" display="flex" flexDirection="column" gap={2} noValidate>
          <TextField
            label="Full Name"
            value={fullName}
            onChange={e => setFullName((e.target as HTMLInputElement)?.value || '')}
            fullWidth
          />
          <TextField
            label="Organization / Company"
            value={organization}
            onChange={e => setOrganization((e.target as HTMLInputElement)?.value || '')}
            fullWidth
          />
          <TextField
            select
            label="Professional Title / Role"
            value={title}
            onChange={e => setTitle((e.target as HTMLInputElement)?.value || '')}
            fullWidth
          >
            {ROLES.map(role => (
              <MenuItem key={role} value={role}>{role}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Country"
            value={country}
            onChange={e => setCountry((e.target as HTMLInputElement)?.value || '')}
            fullWidth
          >
            {COUNTRIES.map(c => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Intended Use Case / Reason"
            value={useCase}
            onChange={e => setUseCase((e.target as HTMLInputElement)?.value || '')}
            fullWidth
          />
          <TextField
            label="LinkedIn / Professional Profile URL (optional)"
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
          <Button
            variant="contained"
            onClick={handleSignUp}
            fullWidth
            size="large"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account?{' '}
            <Link href="/signin" underline="hover">
              Sign In
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignUpForm;
