import { memo, useCallback, useMemo } from 'react';
import dayjs from 'dayjs';
import type { BreakEntry } from '../types';

interface BreaksListProps {
  breaks: BreakEntry[];
  editingBreakId: number | null;
  editBreakStart: string;
  editBreakEnd: string;
  darkMode: boolean;
  selectedDate: string;
  onEditBreak: (breakEntry: BreakEntry) => void;
  onDeleteBreak: (id: number) => void;
  onSaveEditBreak: () => void;
  onCancelEditBreak: () => void;
  onEditBreakStartChange: (value: string) => void;
  onEditBreakEndChange: (value: string) => void;
}

function BreaksList({
  breaks,
  editingBreakId,
  editBreakStart,
  editBreakEnd,
  darkMode,
  selectedDate,
  onEditBreak,
  onDeleteBreak,
  onSaveEditBreak,
  onCancelEditBreak,
  onEditBreakStartChange,
  onEditBreakEndChange,
}: BreaksListProps) {
  const formatTime = useCallback(
    (time: string) => dayjs(`${selectedDate}T${time}`).format('hh:mm:ss A'),
    [selectedDate]
  );

  const breaksForDate = useMemo(
    () =>
      breaks
        .filter((b) => b.date === selectedDate)
        .sort((a, b) => a.start.localeCompare(b.start)),
    [breaks, selectedDate]
  );

  return (
    <div
      className={`p-4 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
    >
      <h2 className="text-xl sm:text-2xl font-semibold mb-3">☕ Breaks</h2>
      {breaksForDate.length === 0 && (
        <p className="text-base sm:text-lg">No breaks recorded</p>
      )}
      <ul className="space-y-3">
        {breaksForDate.map((b) => (
          <li
            key={b.id}
            className="flex flex-row justify-between items-center gap-2"
          >
            {editingBreakId === b.id ? (
              <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center flex-1 w-full">
                <input
                  type="time"
                  step="1"
                  value={editBreakStart}
                  onChange={(e) => onEditBreakStartChange(e.target.value)}
                  className={`w-full p-3 border rounded text-base min-h-[44px] ${
                    darkMode
                      ? 'bg-gray-700 text-white border-gray-600'
                      : 'bg-white text-gray-900 border-gray-300'
                  }`}
                />
                <span className="hidden sm:inline">→</span>
                <input
                  type="time"
                  step="1"
                  value={editBreakEnd}
                  onChange={(e) => onEditBreakEndChange(e.target.value)}
                  className={`w-full p-3 border rounded text-base min-h-[44px] ${
                    darkMode
                      ? 'bg-gray-700 text-white border-gray-600'
                      : 'bg-white text-gray-900 border-gray-300'
                  }`}
                />
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={onSaveEditBreak}
                    className="cursor-pointer text-green-500 hover:text-green-700 px-3 py-2 text-lg"
                  >
                    ✓
                  </button>
                  <button
                    onClick={onCancelEditBreak}
                    className="cursor-pointer text-gray-500 hover:text-gray-700 px-3 py-2 text-lg"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <>
                <span className="text-base sm:text-lg break-words flex-1 min-w-0">
                  {formatTime(b.start)} → {formatTime(b.end)} | {b.duration}{' '}
                  mins
                </span>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => onEditBreak(b)}
                    className="cursor-pointer text-blue-500 hover:text-blue-700 text-xl sm:text-lg px-2 py-1"
                    aria-label="Edit break"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDeleteBreak(b.id)}
                    className="cursor-pointer text-red-500 hover:text-red-700 text-xl sm:text-lg px-2 py-1"
                    aria-label="Delete break"
                  >
                    ❌
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default memo(BreaksList);

