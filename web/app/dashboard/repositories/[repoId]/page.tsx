// app/dashboard/repositories/[repoId]/page.tsx
import RepositoryView from "@/modules/repositories/components/RepositoryPage";
import { HydrateClient, trpc } from "@/trpc/server";
import React from "react";

interface RepositoryPageProps {
  params: Promise<{
    repoId: string;
  }>;
}

const RepositoryPage = async ({ params }: RepositoryPageProps) => {
  // await params if it's a Promise
  const resolvedParams = await params;
  const { repoId } = resolvedParams;
  await trpc.repository.get.prefetch({id:repoId})
  
  return (
    <HydrateClient>
      <RepositoryView id={repoId}/>
    </HydrateClient>
  );
};

export default RepositoryPage;