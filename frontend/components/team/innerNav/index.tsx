'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import styles from './index.module.scss';

// interface IParams {
//   params: { teamId: string };
// }

// export default function InnerNavigation({ params: { teamId } }: IParams) {
export default function InnerNavigation() {
  const { teamId } = useParams();
  const pathname = usePathname().split('/').pop();

  return (
    <div className={`grid grid-cols-3 w-full ${styles.navContainer}`}>
      <Link
        href={`/team/${teamId}/information`}
        className={pathname === 'information' ? styles.yes : styles.no}
        prefetch
      >
        <span className={styles.title}>INFORMATION</span>
      </Link>
      <Link
        href={`/team/${teamId}/record`}
        className={pathname === 'record' ? styles.yes : styles.no}
        prefetch
      >
        <span className={styles.title}>RECORD</span>
      </Link>
      <Link
        href={`/team/${teamId}/workspace`}
        className={pathname === 'workspace' ? styles.yes : styles.no}
        prefetch
      >
        <span className={styles.title}>WORKSPACE</span>
      </Link>
    </div>
  );
}
