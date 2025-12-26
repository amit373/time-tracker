import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import type { BreakEntry } from '../types';

export function useWorkTracker() {
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
  const selectedDate = useMemo(() => dayjs().format('YYYY-MM-DD'), []);
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

  // Debounce localStorage writes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem(
        'work-tracker',
        JSON.stringify({ clockIn, clockOut, shiftLength, breaks, darkMode })
      );
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [clockIn, clockOut, shiftLength, breaks, darkMode]);

  const handleAddBreak = useCallback(() => {
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

    setBreaks((prev) => [...prev, newBreak]);
    setBreakStart('');
    setBreakEnd('');
    toast.success('✅ Break added');
  }, [breakStart, breakEnd, selectedDate]);

  const handleDeleteBreak = useCallback((id: number) => {
    setBreaks((prev) => prev.filter((b) => b.id !== id));
    toast.success('🗑 Break deleted');
  }, []);

  const handleEditBreak = useCallback((breakEntry: BreakEntry) => {
    setEditingBreakId(breakEntry.id);
    setEditBreakStart(breakEntry.start);
    setEditBreakEnd(breakEntry.end);
  }, []);

  const handleSaveEditBreak = useCallback(() => {
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
    setBreaks((prev) =>
      prev.map((b) =>
        b.id === editingBreakId
          ? { ...b, start: editBreakStart, end: editBreakEnd, duration }
          : b
      )
    );
    setEditingBreakId(null);
    setEditBreakStart('');
    setEditBreakEnd('');
    toast.success('✅ Break updated');
  }, [editBreakStart, editBreakEnd, editingBreakId, selectedDate]);

  const handleCancelEditBreak = useCallback(() => {
    setEditingBreakId(null);
    setEditBreakStart('');
    setEditBreakEnd('');
  }, []);

  const handleReset = useCallback(() => {
    setClockIn('');
    setClockOut('');
    setBreaks([]);
    setBreakStart('');
    setBreakEnd('');
    setEditingBreakId(null);
    setEditBreakStart('');
    setEditBreakEnd('');
    toast.success('🔁 Reset complete');
  }, []);

  // Memoize expensive calculations
  const gross = useMemo(() => {
    if (!clockIn) return 0;
    const start = dayjs(clockIn);
    const end = clockOut ? dayjs(clockOut) : dayjs();
    return Math.max(0, end.diff(start, 'minute'));
  }, [clockIn, clockOut]);

  const totalBreakForDate = useMemo(() => {
    return breaks
      .filter((b) => b.date === selectedDate)
      .reduce((acc, b) => acc + (b.duration ?? 0), 0);
  }, [breaks, selectedDate]);

  const worked = useMemo(() => {
    return Math.max(0, gross - totalBreakForDate);
  }, [gross, totalBreakForDate]);

  const shiftMinutes = useMemo(() => shiftLength * 60, [shiftLength]);

  const remaining = useMemo(() => {
    return worked < shiftMinutes ? shiftMinutes - worked : 0;
  }, [worked, shiftMinutes]);

  const overtime = useMemo(() => {
    return worked > shiftMinutes ? worked - shiftMinutes : 0;
  }, [worked, shiftMinutes]);

  const totalBreak = useMemo(() => {
    return breaks.reduce((acc, b) => acc + (b.duration ?? 0), 0);
  }, [breaks]);

  const expectedEnd = useMemo(() => {
    if (!clockIn) return null;
    return dayjs(clockIn).add(shiftMinutes + totalBreak, 'minute');
  }, [clockIn, shiftMinutes, totalBreak]);

  const isClockedIn = useMemo(() => !!clockIn && !clockOut, [clockIn, clockOut]);

  const handleClockToggle = useCallback(() => {
    const now = dayjs().toISOString();
    if (clockIn && !clockOut) {
      setClockOut(now);
      toast.success('🛑 Clocked out');
    } else {
      setClockIn(now);
      setClockOut('');
      toast.success('✅ Clocked in');
    }
  }, [clockIn, clockOut]);

  return {
    // State
    clockIn,
    setClockIn,
    clockOut,
    setClockOut,
    shiftLength,
    setShiftLength,
    breaks,
    breakStart,
    setBreakStart,
    breakEnd,
    setBreakEnd,
    editingBreakId,
    editBreakStart,
    setEditBreakStart,
    editBreakEnd,
    setEditBreakEnd,
    darkMode,
    setDarkMode,
    selectedDate,
    // Handlers
    handleAddBreak,
    handleDeleteBreak,
    handleEditBreak,
    handleSaveEditBreak,
    handleCancelEditBreak,
    handleReset,
    handleClockToggle,
    // Calculations
    gross,
    worked,
    remaining,
    overtime,
    expectedEnd,
    isClockedIn,
  };
}

