import { memo } from 'react';

interface BreakInputProps {
  breakStart: string;
  breakEnd: string;
  darkMode: boolean;
  onBreakStartChange: (value: string) => void;
  onBreakEndChange: (value: string) => void;
  onAddBreak: () => void;
}

function BreakInput({
  breakStart,
  breakEnd,
  darkMode,
  onBreakStartChange,
  onBreakEndChange,
  onAddBreak,
}: BreakInputProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="flex flex-col">
        <label htmlFor="Break Start" className="text-base sm:text-sm mb-2 font-medium">
          Break Start
        </label>
        <input
          type="time"
          step="1"
          value={breakStart}
          onChange={(e) => onBreakStartChange(e.target.value)}
          className={`w-full p-3 border rounded text-base min-h-[44px] ${
            darkMode ? 'bg-gray-700 text-white border-gray-600' : ''
          }`}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="Break End" className="text-base sm:text-sm mb-2 font-medium">
          Break End
        </label>
        <input
          type="time"
          step="1"
          value={breakEnd}
          onChange={(e) => onBreakEndChange(e.target.value)}
          className={`w-full p-3 border rounded text-base min-h-[44px] ${
            darkMode ? 'bg-gray-700 text-white border-gray-600' : ''
          }`}
        />
      </div>
      <div className="flex flex-col sm:justify-end">
        <button
          onClick={onAddBreak}
          className={`w-full px-4 py-3 rounded cursor-pointer text-base font-medium min-h-[44px] ${
            darkMode
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          ➕ Add Break
        </button>
      </div>
    </div>
  );
}

export default memo(BreakInput);

