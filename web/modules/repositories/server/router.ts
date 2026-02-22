import { db } from "@/db";
import { repositories, reviews } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { appRouter } from "@/trpc/routers/_app";
import { eq } from "drizzle-orm";
import z from "zod";

export const repositoryRouter=createTRPCRouter({
    get:protectedProcedure.input(z.object({
        id:z.string()
    })).query(async ({ctx,input})=>{
        const [repositoryData]=await db.select().from(repositories).where(eq(repositories.id,parseInt(input.id))).limit(1)
        return repositoryData
    }),
    getReviews:protectedProcedure.input(z.object({
        id:z.string()
    })).query(async ({ctx,input})=>{
        const reviewsData=await db.select().from(reviews).where(eq(reviews.repo_id,parseInt(input.id)))
        return reviewsData
    })
})