# 🕒 Work Timer - Time Tracking Application

A modern, feature-rich time tracking application built with React, TypeScript, and Vite. Track your work hours, manage breaks, and monitor your shift progress in real-time.

## ✨ Features

### ⏰ Time Tracking
- **Clock In/Out**: One-click clock in/out toggle with automatic timestamp recording
- **Manual Time Entry**: Manually set clock in and clock out times with time picker inputs
- **Real-time Tracking**: Live updates of your work hours as you clock in and out

### ☕ Break Management
- **Add Breaks**: Record break start and end times with automatic duration calculation
- **Edit Breaks**: Modify existing break entries with inline editing
- **Delete Breaks**: Remove breaks from your record
- **Break List**: View all breaks for the current day in chronological order

### 📊 Time Calculations & Summary
- **Gross Hours**: Total time from clock in to clock out (including breaks)
- **Effective Hours**: Actual worked time (gross hours minus break time)
- **Remaining Time**: Time left to complete your scheduled shift
- **Overtime Tracking**: Automatically calculates overtime hours when you exceed your shift length
- **Expected End Time**: Calculates when you'll finish your shift based on clock in time, shift length, and total break time

### ⚙️ Configuration
- **Customizable Shift Length**: Set your shift duration in hours (default: 9 hours)
- **Date Selection**: Track time for the current date

### 💾 Data Management
- **LocalStorage Persistence**: Automatically saves your data to browser localStorage
- **Data Restoration**: Automatically restores your previous session on page load
- **CSV Export**: Export your break data to CSV format for record keeping
- **Reset Function**: Clear all clock times and breaks with a single click

### 🎨 User Experience
- **Dark Mode**: Toggle between light and dark themes for comfortable viewing
- **Responsive Design**: Fully responsive layout that works on desktop, tablet, and mobile devices
- **Toast Notifications**: Visual feedback for all actions (clock in/out, add/edit/delete breaks, reset, etc.)
- **Intuitive UI**: Clean, modern interface with color-coded metrics

### 🔧 Technical Features
- Built with **React 19** and **TypeScript** for type safety
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for modern, responsive styling
- **Day.js** for date and time manipulation
- **React Hot Toast** for user notifications
- **PapaParse** for CSV export functionality

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/amit373/time-tracker
cd time-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 📝 Usage

1. **Clock In**: Click the "✅ Clock In" button or manually set your clock in time
2. **Set Shift Length**: Enter your expected shift duration in hours
3. **Add Breaks**: Enter break start and end times, then click to add
4. **Monitor Progress**: View your summary metrics in real-time
5. **Clock Out**: Click "🛑 Clock Out" when finished or manually set clock out time
6. **Export Data**: Click "📦 Export" to download your break data as CSV
7. **Reset**: Click "🔄 Reset" to clear all data and start fresh

## 🛠️ Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Day.js** - Date/time utilities
- **React Hot Toast** - Notifications
- **PapaParse** - CSV export

## 📄 License

This project is private and proprietary.
