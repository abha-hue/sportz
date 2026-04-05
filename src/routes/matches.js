import { Router } from "express";
import db from "../db.js";
import { matches } from "../schema.js";
import { createMatchSchema, listMatchesQuerySchema } from "../validation/matches.js";
import { getMatchStatus } from "../utils/match-status.js";
import { desc } from "drizzle-orm";
export const matchesRouter = Router();

matchesRouter.get('/', async (req, res) => {
    const parsedQuery = listMatchesQuerySchema.safeParse(req.query);

    if (!parsedQuery.success) {
        return res.status(400).json({ error: 'Invalid query.', details: parsedQuery.error.issues });
    }

    const MAX_LIMIT = 100;
    const limit = Math.min(parsedQuery.data.limit ?? 50, MAX_LIMIT);

    try {
        const data = await db
            .select()
            .from(matches)
            .orderBy((desc(matches.createdAt)))
            .limit(limit)

        res.json({ data });
    } catch (e) {
        res.status(500).json({ error: 'Failed to list matches.' });
    }
})


matchesRouter.post("/", async (req, res) => {
    const parsed = createMatchSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ errors: parsed.error });
    }
    try {
        const match = await db.insert(matches).values({
            ...parsed.data,
            startTime: new Date(parsed.data.startTime),
            endTime: new Date(parsed.data.endTime),
            homeScore: parsed.data.homeScore || 0,
            awayScore: parsed.data.awayScore || 0,
            status: getMatchStatus(parsed.data.startTime, parsed.data.endTime)
        }).returning();
        return res.status(201).json({ data: match });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
