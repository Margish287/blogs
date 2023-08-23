import { v4 as uuid4 } from "uuid";
import { sendResponse } from "../utils/sendResponse.js";
import {
  createDraftQuery,
  deleteDraftQuery,
  getDraftQuery,
  updateDraftQuery,
} from "../modal/draftBlog.js";

export const createDraft = async (ctx) => {
  const { id, ownerId } = ctx.state.user;
  const { title = "", content = "", tags = [] } = ctx.request.body;

  const draftObj = {
    _id: uuid4(),
    title,
    content,
    tags,
    creatorId: id,
    ownerId,
  };

  const draft = await createDraftQuery(draftObj);
  if (!draft.acknowledged) {
    return ctx.throw(400, {
      message: "Something went wrong while creating draft.",
      success: false,
    });
  }

  sendResponse(ctx, 200, {
    message: "Draft created.",
    success: true,
  });
};

export const getDraft = async (ctx) => {
  const { draft } = ctx.state;
  sendResponse(ctx, 200, {
    message: "Draft displayed successfully",
    draft,
    success: true,
  });
};

export const updateDraft = async (ctx) => {
  const { title = "", content = "", tags = [] } = ctx.request.body;
  const { draft } = ctx.state;

  let updateDraftObj = {};
  if (title) updateDraftObj["title"] = title;
  if (content) updateDraftObj["content"] = content;
  if (tags.length) updateDraftObj["tags"] = [...tags];

  const updatedDraft = await updateDraftQuery(
    { _id: draft._id },
    { $set: updateDraftObj }
  );

  if (!updatedDraft.acknowledged) {
    return ctx.throw(400, {
      message: "Something went wrong while updating draft.",
      success: false,
    });
  }

  const editedDraft = await getDraftQuery({ _id: draft._id });

  sendResponse(ctx, 200, {
    message: "Draft updated.",
    draft: editedDraft,
    success: true,
  });
};

export const deleteDraft = async (ctx) => {
  const { draft } = ctx.state;

  const deletedDraft = await deleteDraftQuery({ _id: draft._id });
  if (!deletedDraft.deletedCount) {
    return ctx.throw(400, {
      message: "Something went wrong while deleting draft.",
      success: true,
    });
  }

  sendResponse(ctx, 200, {
    message: "Draft deleted.",
    success: true,
  });
};
