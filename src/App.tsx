import { useRef, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import dayjs from 'dayjs';
import Papa from 'papaparse';

interface BreakEntry {
  id: number;
  start: string;
  end: string;
  duration?: number;
  date: string;
}

export default function App() {
  const [clockIn, setClockIn] = useState('');
  const [clockOut, setClockOut] = useState('');
  const [shiftLength, setShiftLength] = useState(9);
  const [breaks, setBreaks] = useState<BreakEntry[]>([]);
  const [breakStart, setBreakStart] = useState('');
  const [breakEnd, setBreakEnd] = useState('');
  const [editingBreakId, setEditingBreakId] = useState<number | null>(null);
  const [editBreakStart, setEditBreakStart] = useState('');
  const [editBreakEnd, setEditBreakEnd] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [manualClockIn, setManualClockIn] = useState('');
  const [manualClockOut, setManualClockOut] = useState('');
  const selectedDate = dayjs().format('YYYY-MM-DD');
  const hasShownRestoreToast = useRef(false);

  useEffect(() => {
    const stored = localStorage.getItem('work-tracker');
    if (stored && !hasShownRestoreToast.current) {
      const parsed = JSON.parse(stored);
      setClockIn(parsed.clockIn ?? '');
      setClockOut(parsed.clockOut ?? '');
      setShiftLength(parsed.shiftLength ?? 9);
      setBreaks(parsed.breaks ?? []);
      setDarkMode(parsed.darkMode ?? true);
      toast.success('🔁 Data restored');
      hasShownRestoreToast.current = true;
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'work-tracker',
      JSON.stringify({ clockIn, clockOut, shiftLength, breaks, darkMode })
    );
  }, [clockIn, clockOut, shiftLength, breaks, darkMode]);

  const handleAddBreak = () => {
    if (!breakStart || !breakEnd) {
      toast.error('Start and End time required');
      return;
    }
    const start = dayjs(`${selectedDate}T${breakStart}`);
    const end = dayjs(`${selectedDate}T${breakEnd}`);
    if (!start.isValid() || !end.isValid() || end.isBefore(start)) {
      toast.error('Invalid break times');
      return;
    }

    const duration = end.diff(start, 'minute');
    const newBreak: BreakEntry = {
      id: Date.now(),
      start: breakStart,
      end: breakEnd,
      duration,
      date: selectedDate,
    };

    setBreaks([...breaks, newBreak]);
    setBreakStart('');
    setBreakEnd('');
    toast.success('✅ Break added');
  };

  const handleDeleteBreak = (id: number) => {
    setBreaks(breaks.filter((b) => b.id !== id));
    toast.success('🗑 Break deleted');
  };

  const handleEditBreak = (breakEntry: BreakEntry) => {
    setEditingBreakId(breakEntry.id);
    setEditBreakStart(breakEntry.start);
    setEditBreakEnd(breakEntry.end);
  };

  const handleSaveEditBreak = () => {
    if (!editBreakStart || !editBreakEnd || editingBreakId === null) {
      toast.error('Start and End time required');
      return;
    }
    const start = dayjs(`${selectedDate}T${editBreakStart}`);
    const end = dayjs(`${selectedDate}T${editBreakEnd}`);
    if (!start.isValid() || !end.isValid() || end.isBefore(start)) {
      toast.error('Invalid break times');
      return;
    }

    const duration = end.diff(start, 'minute');
    setBreaks(
      breaks.map((b) =>
        b.id === editingBreakId
          ? { ...b, start: editBreakStart, end: editBreakEnd, duration }
          : b
      )
    );
    setEditingBreakId(null);
    setEditBreakStart('');
    setEditBreakEnd('');
    toast.success('✅ Break updated');
  };

  const handleCancelEditBreak = () => {
    setEditingBreakId(null);
    setEditBreakStart('');
    setEditBreakEnd('');
  };

  const handleReset = () => {
    setClockIn('');
    setClockOut('');
    setBreaks([]);
    setBreakStart('');
    setBreakEnd('');
    setManualClockIn('');
    setManualClockOut('');
    setEditingBreakId(null);
    setEditBreakStart('');
    setEditBreakEnd('');
    toast.success('🔁 Reset complete');
  };

  const getGrossMinutes = () => {
    if (!clockIn) return 0;
    const start = dayjs(clockIn);
    // If clocked out, use clock-out time; otherwise use current time
    const end = clockOut ? dayjs(clockOut) : dayjs();
    return Math.max(0, end.diff(start, 'minute'));
  };

  const getWorkedMinutes = () => {
    const gross = getGrossMinutes();
    const totalBreak = breaks
      .filter((b) => b.date === selectedDate)
      .reduce((acc, b) => acc + (b.duration ?? 0), 0);
    // Effective hours = Gross hours - All breaks (Keka logic)
    return Math.max(0, gross - totalBreak);
  };

  const handleClockToggle = () => {
    if (clockIn && !clockOut) {
      // Clocking out - save clock-out time
      const now = manualClockOut
        ? dayjs(`${selectedDate}T${manualClockOut}`).toISOString()
        : dayjs().toISOString();
      setClockOut(now);
      setManualClockOut('');
      toast.success('🛑 Clocked out');
    } else if (!clockIn) {
      // Clocking in - reset clock-out if exists
      const now = manualClockIn
        ? dayjs(`${selectedDate}T${manualClockIn}`).toISOString()
        : dayjs().toISOString();
      setClockIn(now);
      setClockOut('');
      setManualClockIn('');
      toast.success('✅ Clocked in');
    } else {
      // Already clocked out, allow re-clocking in
      const now = manualClockIn
        ? dayjs(`${selectedDate}T${manualClockIn}`).toISOString()
        : dayjs().toISOString();
      setClockIn(now);
      setClockOut('');
      setManualClockIn('');
      toast.success('✅ Clocked in');
    }
  };

  const gross = getGrossMinutes();
  const worked = getWorkedMinutes();
  const shiftMinutes = shiftLength * 60;
  const remaining = worked < shiftMinutes ? shiftMinutes - worked : 0;
  const overtime = worked > shiftMinutes ? worked - shiftMinutes : 0;

  const totalBreak = breaks.reduce((acc, b) => acc + (b.duration ?? 0), 0);
  const lunch = 0;
  const assumedLunch = breaks.length === 0 ? lunch : 0;

  const expectedEnd = clockIn
    ? dayjs(clockIn).add(shiftMinutes + totalBreak + assumedLunch, 'minute')
    : null;

  const exportCSV = () => {
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
  };

  const formatTime = (time: string) =>
    dayjs(`${selectedDate}T${time}`).format('hh:mm:ss A');

  const isClockedIn = !!clockIn && !clockOut;

  const getExportButtonClasses = (): string => {
    if (breaks.length === 0) {
      return 'bg-gray-400 cursor-not-allowed text-gray-700';
    }

    return darkMode
      ? 'bg-green-600 text-white hover:bg-green-700'
      : 'bg-green-500 text-white hover:bg-green-600';
  };

  const exportButtonClass = `px-4 py-2 rounded cursor-pointer ${getExportButtonClasses()}`;

  return (
    <div
      className={`min-h-screen p-3 sm:p-4 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}
    >
      <Toaster />
      <div className="max-w-4xl mx-auto flex flex-col gap-4 sm:gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-xl sm:text-2xl font-bold">🕒 Work Timer</h1>
          <div className="flex gap-2 flex-wrap w-full sm:w-auto">
            <button
              onClick={exportCSV}
              disabled={breaks.length === 0}
              className={`${exportButtonClass} text-sm sm:text-base flex-1 sm:flex-initial`}
            >
              📦 Export CSV
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-3 sm:px-4 py-2 rounded cursor-pointer text-sm sm:text-base flex-1 sm:flex-initial ${
                darkMode
                  ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'
                  : 'bg-gray-800 text-white hover:bg-gray-900'
              }`}
            >
              {darkMode ? '🌞 Light' : '🌙 Dark'}
            </button>
            <button
              onClick={() => handleReset()}
              className={`px-3 sm:px-4 py-2 rounded cursor-pointer text-sm sm:text-base flex-1 sm:flex-initial ${
                darkMode
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              🔄 Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label htmlFor="Clock In Time" className="text-sm mb-1">
              Clock In Time
            </label>
            <input
              type="time"
              step="1"
              value={clockIn ? dayjs(clockIn).format('HH:mm:ss') : ''}
              onChange={(e) => {
                const newTime = e.target.value;
                if (newTime) {
                  const newDateTime = dayjs(
                    `${selectedDate}T${newTime}`
                  ).toISOString();
                  setClockIn(newDateTime);
                } else {
                  setClockIn('');
                }
              }}
              className={`p-2 border rounded text-base ${
                darkMode ? 'bg-gray-700 text-white border-gray-600' : ''
              }`}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="Clock Out Time" className="text-sm mb-1">
              Clock Out Time
            </label>
            <input
              type="time"
              step="1"
              value={clockOut ? dayjs(clockOut).format('HH:mm:ss') : ''}
              onChange={(e) => {
                const newTime = e.target.value;
                if (newTime) {
                  const newDateTime = dayjs(
                    `${selectedDate}T${newTime}`
                  ).toISOString();
                  setClockOut(newDateTime);
                } else {
                  setClockOut('');
                }
              }}
              className={`p-2 border rounded text-base ${
                darkMode ? 'bg-gray-700 text-white border-gray-600' : ''
              }`}
            />
          </div>
          <div className="flex flex-col sm:justify-end">
            <button
              onClick={handleClockToggle}
              className={`px-4 py-2 rounded text-base font-medium ${
                isClockedIn
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isClockedIn ? '🛑 Clock Out' : '✅ Clock In'}
            </button>
          </div>
          <div className="flex flex-col">
            <label htmlFor="Shift Length (hrs)" className="text-sm mb-1">
              Shift Length (hrs)
            </label>
            <input
              type="number"
              min={1}
              value={shiftLength}
              onChange={(e) => setShiftLength(Number(e.target.value))}
              className={`p-2 border rounded text-base ${
                darkMode ? 'bg-gray-700 text-white border-gray-600' : ''
              }`}
              placeholder="Enter shift hours"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label htmlFor="Break Start" className="text-sm mb-1">
              Break Start
            </label>
            <input
              type="time"
              step="1"
              value={breakStart}
              onChange={(e) => setBreakStart(e.target.value)}
              className={`p-2 border rounded text-base ${
                darkMode ? 'bg-gray-700 text-white border-gray-600' : ''
              }`}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="Break End" className="text-sm mb-1">
              Break End
            </label>
            <input
              type="time"
              step="1"
              value={breakEnd}
              onChange={(e) => setBreakEnd(e.target.value)}
              className={`p-2 border rounded text-base ${
                darkMode ? 'bg-gray-700 text-white border-gray-600' : ''
              }`}
            />
          </div>
          <div className="flex flex-col sm:justify-end">
            <button
              onClick={handleAddBreak}
              className={`px-4 py-2 rounded cursor-pointer text-base font-medium ${
                darkMode
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              ➕ Add Break
            </button>
          </div>
        </div>

        <div
          className={`p-4 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-3">📋 Summary</h2>
          <div className="space-y-2 text-sm sm:text-base">
            <p>
              🧱 Gross Hours:{' '}
              <strong>
                {Math.floor(gross / 60)}h {gross % 60}m
              </strong>
            </p>
            <p>
              ✅ Effective Hours:{' '}
              <strong>
                {Math.floor(worked / 60)}h {worked % 60}m
              </strong>
            </p>
            <p>
              🧮 Remaining:{' '}
              <strong>
                {Math.floor(remaining / 60)}h {remaining % 60}m
              </strong>
            </p>
            <p>
              🔥 Overtime:{' '}
              <strong>
                {Math.floor(overtime / 60)}h {overtime % 60}m
              </strong>
            </p>
            <p>
              📆 Expected End Time:{' '}
              <strong>
                {expectedEnd ? expectedEnd.format('hh:mm:ss A') : '---'}
              </strong>
            </p>
          </div>
        </div>

        <div
          className={`p-4 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-3">☕ Breaks</h2>
          {breaks.length === 0 && <p className="text-sm sm:text-base">No breaks recorded</p>}
          <ul className="space-y-3">
            {breaks.map((b) => (
              <li key={b.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                {editingBreakId === b.id ? (
                  <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center flex-1 w-full">
                    <input
                      type="time"
                      step="1"
                      value={editBreakStart}
                      onChange={(e) => setEditBreakStart(e.target.value)}
                      className={`p-2 border rounded text-base flex-1 ${
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
                      onChange={(e) => setEditBreakEnd(e.target.value)}
                      className={`p-2 border rounded text-base flex-1 ${
                        darkMode
                          ? 'bg-gray-700 text-white border-gray-600'
                          : 'bg-white text-gray-900 border-gray-300'
                      }`}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEditBreak}
                        className="cursor-pointer text-green-500 hover:text-green-700 px-3 py-2 text-lg"
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleCancelEditBreak}
                        className="cursor-pointer text-gray-500 hover:text-gray-700 px-3 py-2 text-lg"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="text-sm sm:text-base break-words">
                      {formatTime(b.start)} → {formatTime(b.end)} | {b.duration}{' '}
                      mins
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditBreak(b)}
                        className="cursor-pointer text-blue-500 hover:text-blue-700 text-lg"
                        aria-label="Edit break"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteBreak(b.id)}
                        className="cursor-pointer text-red-500 hover:text-red-700 text-lg"
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
      </div>
    </div>
  );
}
