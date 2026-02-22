import { db } from '@/db'
import { installations, repositories, reviews } from '@/db/schema'
import { review_queue } from '@/lib/queue'
import { Webhooks } from '@octokit/webhooks'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { Octokit, App } from 'octokit'
export const runtime = "nodejs";
const appId = process.env.APP_ID as string
const privateKey = process.env.GITHUB_APP_PRIVATE_KEY as string
const secret = process.env.WEBHOOK_SECRET as string
const enterpriseHostname = process.env.ENTERPRISE_HOSTNAME


const app = new App({
  appId,
  privateKey,
  webhooks: {   
    secret
  },
  ...(enterpriseHostname && {
    Octokit: Octokit.defaults({
      baseUrl: `https://${enterpriseHostname}/api/v3`
    })
  })
})

app.webhooks.on("installation_repositories.added",async ({payload})=>{
    try {
      const account = payload.installation.account!
      const accountLogin = "login" in account ? account.login : account.slug
      
      await db.insert(installations).values({
        id:payload.installation.id,
        account_id:account.id,
        account_login:accountLogin,
      }).onConflictDoNothing()

      for(const repo of payload.repositories_added){
        await db.insert(repositories).values({
          id:repo.id,
          name:repo.name,
          full_name:repo.full_name,
          private:repo.private,
          installation_id:payload.installation.id
        }).onConflictDoNothing()
      }

      for(const repo of payload.repositories_removed){
        await db.delete(repositories).where(eq(repositories.id,repo.id!))
      }

    } catch (error:any) {
     console.error(error)
    }

})

app.webhooks.on("installation_repositories.removed",async ({payload})=>{
    try {
      
      for(const repo of payload.repositories_removed){
        await db.delete(repositories).where(eq(repositories.id,repo.id!))
      }

    } catch (error:any) {
     console.error(error)
    }

})

app.webhooks.on('pull_request.opened',async ({payload})=>{
 try {
   await db.insert(reviews).values({
     pr_id:payload.pull_request.id,
     pr_opened:payload.pull_request.state ==="open" ?true:false,
     pr_title:payload.pull_request.title,
     pr_url:payload.pull_request.html_url,
     repo_id:payload.repository.id,
     status:"pending",
   })

    await review_queue.add(`repo:${payload.repository.id} pr:${payload.pull_request.id}`,{
       installationId:payload.installation!.id,
       owner:payload.repository.owner.login,
       repo:payload.repository.name,
       issue_number:payload.pull_request.number,
       repo_id: payload.repository.id,
       pr_id: payload.pull_request.id,
     })
 } catch (error) {
  console.error(error)
 }

})

app.webhooks.on("installation.created", async ({ payload }) => {
  const account = payload.installation.account!
  const accountLogin = "login" in account ? account.login : account.slug
  await db.insert(installations)
    .values({
      id: payload.installation.id,
      account_id: account.id,
      account_login: accountLogin,
    })
    .onConflictDoNothing()
})

export  async function POST(req:NextRequest){
const payload = await req.text();

  const signature = req.headers.get("x-hub-signature-256")!;
  const id = req.headers.get("x-github-delivery")!;
  const event = req.headers.get("x-github-event")!;

  await app.webhooks.verifyAndReceive({
    id,
    name: event as any,
    signature,
    payload,
  });

  return new Response("ok");
}