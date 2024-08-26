"use client";

import { collection, doc, getDoc, writeBatch } from "firebase/firestore";
import { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import db from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser();
    const router = useRouter();
    const [text, setText] = useState("");
    const [flipped, setFlipped] = useState({});
    const [flashcards, setFlashcards] = useState([]);
    const [generating, setGenerating] = useState(false);
    const [name, setName] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);

    if (!isLoaded) return <></>;

    if (!isSignedIn) router.push("/sign-in");

    const handleSaveToFirebase = async () => {
        if (!name.trim()) {
            alert("Please enter a name for your flashcard set.");
            return;
        }

        try {
            const userDocRef = doc(collection(db, "users"), user.id);
            const userDocSnap = await getDoc(userDocRef);

            const batch = writeBatch(db);

            if (userDocSnap.exists()) {
                const existingFlashcardSets = userDocSnap.data().flashcardSets;
                if (existingFlashcardSets.find((set) => set.name === name)) {
                    alert("Flashcard set with that name already exists");
                    return;
                }
                const updatedFlashcardSets = [
                    ...(existingFlashcardSets || []),
                    { name: name },
                ];
                batch.update(userDocRef, {
                    flashcardSets: updatedFlashcardSets,
                });
            } else {
                batch.set(userDocRef, { flashcardSets: [{ name: name }] });
            }

            const setDocRef = doc(
                collection(userDocRef, "flashcardSets"),
                name
            );
            batch.set(setDocRef, { flashcards });

            await batch.commit();

            alert("Flashcards saved successfully!");
            handleCloseDialog();
            setName("");
            router.push("/flashcards");
        } catch (error) {
            console.error("Error saving flashcards:", error);
            alert(
                "An error occurred while saving flashcards. Please try again."
            );
        }
    };

    const handleGenerate = async () => {
        if (!text.trim()) {
            alert("Please enter some text to generate flashcards.");
            return;
        }

        try {
            setFlashcards([]);
            setGenerating(true);
            const response = await fetch("/api/generate", {
                method: "POST",
                body: text,
            });

            if (!response.ok) {
                throw new Error("Failed to generate flashcards");
            }

            const data = await response.json();
            setFlashcards(data);
            setGenerating(false);
        } catch (error) {
            console.error("Error generating flashcards:", error);
            alert(
                "An error occurred while generating flashcards. Please try again."
            );
        }
    };

    const handleOpenDialog = () => setDialogOpen(true);

    const handleCloseDialog = () => setDialogOpen(false);

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <Container maxWidth="md">
            {/* Flash card input area */}
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                sx={{ my: 4 }}
            >
                <Typography variant="h4" gutterBottom>
                    Generate Flashcards
                </Typography>
                <Paper sx={{ width: "100%", p: 4, mb: 2 }}>
                    <TextField
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        label="Enter text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleGenerate}
                        fullWidth
                    >
                        {generating
                            ? "Generating Flashcards..."
                            : "Generate Flashcards"}
                    </Button>
                </Paper>
            </Box>

            {generating && (
                <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="center"
                    mt={15}
                >
                    <CircularProgress />
                </Box>
            )}

            {/* Display flash cards */}
            {flashcards.length > 0 && (
                <Box my={5}>
                    <Typography
                        variant="h5"
                        component="h2"
                        textAlign="center"
                        sx={{ my: 3 }}
                    >
                        Preview Generated Flash Cards
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

            {/* Save flash card button */}
            {flashcards.length > 0 && (
                <Box sx={{ my: 4, display: "flex", justifyContent: "center" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpenDialog}
                    >
                        Save Flashcards
                    </Button>
                </Box>
            )}

            {/* Dialog box (modal) */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle sx={{ textAlign: "center" }}>
                    Save Flashcard Set
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter a name for your flashcard set.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Enter Name"
                        type="text"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSaveToFirebase} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
