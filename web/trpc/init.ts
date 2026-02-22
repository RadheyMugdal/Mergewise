import { auth } from "@/lib/auth";
import { initTRPC, TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import { cache } from "react";
import superjson from "superjson";

export const createTRPCContext = cache(async () => {
  return {
    // auth : ...
  };
});

const t = initTRPC.create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure=baseProcedure.use(async (opts)=>{
  const {ctx}=opts
  const session=await auth.api.getSession({
    headers:await headers()
  })
  if (!session?.session ){
    throw new TRPCError({code:"UNAUTHORIZED"})
  }

  
  return opts.next({
    ctx:{
      ...ctx,
      user:session.user
    }
  })
})