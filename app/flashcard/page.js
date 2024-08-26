"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import db from "@/firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    Container,
    Grid,
    Typography,
} from "@mui/material";

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState({});
    const router = useRouter();

    const searchParams = useSearchParams();
    const search = searchParams.get("id");

    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return;

            const allUsersColRef = collection(db, "users");
            const userDocRef = doc(allUsersColRef, user.id);
            const userFlashcardColRef = collection(userDocRef, "flashcardSets");
            const requestedFlashcardDocRef = doc(userFlashcardColRef, search);

            const docs = await getDoc(requestedFlashcardDocRef);

            setFlashcards(docs.data()?.flashcards);
        }
        getFlashcard();
    }, [search, user]);

    if (!isLoaded) return <></>;

    if (!isSignedIn) router.push("/sign-in");

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <Container maxWidth="md">
            {flashcards.length > 0 && (
                <Box my={5}>
                    <Typography variant="h2" textAlign="center" sx={{ my: 5 }}>
                        {`"${search}" Flashcards`}
                    </Typography>
                    <Grid container spacing={2} justifyContent="center">
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card>
                                    <CardActionArea
                                        disableRipple
                                        onClick={() => handleCardClick(index)}
                                    >
                                        <CardContent
                                            sx={{ textAlign: "center", p: 0 }}
                                        >
                                            <Box
                                                display={"flex"}
                                                flexDirection={"column"}
                                                alignItems={"center"}
                                                justifyContent={"center"}
                                                sx={{
                                                    p: 2,
                                                    height: 200,
                                                    bgcolor: flipped[index]
                                                        ? "grey.300"
                                                        : "white",
                                                }}
                                            >
                                                {flipped[index] ? (
                                                    <Typography variant="h6">
                                                        {flashcard.back}
                                                    </Typography>
                                                ) : (
                                                    <Typography variant="h6">
                                                        {flashcard.front}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
        </Container>
    );
}
