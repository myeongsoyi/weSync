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
    <div className="grid grid-cols-3 gap-4 p-4 w-full bg-green-300">
      <Link href={`/team/${teamId}/information`}>
        <div className={pathname === 'information' ? styles.yes : styles.no}>
          INFORMATION
        </div>
      </Link>
      <Link href={`/team/${teamId}/record`}>
        <div className={pathname === 'record' ? styles.yes : styles.no}>
          RECORD
        </div>
      </Link>
      <Link href={`/team/${teamId}/workspace`}>
        <div className={pathname === 'workspace' ? styles.yes : styles.no}>
          WORKSPACE
        </div>
      </Link>
    </div>
  );
}
