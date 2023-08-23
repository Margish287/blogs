import { sendResponse } from "../utils/sendResponse.js";

export const createDraft = (ctx) => {
  console.log("create draft");

  sendResponse(ctx, 200, {
    message: "Draft created.",
    success: true,
  });
};

export const getDraft = (ctx) => {
  console.log("get draft");

  sendResponse(ctx, 200, {
    message: "Draft displayed.",
    success: true,
  });
};

export const updateDraft = (ctx) => {
  console.log("update draft");

  sendResponse(ctx, 200, {
    message: "Draft updated.",
    success: true,
  });
};

export const deleteDraft = (ctx) => {
  console.log("delete draft");

  sendResponse(ctx, 200, {
    message: "Draft deleted.",
    success: true,
  });
};
