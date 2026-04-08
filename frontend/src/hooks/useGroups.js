import { useCallback, useEffect, useState } from 'react';

function useGroups() {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchGroups = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await fetch('/groups');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch groups');
      }

      setGroups(data);
    } catch (fetchError) {
      setError(fetchError.message || 'Failed to fetch groups');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return {
    groups,
    isLoading,
    error,
    refreshGroups: fetchGroups,
  };
}

export default useGroups;
