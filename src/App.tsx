import { Toaster } from 'react-hot-toast';
import { useWorkTracker } from './hooks/useWorkTracker';
import Header from './components/Header';
import ClockControls from './components/ClockControls';
import BreakInput from './components/BreakInput';
import Summary from './components/Summary';
import BreaksList from './components/BreaksList';

export default function App() {
  const {
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
    handleAddBreak,
    handleDeleteBreak,
    handleEditBreak,
    handleSaveEditBreak,
    handleCancelEditBreak,
    handleReset,
    handleClockToggle,
    gross,
    worked,
    remaining,
    overtime,
    expectedEnd,
    isClockedIn,
  } = useWorkTracker();

  return (
    <div
      className={`min-h-screen p-4 sm:p-4 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}
    >
      <Toaster />
      <div className="max-w-4xl mx-auto flex flex-col gap-5 sm:gap-6">
        <Header
          breaks={breaks}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onReset={handleReset}
          selectedDate={selectedDate}
        />

        <ClockControls
          clockIn={clockIn}
          clockOut={clockOut}
          shiftLength={shiftLength}
          darkMode={darkMode}
          selectedDate={selectedDate}
          isClockedIn={isClockedIn}
          onClockInChange={setClockIn}
          onClockOutChange={setClockOut}
          onShiftLengthChange={setShiftLength}
          onClockToggle={handleClockToggle}
        />

        <BreakInput
          breakStart={breakStart}
          breakEnd={breakEnd}
          darkMode={darkMode}
          onBreakStartChange={setBreakStart}
          onBreakEndChange={setBreakEnd}
          onAddBreak={handleAddBreak}
        />

        <Summary
          gross={gross}
          worked={worked}
          remaining={remaining}
          overtime={overtime}
          expectedEnd={expectedEnd}
          darkMode={darkMode}
        />

        <BreaksList
          breaks={breaks}
          editingBreakId={editingBreakId}
          editBreakStart={editBreakStart}
          editBreakEnd={editBreakEnd}
          darkMode={darkMode}
          selectedDate={selectedDate}
          onEditBreak={handleEditBreak}
          onDeleteBreak={handleDeleteBreak}
          onSaveEditBreak={handleSaveEditBreak}
          onCancelEditBreak={handleCancelEditBreak}
          onEditBreakStartChange={setEditBreakStart}
          onEditBreakEndChange={setEditBreakEnd}
        />
      </div>
    </div>
  );
}
