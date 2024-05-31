import React, { useState, useEffect } from 'react';
import { getTables } from '../services/api';

const Tables = () => {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await getTables();
        setTables(response.data);
      } catch (error) {
        console.error('Error fetching tables:', error);
      }
    };

    fetchTables();
  }, []);

  return (
    <div>
      <h2>Tables</h2>
      <ul>
        {tables.map((table) => (
          <li key={table._id}>
            Table {table.tableNumber}: {table.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tables;
