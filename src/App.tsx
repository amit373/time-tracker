import { useRef, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import dayjs from 'dayjs';
import Papa from 'papaparse';

/**
 * Break interface
 */
interface BreakEntry {
  id: number;
  start: string;
  end: string;
  duration?: number; // minutes
  date: string;
}

export default function App() {
  const [clockIn, setClockIn] = useState('');
  const [shiftLength, setShiftLength] = useState(9);
  const [breaks, setBreaks] = useState<BreakEntry[]>([]);
  const [breakStart, setBreakStart] = useState('');
  const [breakEnd, setBreakEnd] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format('YYYY-MM-DD')
  );
  const [darkMode, setDarkMode] = useState(true);
  const hasShownRestoreToast = useRef(false);

  useEffect(() => {
    const stored = localStorage.getItem('work-tracker');
    if (stored && !hasShownRestoreToast.current) {
      const parsed = JSON.parse(stored);
      setClockIn(parsed.clockIn || '');
      setShiftLength(parsed.shiftLength || 9);
      setBreaks(parsed.breaks || []);
      setSelectedDate(parsed.selectedDate || dayjs().format('YYYY-MM-DD'));
      setDarkMode(parsed.darkMode ?? true);
      toast.success('🔁 Data restored');
      hasShownRestoreToast.current = true;
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'work-tracker',
      JSON.stringify({ clockIn, shiftLength, breaks, selectedDate, darkMode })
    );
  }, [clockIn, shiftLength, breaks, selectedDate, darkMode]);

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

  const getWorkedMinutes = () => {
    if (!clockIn) return 0;
    const start = dayjs(`${selectedDate}T${clockIn}`);
    const now = dayjs();
    const totalBreak = breaks.reduce((acc, b) => acc + (b.duration || 0), 0);
    return Math.max(0, now.diff(start, 'minute') - totalBreak);
  };

  const worked = getWorkedMinutes();
  const shiftMinutes = shiftLength * 60;
  const remaining = Math.max(0, shiftMinutes - worked);
  const overtime = worked > shiftMinutes ? worked - shiftMinutes : 0;
  const expectedEnd = clockIn
    ? dayjs(`${selectedDate}T${clockIn}`).add(
        shiftMinutes + breaks.reduce((acc, b) => acc + (b.duration || 0), 0),
        'minute'
      )
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

  return (
    <div
      className={`min-h-screen p-4 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}
    >
      <Toaster />

      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">🕒 Work Timer</h1>
          <div className="flex gap-2">
            <button
              onClick={() => exportCSV()}
              disabled={breaks.length === 0}
              className={`px-4 py-2 rounded cursor-pointer whitespace-nowrap ${
                breaks.length === 0
                  ? 'bg-gray-400 cursor-not-allowed text-gray-700'
                  : darkMode
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              📦 Export CSV
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-4 py-2 rounded cursor-pointer whitespace-nowrap ${
                darkMode
                  ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'
                  : 'bg-gray-800 text-white hover:bg-gray-900'
              }`}
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? '🌞 Light' : '🌙 Dark'}
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={`p-2 border rounded w-full ${
              darkMode ? 'bg-gray-700 text-white border-gray-600' : ''
            }`}
          />
          <input
            type="time"
            step="1"
            value={clockIn}
            onChange={(e) => setClockIn(e.target.value)}
            placeholder="Clock-in Time"
            className={`p-2 border rounded w-full ${
              darkMode ? 'bg-gray-700 text-white border-gray-600' : ''
            }`}
          />
          <input
            type="number"
            min={1}
            value={shiftLength}
            onChange={(e) => setShiftLength(Number(e.target.value))}
            placeholder="Shift Length (hrs)"
            className={`p-2 border rounded w-full ${
              darkMode ? 'bg-gray-700 text-white border-gray-600' : ''
            }`}
          />
        </div>

        {/* Add Break */}
        <div className="grid sm:grid-cols-3 gap-4">
          <input
            type="time"
            step="1"
            value={breakStart}
            onChange={(e) => setBreakStart(e.target.value)}
            placeholder="Break Start"
            className={`p-2 border rounded w-full ${
              darkMode ? 'bg-gray-700 text-white border-gray-600' : ''
            }`}
          />
          <input
            type="time"
            step="1"
            value={breakEnd}
            onChange={(e) => setBreakEnd(e.target.value)}
            placeholder="Break End"
            className={`p-2 border rounded w-full ${
              darkMode ? 'bg-gray-700 text-white border-gray-600' : ''
            }`}
          />
          <button
            onClick={handleAddBreak}
            className={`px-4 py-2 rounded cursor-pointer w-full ${
              darkMode
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            ➕ Add Break
          </button>
        </div>

        {/* Summary */}
        <div
          className={`p-4 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
        >
          <h2 className="text-xl font-semibold mb-2">📋 Summary</h2>
          <p>
            🕐 Worked:{' '}
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

        {/* Break List */}
        <div
          className={`p-4 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
        >
          <h2 className="text-xl font-semibold mb-2">☕ Breaks</h2>
          {breaks.length === 0 && <p>No breaks recorded</p>}
          <ul className="space-y-2">
            {breaks.map((b) => (
              <li key={b.id} className="flex justify-between items-center">
                <span>
                  {formatTime(b.start)} → {formatTime(b.end)} | {b.duration}{' '}
                  mins
                </span>
                <button
                  onClick={() => handleDeleteBreak(b.id)}
                  className="cursor-pointer text-red-500 hover:text-red-700"
                  aria-label="Delete break"
                  title="Delete break"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
