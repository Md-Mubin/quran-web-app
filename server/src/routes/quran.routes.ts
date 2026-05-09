import { Router } from "express"
import { getSingleSurah, getAllSurah } from "../controllers/quran.controller"
import { graphqlQuery } from "../controllers/graphql.controller"

const router = Router()

router.get("/surah", getAllSurah)
router.get("/surah/:id", getSingleSurah)

// Proxy GraphQL queries
router.post("/graphql", graphqlQuery)

export default router