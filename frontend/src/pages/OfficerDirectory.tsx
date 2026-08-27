import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { OfficerProfile } from '../types';

export const OfficerDirectory: React.FC = () => {
  const [officers, setOfficers] = useState<OfficerProfile[]>([]);

  useEffect(() => {
    api.get('/officers').then((res) => {
      setOfficers(res.data.data);
    }).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-green mb-6">Verified Officer Directory</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {officers.map((officer) => (
          <div key={officer.id} className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <h3 className="font-bold text-lg text-gray-900">{officer.name}</h3>
            <p className="text-sm text-brand-green font-medium">{officer.official_id}</p>
            <p className="text-sm text-gray-600 mt-2">Email: {officer.email_personal}</p>
            <p className="text-sm text-gray-600">Phone: {officer.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
