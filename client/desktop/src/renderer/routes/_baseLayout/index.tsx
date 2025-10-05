import { Button, SearchIcon, Table } from "@/renderer/components/ui";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import styles from "./pages.module.css";

// Типы данных
interface RequestItem {
  id: string;
  userId: string;
  resource: string;
  reason: string;
  status: number; // 0 - PENDING, 1 - APPROVED, 2 - REJECTED
  createdAt: string;
}

export const Route = createFileRoute("/_baseLayout/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Функция для загрузки данных из API
  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5227/api/requests/my');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке данных');
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    fetchRequests();
  }, []);

  // Функция для получения текста статуса
  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return "В ожидании";
      case 1:
        return "Одобрено";
      case 2:
        return "Отклонено";
      default:
        return "Неизвестно";
    }
  };

  // Функция для получения CSS класса статуса
  const getStatusClass = (status: number) => {
    switch (status) {
      case 0:
        return styles.statusPending;
      case 1:
        return styles.statusApproved;
      case 2:
        return styles.statusDenied;
      default:
        return "";
    }
  };
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
              {loading ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', padding: '32px' }}>
                    Загрузка...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', padding: '32px', color: 'red' }}>
                    Ошибка: {error}
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
                    Заявки не найдены
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.resource}</td>
                    <td>{request.reason}</td>
                    <td>
                      <span className={getStatusClass(request.status)}>
                        {getStatusText(request.status)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
