import { getMainRecords } from '@/services/home';
import ListRecord from './listRecord';
import styles from './index.module.scss';


export default async function MainTeams() {
  const records = await getMainRecords();

  // const teams: {
  //     id: number;
  //     name: string;
  //     song: string;
  //     myPosition: {
  //         position: string;
  //         color: string;
  //     };
  //     teamImg: string;
  //     members: {
  //         id: number;
  //         name: string;
  //         profileImg: string;
  //     }[];
  // }[]

  return (
    <div className={styles.outer}>
      <ListRecord records={records} />
    </div>
  );
}
