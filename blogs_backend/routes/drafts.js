import koaRouter from "koa-router";
import { authMiddleware } from "../middleware/auth.js";
import {
  createDraft,
  deleteDraft,
  getDraft,
  updateDraft,
} from "../controller/drafts.js";
import {
  checkDraftAccess,
  checkMembershipForDrafts,
} from "../middleware/draftMiddleware.js";
const draftRouter = new koaRouter({ prefix: "/draft" });

draftRouter.get(
  "/",
  authMiddleware,
  checkMembershipForDrafts,
  checkDraftAccess,
  getDraft
);
draftRouter.post(
  "/create",
  authMiddleware,
  checkMembershipForDrafts,
  createDraft
);
draftRouter.put(
  "/",
  authMiddleware,
  checkMembershipForDrafts,
  checkDraftAccess,
  updateDraft
);
draftRouter.delete(
  "/",
  authMiddleware,
  checkMembershipForDrafts,
  checkDraftAccess,
  deleteDraft
);

export default draftRouter;
