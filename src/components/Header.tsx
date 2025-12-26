import { memo, useCallback, useMemo } from 'react';
import type { BreakEntry } from '../types';
import Papa from 'papaparse';

interface HeaderProps {
  breaks: BreakEntry[];
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  onReset: () => void;
  selectedDate: string;
}

function Header({
  breaks,
  darkMode,
  setDarkMode,
  onReset,
  selectedDate,
}: HeaderProps) {
  const exportCSV = useCallback(() => {
    if (breaks.length === 0) return;
    const csv = Papa.unparse(
      breaks.map((b) => ({
        Date: b.date,
        'Start Time': b.start,
        'End Time': b.end,
        Duration: `${b.duration} mins`,
      }))
    );
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `breaks_${selectedDate}.csv`;
    link.click();
  }, [breaks, selectedDate]);

  const exportButtonClass = useMemo(() => {
    const baseClasses = 'px-4 py-2 rounded cursor-pointer';
    if (breaks.length === 0) {
      return `${baseClasses} bg-gray-400 cursor-not-allowed text-gray-700`;
    }
    const colorClasses = darkMode
      ? 'bg-green-600 text-white hover:bg-green-700'
      : 'bg-green-500 text-white hover:bg-green-600';
    return `${baseClasses} ${colorClasses}`;
  }, [breaks.length, darkMode]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(!darkMode);
  }, [darkMode, setDarkMode]);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 className="text-2xl sm:text-3xl font-bold">🕒 Work Timer</h1>
      <div className="flex gap-2 flex-wrap w-full sm:w-auto">
        <button
          onClick={exportCSV}
          disabled={breaks.length === 0}
          className={`${exportButtonClass} text-base sm:text-base flex-1 sm:flex-initial min-h-[44px]`}
        >
          📦 Export
        </button>
        <button
          onClick={toggleDarkMode}
          className={`px-4 sm:px-4 py-2.5 rounded cursor-pointer text-base sm:text-base flex-1 sm:flex-initial min-h-[44px] ${
            darkMode
              ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'
              : 'bg-gray-800 text-white hover:bg-gray-900'
          }`}
        >
          {darkMode ? '🌞 Light' : '🌙 Dark'}
        </button>
        <button
          onClick={onReset}
          className={`px-4 sm:px-4 py-2.5 rounded cursor-pointer text-base sm:text-base flex-1 sm:flex-initial min-h-[44px] ${
            darkMode
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-red-500 text-white hover:bg-red-600'
          }`}
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
}

export default memo(Header);

