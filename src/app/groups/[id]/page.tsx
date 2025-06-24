'use client';
import styles from '@/app/page.module.css';

import { useEffect, use, useState } from 'react';
import GroupInfoCard from "../components/GroupInfoCard";
import { useRouter } from 'next/navigation'
import { getGroupById } from '@services/groups/getById';

export default function GroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } =  use(params);
  const router = useRouter()
  

  if (!id) {
    router.push('/groups');
    return null; // or a loading state
  }
  

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <GroupInfoCard forumId={id} />
      </main>
    </div>
  );
}