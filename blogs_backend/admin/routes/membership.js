import koaRouter from "koa-router";

const membershipAdmin = new koaRouter({ prefix: "/membership" });

membershipAdmin.post("/");
