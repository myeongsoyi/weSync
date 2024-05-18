import styles from "./index.module.scss";
import Table from "./table";

export default async function TeamWorkspacePrivate() {

  return (
    <div className={styles.article}>
      <div className={styles.table}>
        <Table />
      </div>
    </div>
  );
}