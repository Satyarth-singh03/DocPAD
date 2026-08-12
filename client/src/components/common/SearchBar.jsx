import React, { useState, useEffect, useRef } from 'react';
import { Search, User, FileText, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';

export const SearchBar = ({ onSelectPatient, placeholder = "Search by Patient ID or Name..." }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.getPatients(query);
        if (res.success) {
          setResults(res.patients);
          setIsOpen(true);
        }
      } catch (err) {
        console.warn('Search error:', err.message);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (patient) => {
    setQuery('');
    setIsOpen(false);
    if (onSelectPatient) onSelectPatient(patient);
  };

  return (
    <div className="relative w-full max-w-xl" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400 transition-colors"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {/* Auto-suggestion Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden divide-y divide-gray-100">
          {results.length > 0 ? (
            results.map((patient) => (
              <button
                key={patient.id}
                onClick={() => handleSelect(patient)}
                className="w-full text-left px-4 py-3 hover:bg-sky-50 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-semibold text-xs border border-sky-200">
                    {patient.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-black group-hover:text-sky-900">{patient.name}</span>
                      <span className="text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded border border-gray-200 font-mono font-medium">
                        {patient.patient_id}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                      {patient.age}y, {patient.gender} • Reason: {patient.reason_for_visit}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
              </button>
            ))
          ) : (
            <div className="px-4 py-4 text-center text-sm text-gray-500">
              No matching patient records found for "<span className="font-semibold">{query}</span>"
            </div>
          )}
        </div>
      )}
    </div>
  );
};
