import { getDraftQuery } from "../modal/draftBlog.js";

export const checkDraftAccess = async (ctx, next) => {
  const { id } = ctx.state.user;
  const { draftId } = ctx.request.body;

  const draft = await getDraftQuery({ _id: draftId });
  if (!draft) {
    return ctx.throw(404, {
      message: "Draft not found",
      success: true,
    });
  }

  if (draft.creatorId !== id) {
    return ctx.throw(401, {
      message: "You don't have any permission to access/edit this draft",
      success: false,
    });
  }

  ctx.state.draft = draft;
  await next();
};
