import express from "express";
import { matchesRouter } from "./routes/matches.js";
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Server is up and running!" });
});
app.use("/matches", matchesRouter);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

