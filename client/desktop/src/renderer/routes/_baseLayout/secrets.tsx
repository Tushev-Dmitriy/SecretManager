import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import styles from "./pages.module.css";
import { Button, SearchIcon, Table } from "@/renderer/components/ui";

// Типы данных
interface SecretType {
  id: number;
  name: string;
  category: string;
}

export const Route = createFileRoute("/_baseLayout/secrets")({
  component: RouteComponent,
});

function RouteComponent() {
  const [secrets, setSecrets] = useState<SecretType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSecret, setSelectedSecret] = useState<SecretType | null>(null);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Функция для загрузки данных из API
  const fetchSecrets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5227/api/keys/types');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSecrets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке данных');
      console.error('Error fetching secrets:', err);
    } finally {
      setLoading(false);
    }
  };

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    fetchSecrets();
  }, []);

  // Функции для работы с модальным окном
  const handleRequestClick = (secret: SecretType) => {
    setSelectedSecret(secret);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSecret(null);
    setReason('');
  };

  // Функция для отправки заявки
  const handleSubmitRequest = async () => {
    if (!selectedSecret || !reason.trim()) {
      alert('Пожалуйста, укажите причину запроса');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch('http://localhost:5227/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resource: selectedSecret.name,
          reason: reason.trim()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert('Заявка успешно отправлена!');
      handleCloseModal();
    } catch (err) {
      console.error('Error submitting request:', err);
      alert(`Ошибка при отправке заявки: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
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
              ) : secrets.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
                    Секреты не найдены
                  </td>
                </tr>
              ) : (
                secrets.map((secret) => (
                  <tr key={secret.id}>
                    <td>{secret.name}</td>
                    <td>{secret.category}</td>
                    <td>
                      <Button onClick={() => handleRequestClick(secret)}>
                        Запросить
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Модальное окно для создания заявки */}
      {isModalOpen && selectedSecret && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Запрос доступа к "{selectedSecret.name}"</h2>
              <button 
                className={styles.closeButton}
                onClick={handleCloseModal}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.requestInfo}>
                <p><strong>Ресурс:</strong> {selectedSecret.name}</p>
                <p><strong>Тип:</strong> {selectedSecret.category}</p>
              </div>
              
              <div className={styles.reasonSection}>
                <label htmlFor="reason" className={styles.reasonLabel}>
                  Причина запроса:
                </label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Укажите причину, по которой вам необходим доступ к этому ресурсу"
                  className={styles.reasonTextarea}
                  rows={4}
                />
              </div>
            </div>
            
            <div className={styles.modalFooter}>
              <Button 
                onClick={handleCloseModal}
                style={{ 
                  background: '#6b7280', 
                  marginRight: '12px'
                }}
              >
                Отмена
              </Button>
              <Button 
                onClick={handleSubmitRequest}
                disabled={isSubmitting || !reason.trim()}
                style={{
                  opacity: isSubmitting || !reason.trim() ? 0.5 : 1,
                  cursor: isSubmitting || !reason.trim() ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? 'Отправка...' : 'Запросить'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
