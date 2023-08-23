import koaRouter from "koa-router";
import { authMiddleware } from "../middleware/auth.js";
import {
  createDraft,
  deleteDraft,
  getDraft,
  updateDraft,
} from "../controller/drafts.js";
import { checkDraftAccess } from "../middleware/draftMiddleware.js";
const draftRouter = new koaRouter({ prefix: "/draft" });

draftRouter.get("/", authMiddleware, checkDraftAccess, getDraft);
draftRouter.post("/create", authMiddleware, createDraft);
draftRouter.put("/", authMiddleware, checkDraftAccess, updateDraft);
draftRouter.delete("/", authMiddleware, checkDraftAccess, deleteDraft);

export default draftRouter;
