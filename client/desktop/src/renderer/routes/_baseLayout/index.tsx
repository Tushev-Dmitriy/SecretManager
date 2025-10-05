import { Button, SearchIcon, Table } from "@/renderer/components/ui";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import styles from "./pages.module.css";

// Типы данных
interface RequestItem {
  name: string;
  type: string;
  status: number; // 0 - PENDING, 1 - APPROVED, 2 - REJECTED
}

export const Route = createFileRoute("/_baseLayout/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSecret, setSelectedSecret] = useState<any>(null);
  const [secretLoading, setSecretLoading] = useState(false);
  const [copyNotification, setCopyNotification] = useState<string | null>(null);

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

  // Функция для загрузки секрета по имени
  const fetchSecret = async (name: string) => {
    try {
      setSecretLoading(true);
      const response = await fetch(`http://localhost:5227/api/openbao/${name}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSelectedSecret(data);
      setIsModalOpen(true);
    } catch (err) {
      console.error('Error fetching secret:', err);
      alert(`Ошибка при загрузке секрета: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
    } finally {
      setSecretLoading(false);
    }
  };

  // Функция для обработки клика по строке
  const handleRowClick = (request: RequestItem) => {
    if (request.status === 1) { // Только для одобренных
      fetchSecret(request.name);
    }
  };

  // Функция для закрытия модального окна
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSecret(null);
  };

  // Функция для копирования в буфер обмена
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyNotification(`Скопировано: ${text}`);
      
      // Автоматически скрываем уведомление через 2 секунды
      setTimeout(() => {
        setCopyNotification(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      setCopyNotification('Ошибка копирования');
      
      setTimeout(() => {
        setCopyNotification(null);
      }, 2000);
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
                requests.map((request, index) => (
                  <tr 
                    key={index}
                    onClick={() => handleRowClick(request)}
                    className={request.status === 1 ? styles.clickableRow : ''}
                    style={{ cursor: request.status === 1 ? 'pointer' : 'default' }}
                  >
                    <td>{request.name}</td>
                    <td>{request.type}</td>
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

      {/* Модальное окно для отображения секрета */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Секрет</h2>
              <button 
                className={styles.closeButton}
                onClick={handleCloseModal}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalBody}>
              {copyNotification && (
                <div className={styles.copyNotification}>
                  {copyNotification}
                </div>
              )}
              
              {secretLoading ? (
                <div className={styles.loading}>Загрузка секрета...</div>
              ) : selectedSecret ? (
                <div className={styles.secretContent}>
                  {Object.entries(selectedSecret).map(([key, value]) => (
                    <div key={key} className={styles.secretItem}>
                      <div className={styles.secretLabel}>{key}:</div>
                      <div 
                        className={styles.secretValue}
                        onClick={() => copyToClipboard(String(value))}
                        title="Нажмите для копирования"
                      >
                        {String(value)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>Нет данных для отображения</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
