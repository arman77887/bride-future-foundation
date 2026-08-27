import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Vacancy } from '../types';

export const Vacancies: React.FC = () => {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);

  useEffect(() => {
    api.get('/vacancies').then((res) => {
      setVacancies(res.data.data);
    }).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-green mb-6">Career Opportunities</h1>
      <div className="space-y-4">
        {vacancies.map((vacancy) => (
          <div key={vacancy.id} className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <h3 className="font-bold text-xl text-gray-900">{vacancy.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{vacancy.description}</p>
            <div className="mt-4 flex justify-between items-center text-sm">
              <span className="text-brand-green font-medium">Type: {vacancy.employment_type}</span>
              <span className="text-gray-500">Deadline: {vacancy.deadline}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
