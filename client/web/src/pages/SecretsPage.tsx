import { useState, useEffect } from "react";
import styles from "../App.module.css";

interface KeyType {
  id: number;
  name: string;
  category: string;
}

interface Secret {
  id: number;
  userId: string;
  keyTypeId: number;
  keyType: KeyType;
  issuedAt: string;
  expiresAt: string;
}

const SecretsPage = () => {
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Функция для загрузки секретов из API
  const fetchSecrets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5227/api/keys');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSecrets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке секретов');
      console.error('Error fetching secrets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecrets();
  }, []);

  return (
    <div className={styles.content}>
      <div className={styles.pageHeader}>
        <h1>Все секреты</h1>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loading}>Загрузка...</div>
        ) : error ? (
          <div className={styles.error}>
            Ошибка: {error}
            <button onClick={fetchSecrets} className={styles.retryButton}>
              Повторить
            </button>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeader}>
                <th>Название секрета</th>
                <th>Категория</th>
              </tr>
            </thead>
            <tbody>
              {secrets.length === 0 ? (
                <tr>
                  <td colSpan={2} style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
                    Секреты не найдены
                  </td>
                </tr>
              ) : (
                secrets.map((secret) => (
                  <tr key={secret.id}>
                    <td>{secret.keyType.name}</td>
                    <td>{secret.keyType.category}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SecretsPage;