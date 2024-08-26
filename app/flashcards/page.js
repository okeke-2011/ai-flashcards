"use client";

import { doc, collection, getDoc, setDoc } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import db from "@/firebase";
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    Container,
    Grid,
    Typography,
} from "@mui/material";

export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcardNames, setFlashcardNames] = useState([]);
    const router = useRouter();

    useEffect(() => {
        async function getFlashcards() {
            if (!user) return;
            const docRef = doc(collection(db, "users"), user.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const flashcardCollectionNames =
                    docSnap.data().flashcardSets || [];
                setFlashcardNames(flashcardCollectionNames);
            } else {
                await setDoc(docRef, { flashcardSets: [] });
            }
        }
        getFlashcards();
    }, [user]);

    if (!isLoaded) return <></>;

    if (!isSignedIn) router.push("/sign-in");

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`);
    };

    return (
        <Container maxWidth="md">
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcardNames.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                            <CardActionArea
                                onClick={() => handleCardClick(flashcard.name)}
                            >
                                <CardContent>
                                    <Box
                                        textAlign="center"
                                        display="flex"
                                        flexDirection="column"
                                        justifyContent="center"
                                        sx={{
                                            height: 80,
                                        }}
                                    >
                                        <Typography variant="h5">
                                            {flashcard.name}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
