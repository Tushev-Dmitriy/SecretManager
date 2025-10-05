import { createFileRoute } from "@tanstack/react-router";
import styles from "./pages.module.css";
import { Button, SearchIcon, Table } from "@/renderer/components/ui";

export const Route = createFileRoute("/_baseLayout/secrets")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <h2>База секретов</h2>
        <div className={styles.inputWrapper}>
          <div className={styles.searchInput}>
            <SearchIcon className={styles.searchIcon} />
            <div className={styles.divider}></div>
            <input type="text" placeholder="Поиск" className={styles.input} />
          </div>
          <Button>Создать заявку</Button>
        </div>
        <div className={styles.tableContainer}>
          <Table className={styles.table}>
            <thead>
              <tr className={styles.tableHeader}>
                <th>Название</th>
                <th>Тип</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Production DB</td>
                <td>PostgreSQL</td>
                <td>
                  <Button>Запросить</Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
