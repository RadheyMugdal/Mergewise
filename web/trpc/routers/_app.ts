import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { dashboardRouter } from "@/modules/dashboard/server/router";
import { repositoryRouter } from "@/modules/repositories/server/router";
import { pricingRouter } from "@/modules/pricing/server/router";

export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query(async (opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),

    dashboard:dashboardRouter,
    repository:repositoryRouter,
    pricing:pricingRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
