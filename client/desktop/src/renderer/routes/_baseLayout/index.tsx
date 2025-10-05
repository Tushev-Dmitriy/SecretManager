import { Badge, Button, SearchIcon, Table } from "@/renderer/components/ui";
import { createFileRoute } from "@tanstack/react-router";
import styles from "./pages.module.css";

export const Route = createFileRoute("/_baseLayout/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <h2>Главная</h2>
        <p>Список последних заявок</p>
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
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Production DB</td>
                <td>PostgreSQL</td>
                <td>
                  <Badge status="denied" />
                </td>
              </tr>
              <tr>
                <td>Test DB</td>
                <td>MySQL</td>
                <td>
                  <Badge status="pending" />
                </td>
              </tr>
              <tr>
                <td>CRM GraphQL Endpoint</td>
                <td>GraphQL API</td>
                <td>
                  <span className={styles.statusPending}>В ожидании</span>
                </td>
              </tr>
              <tr>
                <td>Production DB</td>
                <td>PostgreSQL</td>
                <td>
                  <span className={styles.statusDenied}>Нет доступа</span>
                </td>
              </tr>
              <tr>
                <td>Test DB</td>
                <td>MySQL</td>
                <td>
                  <span className={styles.statusApproved}>Доступен</span>
                </td>
              </tr>
              <tr>
                <td>CRM GraphQL Endpoint</td>
                <td>GraphQL API</td>
                <td>
                  <span className={styles.statusPending}>В ожидании</span>
                </td>
              </tr>
              <tr>
                <td>Production DB</td>
                <td>PostgreSQL</td>
                <td>
                  <span className={styles.statusDenied}>Нет доступа</span>
                </td>
              </tr>
              <tr>
                <td>Test DB</td>
                <td>MySQL</td>
                <td>
                  <span className={styles.statusApproved}>Доступен</span>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
