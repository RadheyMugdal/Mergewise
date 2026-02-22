import {Worker} from "bullmq"
import dotenv from "dotenv"
import fs from 'fs'
import { App } from "octokit"
import { generateText } from 'ai';
import { openrouter } from "./utils/ai.js";
import { SYSTEM_PROMPT } from "./utils/index.js";
import { db } from "./db/index.js";
import { reviews } from "./db/schema.js";
import { eq, and } from "drizzle-orm";

dotenv.config()
const privateKey = process.env.GITHUB_APP_PRIVATE_KEY as string
const app=new App({
    appId:process.env.APP_ID!,
    privateKey:privateKey
})

// code review worker
const code_review_worker=new Worker('code-review',async({data})=>{
   try {
        console.log(`[Worker] Processing PR #${data.issue_number} in Repo:${data.repo}`)

        // Update status to running
        await db.update(reviews)
            .set({ status: "running" })
            .where(and(
                eq(reviews.pr_id, data.pr_id),
                eq(reviews.repo_id, data.repo_id)
            ));

        const octokit = await app.getInstallationOctokit(data.installationId)
        const {data:files}=await octokit.rest.pulls.listFiles({
            owner:data.owner,
            repo:data.repo,
            pull_number:data.issue_number
        })
        const {text}=await generateText({
            model:openrouter.chat(process.env.OPENROUTER_MODEL!),
            messages:[
                {
                    role:"system",
                    content:SYSTEM_PROMPT
                },
                {
                    role:"user",
                    content:files.map((file)=>`File: ${file.filename}\n\nDiff:\n${file.patch}`).join("\n\n")
                }
            ]
        })
        await octokit.rest.issues.createComment({
         owner:data.owner,
         repo:data.repo,
         issue_number:data.issue_number,
         body:text,
     })

    // Update status to completed and save review text
    await db.update(reviews)
        .set({ status: "completed", review: text })
        .where(and(
            eq(reviews.pr_id, data.pr_id),
            eq(reviews.repo_id, data.repo_id)
        ));

    console.log(`[Worker] PR #${data.issue_number} processed successfully`)

   } catch (error:any) {
    console.error(`[Worker] Error processing PR #${data.issue_number}:`, error);

    // Update status to failed
    try {
        await db.update(reviews)
            .set({ status: "failed" })
            .where(and(
                eq(reviews.pr_id, data.pr_id),
                eq(reviews.repo_id, data.repo_id)
            ));
    } catch (dbError) {
        console.error('[Worker] Failed to update database status to failed:', dbError);
    }

    throw new Error(error)
   }

},{connection:{
     host: process.env.REDIS_HOST || 'redis', // use env variable or fallback to service name
      port: parseInt(process.env.REDIS_PORT || '6379'),
},concurrency:5})

// log if job is completed
code_review_worker.on("completed",(job)=>{
    console.log(`job ${job.id} completed`)
})


//log if job is failed 
code_review_worker.on("failed",(job,err)=>{
    console.error(`Job ${job?.id} failed:`,err )
})

console.log("PR Worker started, listening for jobs...")