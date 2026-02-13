# Discord Clone Demo

A high-fidelity, frontend-only Discord clone built with Next.js 14, Tailwind CSS, and Zustand.

## 🚀 Quick Start

1. **Install Dependencies**:
   ```powershell
   npm install
   ```

2. **Run Development Server**:
   If `npm run dev` fails with a "not recognized" error, use the direct path:
   ```powershell
   .\node_modules\.bin\next dev
   ```
   Or use `npx`:
   ```powershell
   npx next dev
   ```

3. **Open the App**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Zustand (with localStorage persistence)
- **Icons**: Lucide React
- **Real-time**: Custom Event Bus (BroadcastChannel for multi-tab sync)
- **Simulation**: Custom Bot Engine for fake activity

## ✨ Features

- **In-Memory "Backend"**: Servers, Channels, Members, and Messages are all managed locally.
- **Bot Activity**: Toggle simulated user activity to make the demo feel alive.
- **Persistence**: Your messages and settings stay saved in `localStorage`.
- **Multi-tab Sync**: Open the app in two tabs and see messages appear in both simultaneously.
- **Discord UI/UX**: Recreated the look and feel of Discord with improved spacing and animations.

## 📺 Demo Guide

1. **Start Bots**: Click the green "Start Bots" button in the bottom-right corner.
2. **Chat**: Send a message in `#general`.
3. **Switch Servers**: Use the left sidebar to jump between "Project Alpha" and "UI/UX Design".
4. **Reset**: Use the "Reset" button to clear all data and restart the demo.
