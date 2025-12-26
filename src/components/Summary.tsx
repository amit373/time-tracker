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
      className={`p-4 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
    >
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">📋 Summary</h2>
      <div className="space-y-3 text-base sm:text-lg">
        <p>
          🧱 Gross Hours: <strong>{formatTime(gross)}</strong>
        </p>
        <p>
          ✅ Effective Hours: <strong>{formatTime(worked)}</strong>
        </p>
        <p>
          🧮 Remaining: <strong>{formatTime(remaining)}</strong>
        </p>
        <p>
          🔥 Overtime: <strong>{formatTime(overtime)}</strong>
        </p>
        <p>
          📆 Expected End Time: <strong>{expectedEndFormatted}</strong>
        </p>
      </div>
    </div>
  );
}

export default memo(Summary);

