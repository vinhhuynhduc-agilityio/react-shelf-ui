import { useState } from 'react';

export const useRowSelection = () => {
  const [selectedUserId, setSelectedUser] = useState<string | null>(null);
  const [sourceComponent, setSourceComponent] = useState<string | null>(null);

  const handleRowSelected = (userId: string | null, source: string) => {
    setSelectedUser(userId);
    setSourceComponent(source);
  };

  return { selectedUserId, sourceComponent, handleRowSelected };
};
