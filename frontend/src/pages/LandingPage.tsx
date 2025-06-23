import { Button, Card, CardContent, Container, Grid, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";
import { type FunctionalComponent } from "preact";

const LandingPage: FunctionalComponent = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #f8fafc, #c7d2fe)",
        color: "#1e293b",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      {/* Sticky Header */}
      <Box
        component="header"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(6px)",
          borderBottom: "1px solid #e2e8f0",
          px: 3,
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Routecast
        </Typography>
        <Button
          variant="outlined"
          href="https://calendly.com/briannjenga413/30min"
          target="_blank"
          rel="noopener noreferrer"
        >
          Request Demo
        </Button>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="md" sx={{ py: 6, textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Box
            component="img"
            src="/Logistics-rafiki.svg"
            alt="City navigation illustration"
            sx={{ width: "100%", maxWidth: 400, mx: "auto", mb: 3 }}
          />
          <Typography variant="h3" component="h2" fontWeight="bold" color="primary" gutterBottom>
            Smarter Routes for Smarter Logistics
          </Typography>
          <Typography variant="h6" color="textSecondary" paragraph>
            Plan fuel-efficient, weather-aware, height-safe truck routes in seconds. Designed for fleet managers, drivers, and logistic companies.
          </Typography>
          <Button variant="contained" size="large" href="/plan" sx={{ mt: 3 }}>
            Try Routecast
          </Button>
        </motion.div>

        {/* Attribution */}
        <Typography variant="caption" sx={{ mt: 2, display: "block", color: "gray" }}>
          Illustration by{" "}
          <a
            href="https://storyset.com/city"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "underline" }}
          >
            Storyset
          </a>
        </Typography>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {[
            {
              title: "🚣️ Truck-Safe Routing",
              desc: "Plan routes with weight and height limits in mind. Avoid restricted roads and low overpasses.",
            },
            {
              title: "🌤️ Weather-Aware ETA",
              desc: "Dynamic ETAs based on live weather and road conditions, reducing unexpected delays.",
            },
            {
              title: "⛽ Fuel Cost Optimization",
              desc: "Save on fuel costs with optimized paths that reduce idle time and distance.",
            },
          ].map((feature, index) => (
            <Grid columns={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                style={{ height: "100%" }}
              >
                <Card elevation={3} sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1">{feature.desc}</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box component="footer" sx={{ textAlign: "center", py: 4, color: "#64748b" }}>
        © {new Date().getFullYear()} Routecast. All rights reserved.
      </Box>
    </Box>
  );
};

export default LandingPage;
