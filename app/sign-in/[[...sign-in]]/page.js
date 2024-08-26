import React from "react";
import {
    Container,
    Box,
    Typography,
    AppBar,
    Toolbar,
    Button,
} from "@mui/material";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        AI Flashcards
                    </Typography>
                    <Button color="inherit" href="/sign-in">
                        Login
                    </Button>
                    <Button color="inherit" href="/sign-up">
                        Sign Up
                    </Button>
                </Toolbar>
            </AppBar>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                sx={{ textAlign: "center", my: 6 }}
            >
                <SignIn />
            </Box>
        </>
    );
}
