import { useEffect, useState } from "preact/hooks";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { type FunctionalComponent } from "preact";
import { type User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { db } from "../hooks/initializeFirebase";

type UserProfile = {
  role?: string;
  organization?: string;
  headquarters?: string;
  businessPhone?: string;
  industry?: string;
  lastAuditNote?: string;
  complianceBadge?: string;
};

const defaultProfile: UserProfile = {
  role: "",
  organization: "",
  headquarters: "",
  businessPhone: "",
  industry: "",
  lastAuditNote: "",
  complianceBadge: "",
};

const normalizeProfile = (data?: UserProfile | null): UserProfile => ({
  ...defaultProfile,
  ...(data ?? {}),
});

const formatDate = (value?: string | null) => {
  if (!value) return "Not available";
  return new Date(value).toLocaleString();
};

const Settings: FunctionalComponent<{ user: User | null }> = ({ user }) => {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [draftProfile, setDraftProfile] = useState<UserProfile>(defaultProfile);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      setProfile(defaultProfile);
      setDraftProfile(defaultProfile);
      return;
    }

    let isSubscribed = true;
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const ref = doc(db, "users", user.uid);
        const snapshot = await getDoc(ref);
        if (isSubscribed) {
          const hydrated = snapshot.exists()
            ? normalizeProfile(snapshot.data() as UserProfile)
            : defaultProfile;
          setProfile(hydrated);
          setDraftProfile(hydrated);
        }
      } catch (err) {
        console.error("Failed to load profile", err);
        if (isSubscribed) {
          setError("Unable to load organization profile. Data exports will be limited until this is resolved.");
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    fetchProfile();
    return () => {
      isSubscribed = false;
    };
  }, [user?.uid]);

  const provider = user?.providerData?.[0]?.providerId ?? "password";
  const complianceLabel =
    draftProfile.complianceBadge ||
    profile.complianceBadge ||
    ((draftProfile.role || profile.role) ? "Active" : "Unverified");

  const handleFieldChange = (field: keyof UserProfile) => (event: Event) => {
    const value = (event.target as HTMLInputElement).value;
    setDraftProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      const ref = doc(db, "users", user.uid);
      const payload = {
        ...draftProfile,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(ref, payload, { merge: true });
      setProfile(normalizeProfile(draftProfile));
      setShowSuccess(true);
    } catch (err) {
      console.error("Failed to save profile", err);
      setError("Unable to save organization profile. Retry or capture backend logs for evidence.");
    } finally {
      setSaving(false);
    }
  };

  const isDirty = JSON.stringify(draftProfile) !== JSON.stringify(profile);
  const orgProfileComplete = Boolean(
    draftProfile.organization && draftProfile.industry && draftProfile.headquarters
  );

  if (!user) {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          Settings
        </Typography>
        <Alert severity="info">Sign in to review account metadata.</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Account & Compliance Center
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Export this panel alongside screenshots to document authorship, access level, and organization ownership for your NIW evidence packet.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={240}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6">Account Overview</Typography>
                  <Chip label={complianceLabel} color={complianceLabel === "Active" ? "success" : "warning"} size="small" />
                </Stack>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={1.5}>
                  <Typography variant="body2">Email: <strong>{user.email}</strong></Typography>
                  <Typography variant="body2">UID: <strong>{user.uid}</strong></Typography>
                  <Typography variant="body2">Role: <strong>{profile.role || "Not assigned"}</strong></Typography>
                  <Typography variant="body2">Provider: <strong>{provider}</strong></Typography>
                  <Typography variant="body2">
                    Email Verified:
                    <Chip
                      label={user.emailVerified ? "Verified" : "Pending"}
                      color={user.emailVerified ? "success" : "warning"}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Organization Profile
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={1.5}>
                  <TextField
                    label="Organization"
                    value={draftProfile.organization}
                    onChange={handleFieldChange("organization")}
                    size="small"
                    fullWidth
                  />
                  <TextField
                    label="Industry"
                    value={draftProfile.industry}
                    onChange={handleFieldChange("industry")}
                    size="small"
                    fullWidth
                  />
                  <TextField
                    label="Headquarters"
                    value={draftProfile.headquarters}
                    onChange={handleFieldChange("headquarters")}
                    size="small"
                    fullWidth
                  />
                  <TextField
                    label="Primary Phone"
                    value={draftProfile.businessPhone}
                    onChange={handleFieldChange("businessPhone")}
                    size="small"
                    fullWidth
                  />
                  <TextField
                    label="Latest Audit Note"
                    multiline
                    minRows={2}
                    value={draftProfile.lastAuditNote}
                    onChange={handleFieldChange("lastAuditNote")}
                    size="small"
                    fullWidth
                    helperText="Capture diligence performed before exporting evidence."
                  />
                  <TextField
                    label="Compliance Badge"
                    value={draftProfile.complianceBadge}
                    onChange={handleFieldChange("complianceBadge")}
                    size="small"
                    fullWidth
                    helperText="Examples: Active, Needs Review, Internal Only"
                  />
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={saving || !isDirty}
                  >
                    {saving ? "Saving..." : "Save Organization Profile"}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Access Timeline
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={1.5}>
                  <Typography variant="body2">Account Created: <strong>{formatDate(user.metadata?.creationTime ?? null)}</strong></Typography>
                  <Typography variant="body2">Last Login: <strong>{formatDate(user.metadata?.lastSignInTime ?? null)}</strong></Typography>
                  <Typography variant="body2">Report Export Window: <strong>{new Date().toLocaleDateString()}</strong></Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Evidence Checklist
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={1}>
                  <Typography variant="body2">✔ Account ownership established via UID + email</Typography>
                  <Typography variant="body2">✔ Role alignment: {profile.role || "role pending"}</Typography>
                  <Typography variant="body2">
                    {orgProfileComplete ? "✔" : "⬜"} Organization metadata synced from Firestore
                  </Typography>
                  <Typography variant="body2">⬜ Attach current analytics screenshots</Typography>
                  <Typography variant="body2">⬜ Include backend commit references</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={() => setShowSuccess(false)}
        message="Organization profile saved"
      />
    </Box>
  );
};

export default Settings;