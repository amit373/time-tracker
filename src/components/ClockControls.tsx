import { memo } from 'react';
import dayjs from 'dayjs';

interface ClockControlsProps {
  clockIn: string;
  clockOut: string;
  shiftLength: number;
  darkMode: boolean;
  selectedDate: string;
  isClockedIn: boolean;
  onClockInChange: (value: string) => void;
  onClockOutChange: (value: string) => void;
  onShiftLengthChange: (value: number) => void;
  onClockToggle: () => void;
}

function ClockControls({
  clockIn,
  clockOut,
  shiftLength,
  darkMode,
  selectedDate,
  isClockedIn,
  onClockInChange,
  onClockOutChange,
  onShiftLengthChange,
  onClockToggle,
}: ClockControlsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="flex flex-col">
        <label htmlFor="Clock In Time" className="text-base sm:text-sm mb-2 font-medium">
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
              onClockInChange(newDateTime);
            } else {
              onClockInChange('');
            }
          }}
          className={`p-3 border rounded text-base min-h-[44px] ${
            darkMode ? 'bg-gray-700 text-white border-gray-600' : ''
          }`}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="Clock Out Time" className="text-base sm:text-sm mb-2 font-medium">
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
              onClockOutChange(newDateTime);
            } else {
              onClockOutChange('');
            }
          }}
          className={`p-3 border rounded text-base min-h-[44px] ${
            darkMode ? 'bg-gray-700 text-white border-gray-600' : ''
          }`}
        />
      </div>
      <div className="flex flex-col sm:justify-end">
        <button
          onClick={onClockToggle}
          className={`px-4 py-3 rounded text-base font-medium min-h-[44px] ${
            isClockedIn
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isClockedIn ? '🛑 Clock Out' : '✅ Clock In'}
        </button>
      </div>
      <div className="flex flex-col">
        <label htmlFor="Shift Length (hrs)" className="text-base sm:text-sm mb-2 font-medium">
          Shift Length (hrs)
        </label>
        <input
          type="number"
          min={1}
          value={shiftLength}
          onChange={(e) => onShiftLengthChange(Number(e.target.value))}
          className={`p-3 border rounded text-base min-h-[44px] ${
            darkMode ? 'bg-gray-700 text-white border-gray-600' : ''
          }`}
          placeholder="Enter shift hours"
        />
      </div>
    </div>
  );
}

export default memo(ClockControls);

