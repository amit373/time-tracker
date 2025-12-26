import { memo, useCallback, useMemo } from 'react';
import dayjs from 'dayjs';

interface SummaryProps {
  gross: number;
  worked: number;
  remaining: number;
  overtime: number;
  expectedEnd: dayjs.Dayjs | null;
  darkMode: boolean;
}

function Summary({
  gross,
  worked,
  remaining,
  overtime,
  expectedEnd,
  darkMode,
}: SummaryProps) {
  const formatTime = useCallback((minutes: number) => {
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  }, []);

  const expectedEndFormatted = useMemo(() => {
    return expectedEnd ? expectedEnd.format('hh:mm:ss A') : '---';
  }, [expectedEnd]);

  return (
    <div
      className={`p-4 rounded-lg border ${
        darkMode
          ? 'bg-gray-800 border-gray-700 shadow-lg'
          : 'bg-gray-100 border-gray-200 shadow-md'
      }`}
    >
      <h2 className="text-lg sm:text-xl font-semibold mb-3 flex items-center gap-2">
        <span className="text-lg">📋</span>
        <span>Summary</span>
      </h2>
      <div className="grid grid-cols-2 gap-3">
        <div
          className={`p-3 rounded-lg border ${
            darkMode
              ? 'bg-gray-700/50 border-gray-600'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-base">🧱</span>
            <span
              className={`text-xs font-medium ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Gross Hours
            </span>
          </div>
          <p
            className={`text-lg sm:text-xl font-bold ${
              darkMode ? 'text-orange-400' : 'text-orange-600'
            }`}
          >
            {formatTime(gross)}
          </p>
        </div>

        <div
          className={`p-3 rounded-lg border ${
            darkMode
              ? 'bg-gray-700/50 border-gray-600'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-base">✅</span>
            <span
              className={`text-xs font-medium ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Effective Hours
            </span>
          </div>
          <p
            className={`text-lg sm:text-xl font-bold ${
              darkMode ? 'text-green-400' : 'text-green-600'
            }`}
          >
            {formatTime(worked)}
          </p>
        </div>

        <div
          className={`p-3 rounded-lg border ${
            darkMode
              ? 'bg-gray-700/50 border-gray-600'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-base">🧮</span>
            <span
              className={`text-xs font-medium ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Remaining
            </span>
          </div>
          <p
            className={`text-lg sm:text-xl font-bold ${
              darkMode ? 'text-blue-400' : 'text-blue-600'
            }`}
          >
            {formatTime(remaining)}
          </p>
        </div>

        <div
          className={`p-3 rounded-lg border ${
            darkMode
              ? 'bg-gray-700/50 border-gray-600'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-base">🔥</span>
            <span
              className={`text-xs font-medium ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Overtime
            </span>
          </div>
          <p
            className={`text-lg sm:text-xl font-bold ${
              darkMode ? 'text-red-400' : 'text-red-600'
            }`}
          >
            {formatTime(overtime)}
          </p>
        </div>

        <div
          className={`p-3 rounded-lg border col-span-2 ${
            darkMode
              ? 'bg-gray-700/50 border-gray-600'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-base">📆</span>
            <span
              className={`text-xs font-medium ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Expected End Time
            </span>
          </div>
          <p
            className={`text-base sm:text-lg font-bold ${
              darkMode ? 'text-purple-400' : 'text-purple-600'
            }`}
          >
            {expectedEndFormatted}
          </p>
        </div>
      </div>
    </div>
  );
}

export default memo(Summary);

