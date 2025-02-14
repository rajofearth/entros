import React from 'react';

export default function LogoPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#000212] to-[#111]">
      <div
        className="w-48 h-48 flex items-center justify-center rounded-full shadow-lg"
        style={{ background: "rgba(255, 255, 255, 0.05)" }}
      >
        <span className="text-6xl font-bold">
          <span className="text-gray-400">E</span>
          <span className="text-white">T</span>
        </span>
      </div>
    </div>
  );
}
