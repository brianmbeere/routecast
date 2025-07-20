import { useState } from 'preact/hooks';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../hooks/initializeFirebase';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { BASE_URL } from "../utils";
import {
  Container, TextField, Button, Typography, Box, Paper
} from '@mui/material';
import { getFirestore, setDoc, doc } from 'firebase/firestore';

const COUNTRIES = [
  "Canada","United States"
];

const schema = yup.object({
  fullName: yup.string().required("Full Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  organization: yup.string().required("Organization is required"),
  country: yup.string().oneOf(COUNTRIES, "Select a valid role").required("Country is required"),
  role: yup.string().oneOf(["","farmer", "restaurant"], "Select a valid role").required("Role is required"),
});

const SignUpForm = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const navigate = useNavigate();
  const [firebaseError, setFirebaseError] = useState("");

  const onSubmit = async (data: any) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();
      const db = getFirestore();

      await setDoc(doc(db, "users", user.uid), {
        ...data,
        createdAt: new Date().toISOString(),
      });

      const response = await fetch(`${BASE_URL}/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          ...data,
          firebase_uid: user.uid,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save user in backend");
      }

      navigate("/dashboard");
    } catch (err) {
      if ((err as any).code === "auth/email-already-in-use") {
        setFirebaseError("Email already in use. Try signing in or use a different email.");
      } else {
        setFirebaseError((err as Error).message || "Unexpected error occurred.");
      }
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" gutterBottom>
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} display="flex" flexDirection="column" gap={2}>
          <Controller
            name="fullName"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField label="Full Name" fullWidth {...field} error={!!errors.fullName} helperText={errors.fullName?.message} />
            )}
          />
          <Controller
            name="organization"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField label="Organization" fullWidth {...field} error={!!errors.organization} helperText={errors.organization?.message} />
            )}
          />
          <Controller
             name="role"
             control={control}
             defaultValue=""
             render={({ field }) => (
              <TextField
                select
                label=""
                fullWidth
                SelectProps={{ native: true }}
                {...field}
                error={!!errors.role}
                helperText={errors.role?.message}
              > 
                <option value="">Select a country</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
              </TextField>
            )}
          />
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField label="Email" type="email" fullWidth {...field} error={!!errors.email} helperText={errors.email?.message} />
            )}
          />
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField label="Password" type="password" fullWidth {...field} error={!!errors.password} helperText={errors.password?.message} />
            )}
          />
          <Controller
            name="role"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                select
                label=""
                fullWidth
                SelectProps={{ native: true }}
                {...field}
                error={!!errors.role}
                helperText={errors.role?.message}
              >
                <option value="">Select a role</option>
                <option value="farmer">Farmer / Produce Supplier</option>
                <option value="restaurant">Restaurant / Food Truck Owner</option>
              </TextField>
            )}
          />

          {firebaseError && <Typography color="error">{firebaseError}</Typography>}
          <Button type="submit" variant="contained" fullWidth>
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
