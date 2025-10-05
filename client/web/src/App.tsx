import styles from "./App.module.css";
import { SearchIcon } from "./icons/SearchIcon";
import { useState, useEffect } from "react";

// Типы
interface RequestItem {
  id: string;
  userId: string;
  resource: string;
  reason: string;
  status: number; // 0 - denied, 1 - approved, 2 - pending (предполагаем)
  createdAt: string;
}

interface Secret {
  name: string;
  category: string;
  content: string;
}

// Список доступных категорий
const CATEGORIES = [
  "MySQL",
  "PostgreSQL", 
  "Oracle",
  "MS_SQL_Server",
  "MongoDB",
  "REST_endpoints",
  "GraphQL_APIs",
  "SOAP_services",
  "SMB_shares",
  "NFS_mounts",
  "FTP_SFTP_servers",
  "Zabbix",
  "Nagios",
  "Prometheus",
  "Jenkins",
  "Docker_Registry"
];

const App = () => {
    const [requests, setRequests] = useState<RequestItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Функция для загрузки данных из API
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://localhost:5227/api/requests');
        
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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [secretForm, setSecretForm] = useState<Secret>({
      name: "",
      category: "",
      content: "",
    });

    const handleStatusChange = (id: string, newStatus: number) => {
      setRequests((prev) =>
        prev.map((request) =>
          request.id === id ? { ...request, status: newStatus } : request
        )
      );
    };

    const getStatusClass = (status: number) => {
      switch (status) {
        case 0:
          return styles.statusDenied;
        case 1:
          return styles.statusApproved;
        case 2:
          return styles.statusPending;
        default:
          return "";
      }
    };

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const handleOpenModal = () => {
      setIsModalOpen(true);
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
      setSecretForm({ name: "", category: "", content: "" });
    };

    const handleInputChange = (field: keyof Secret, value: string) => {
      setSecretForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
      if (!secretForm.name || !secretForm.category || !secretForm.content) {
        alert('Пожалуйста, заполните все поля');
        return;
      }

      try {
        // Парсим контент как JSON
        let contentData;
        try {
          contentData = JSON.parse(secretForm.content);
          
          // Проверяем, что это объект (не массив и не примитив)
          if (typeof contentData !== 'object' || contentData === null || Array.isArray(contentData)) {
            alert('Контент должен быть JSON объектом с парами ключ-значение');
            return;
          }
        } catch (error) {
          alert('Контент должен быть валидным JSON объектом');
          return;
        }

        const payload = {
          data: contentData,
          category: secretForm.category
        };

        const response = await fetch(`http://localhost:5227/api/openbao/${secretForm.name}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        alert('Секрет успешно создан!');
        handleCloseModal();
        
        // Обновляем список заявок после создания секрета
        fetchRequests();
      } catch (error) {
        console.error('Error creating secret:', error);
        alert(`Ошибка при создании секрета: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
      }
    };
  return (
    <>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <a>
            <img src="/secretLogo.png" alt="secretLogo" width={300}/>
          </a>
        </nav>
      </header>

      <div className={styles.content}>
        <div className={styles.pageHeader}>
          <h1>Заявки</h1>
          <div className={styles.searchWrapper}>
            <div className={styles.searchInput}>
              <SearchIcon className={styles.searchIcon} />
              <input type="text" placeholder="Поиск" className={styles.input} />
            </div>
            <button 
              className={styles.addButton}
              onClick={handleOpenModal}
            >
              Добавить секрет
            </button>
          </div>
        </div>

        <div className={styles.tableContainer}>
          {loading ? (
            <div className={styles.loading}>Загрузка...</div>
          ) : error ? (
            <div className={styles.error}>
              Ошибка: {error}
              <button onClick={fetchRequests} className={styles.retryButton}>
                Повторить
              </button>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHeader}>
                  <th>ID заявки</th>
                  <th>Пользователь</th>
                  <th>Ресурс</th>
                  <th>Статус</th>
                  <th>Обоснование</th>
                  <th>Дата создания</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.id.substring(0, 8)}...</td>
                    <td>{request.userId.substring(0, 8)}...</td>
                    <td>{request.resource}</td>
                    <td>
                      <select
                        value={request.status}
                        onChange={(e) =>
                          handleStatusChange(
                            request.id,
                            parseInt(e.target.value)
                          )
                        }
                        className={`${styles.statusSelect} ${getStatusClass(
                          request.status
                        )}`}
                      >
                        <option value={0}>Отказано</option>
                        <option value={1}>Выдан</option>
                        <option value={2}>На проверке</option>
                      </select>
                    </td>
                    <td>{request.reason}</td>
                    <td>{formatDate(request.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Модальное окно для добавления секрета */}
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
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="Название секрета"
                  value={secretForm.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={styles.modalInput}
                />
              </div>
              
              <div className={styles.inputGroup}>
                <select
                  value={secretForm.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={styles.modalSelect}
                >
                  <option value="">Выберите категорию</option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className={styles.inputGroup}>
                <textarea
                  placeholder={`Контент (JSON объект, например):
{
  "additionalProp1": "string",
  "additionalProp2": "string",
  "additionalProp3": "string"
}`}
                  value={secretForm.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  className={styles.modalTextarea}
                  rows={8}
                />
              </div>
            </div>
            
            <div className={styles.modalFooter}>
              <button 
                className={`${styles.createButton} ${
                  !secretForm.name || !secretForm.category || !secretForm.content 
                    ? styles.createButtonDisabled 
                    : ''
                }`}
                onClick={handleSubmit}
                disabled={!secretForm.name || !secretForm.category || !secretForm.content}
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
