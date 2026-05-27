import express from "express";
import { addKeyword, getTrackedKeywords, getSingleKeyword, refreshKeyword, deleteKeyword, toggleTrackingStatus } from "../controllers/rankController.js";
import auth from "../middleware/authMiddleware.js";

const rankRouter = express.Router();

rankRouter.post("/add", auth, addKeyword);
rankRouter.get("/keywords", auth, getTrackedKeywords);
rankRouter.get("/keyword/:id", auth, getSingleKeyword);
rankRouter.post("/refresh/:id", auth, refreshKeyword);
rankRouter.delete("/delete/:id", auth, deleteKeyword);
rankRouter.put("/toggle/:id", auth, toggleTrackingStatus);

export default rankRouter;
