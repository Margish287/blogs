import blogsRouter from "./blogs.js";
import draftRouter from "./drafts.js";
import userRoute from "./users.js";

const routers = [blogsRouter, userRoute, draftRouter];

export default (app) => {
  routers.forEach((router) => {
    app.use(router.routes()).use(router.allowedMethods());
  });
};
