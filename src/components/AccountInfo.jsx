import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function AccountInfo() {
  const { getAccountInfo } = useAuth();
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccountData = async () => {
      const result = await getAccountInfo();
      if (result.success) {
        setAccountData(result.data);
      } else {
        setError(result.error);
      }
      setLoading(false);
    };

    fetchAccountData();
  }, [getAccountInfo]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="account-info">
      <h2>Account Information</h2>
      {accountData && (
        <>
          <p>Email: {accountData.email}</p>
          {/* Add more account data fields as they become available from the API */}
        </>
      )}
    </div>
  );
}

export default AccountInfo; 