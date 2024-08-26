"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import getStripe from "@/app/utils/get-stripe";
import {
    AppBar,
    Box,
    Button,
    Container,
    Grid,
    Stack,
    Toolbar,
    Typography,
} from "@mui/material";

export default function Home() {
    const handleSubmit = async (price) => {
        const checkoutSession = await fetch("/api/checkout_sessions", {
            method: "POST",
            body: JSON.stringify({ price: price }),
        });
        const checkoutSessionJson = await checkoutSession.json();
        console.log(checkoutSessionJson);

        const stripe = await getStripe();
        const { error } = await stripe.redirectToCheckout({
            sessionId: checkoutSessionJson.id,
        });

        if (error) {
            console.warn(error.message);
        }
    };

    return (
        <>
            {/* Nav bar */}
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        AI Flashcards
                    </Typography>
                    <SignedOut>
                        <Button color="inherit" href="/sign-in">
                            Login
                        </Button>
                        <Button color="inherit" href="/sign-up">
                            Sign Up
                        </Button>
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </Toolbar>
            </AppBar>

            {/* Page content */}
            <Container maxWidth="100vw">
                {/* Hero section box */}
                <Box sx={{ textAlign: "center", my: 4 }}>
                    <Typography variant="h2" gutterBottom>
                        Welcome to AI Flashcards
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        The easiest way to create flashcards from your text.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2, mr: 2 }}
                        href="/generate"
                    >
                        Get Started
                    </Button>
                    <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
                        Learn More
                    </Button>
                </Box>

                {/* Feature Box */}
                <Box sx={{ my: 6, textAlign: "center" }}>
                    <Typography variant="h4" gutterBottom>
                        Features
                    </Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h5" gutterBottom>
                                AI Powered 🤖
                            </Typography>
                            <Typography>
                                {" "}
                                Utilize AI to analyze user-provided text and
                                automatically generate flashcards. This feature
                                leverages natural language processing to
                                identify key concepts and create questions and
                                answers.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h5" gutterBottom>
                                Mobile-friendly UI 📱
                            </Typography>
                            <Typography>
                                {" "}
                                Ensure the app is fully responsive, providing a
                                seamless experience across different devices and
                                screen sizes. Use Material-UI components to
                                create a consistent and visually appealing
                                design.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h5" gutterBottom>
                                Payment processing 💸
                            </Typography>
                            <Typography>
                                {" "}
                                Integrate Stripe to handle payments for premium
                                features. This includes setting up checkout
                                sessions, handling payment success and failure,
                                and managing subscription plans.
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>

                {/* Pricing stuff */}
                <Typography
                    variant="h4"
                    component="h2"
                    gutterBottom
                    textAlign="center"
                >
                    Pricing
                </Typography>

                {/* Pricing Box */}
                <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                        mb: 10,
                        textAlign: "center",
                    }}
                >
                    <Grid container spacing={4} sx={{ maxWidth: "70vw" }}>
                        {/* Basic plan */}
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    p: 3,
                                    border: "1px solid",
                                    borderColor: "grey.300",
                                    borderRadius: 2,
                                    height: "100%",
                                }}
                            >
                                <Stack height="75%">
                                    <Typography variant="h5" gutterBottom>
                                        Basic plan
                                    </Typography>
                                    <Typography variant="h6" gutterBottom>
                                        $5 per month
                                    </Typography>
                                    <Typography>
                                        The Basic plan offers essential features
                                        to get you started with creating and
                                        managing flashcards. Ideal for
                                        individuals who need a simple and
                                        effective solution.
                                    </Typography>
                                </Stack>
                                <Button
                                    onClick={() => handleSubmit(5)}
                                    variant="contained"
                                    sx={{ mt: 3 }}
                                >
                                    Choose Basic
                                </Button>
                            </Box>
                        </Grid>

                        {/* Pro plan */}
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    p: 3,
                                    border: "1px solid",
                                    borderColor: "grey.300",
                                    borderRadius: 2,
                                    height: "100%",
                                }}
                            >
                                <Stack height="75%">
                                    <Typography variant="h5" gutterBottom>
                                        Pro plan
                                    </Typography>
                                    <Typography variant="h6" gutterBottom>
                                        $10 per month
                                    </Typography>
                                    <Typography>
                                        The Pro plan includes all the features
                                        of the Basic plan, plus advanced tools
                                        and integrations for power users.
                                        Perfect for those who need more control
                                        and customization options.
                                    </Typography>
                                </Stack>
                                <Button
                                    onClick={() => handleSubmit(10)}
                                    variant="contained"
                                    sx={{ mt: 3 }}
                                >
                                    Choose Pro
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    );
}
