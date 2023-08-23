import koaRouter from "koa-router";
import { authMiddleware } from "../middleware/auth.js";
import {
  createDraft,
  deleteDraft,
  getDraft,
  updateDraft,
} from "../controller/drafts.js";
const draftRouter = new koaRouter({ prefix: "/draft" });

draftRouter.get("/", getDraft);
draftRouter.post("/create", createDraft);
draftRouter.put("/", updateDraft);
draftRouter.delete("/", deleteDraft);

export default draftRouter;
