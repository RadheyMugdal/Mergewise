import { db } from '@/db'
import { installations, repositories, reviews, account,  user } from '@/db/schema'

import { eq } from 'drizzle-orm'
import { NextRequest } from 'next/server'
import { Octokit, App } from 'octokit'
import { canUserReview } from '@/lib/usage-tracking'
import RebbitMQ from '@/lib/rebbitmq'
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
      // const account = payload.installation.account!
      // const accountLogin = "login" in account ? account.login : account.slug
      const [accountData]=await db.select({
        user_id:account.userId,
        id:account.accountId
      }).from(account).where(eq(account.accountId,String(payload.installation.account?.id)))
      
      await db.insert(installations).values({
        id:payload.installation.id.toString(),
        account_id:accountData.id,
        user_id:accountData.user_id
      }).onConflictDoNothing()

      for(const repo of payload.repositories_added){
        await db.insert(repositories).values({
          id:repo.id,
          name:repo.name,
          full_name:repo.full_name,
          private:repo.private,
          installation_id:payload.installation.id.toString()
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
   // Get the installation to find the user
   const [installation] = await db.select({
     user_id: installations.user_id
   }).from(installations).where(eq(installations.id, payload.installation!.id.toString())).limit(1)

   if (!installation?.user_id) {
     console.error('Installation not linked to user, skipping review')
     return
   }

   // Check if user can perform review (within limits)
   const canReview = await canUserReview(installation.user_id)
   if (!canReview) {
     console.log(`User ${installation.user_id} has exceeded review limit, skipping review`)
     return
   }

   await db.insert(reviews).values({
     pr_id:payload.pull_request.id,
     pr_opened:payload.pull_request.state ==="open" ?true:false,
     pr_title:payload.pull_request.title,
     pr_url:payload.pull_request.html_url,
     repo_id:payload.repository.id,
     user_id: installation.user_id,
     status:"pending",
   })
   const mq=await RebbitMQ.getInstance()
    await mq.sendToQueue('review-jobs',{
       installationId:payload.installation!.id,
       owner:payload.repository.owner.login,
       repo:payload.repository.name,
       issue_number:payload.pull_request.number,
       repo_id: payload.repository.id,
       pr_id: payload.pull_request.id,
     },'code-review')
 } catch (error) {
  console.error(error)
 }

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