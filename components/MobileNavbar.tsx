import React from 'react';
import { Module } from '../types';

interface MobileNavbarProps {
  currentModule: Module;
  setModule: (m: Module) => void;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({ currentModule, setModule }) => {
  // Mobile only needs limited features as requested
  const navItems = [
    { module: Module.REQUIREMENTS, icon: 'fa-pen-to-square', label: '提需求' },
    { module: Module.PROJECTS, icon: 'fa-trello', label: '项目看板' },
    { module: Module.DASHBOARD, icon: 'fa-chart-pie', label: '工作台' }, // Optional generic access
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 shadow-2xl flex justify-around items-center h-16 z-50 pb-safe">
      {navItems.map((item) => (
        <button
          key={item.module}
          onClick={() => setModule(item.module)}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
            currentModule === item.module ? 'text-indigo-600' : 'text-slate-400'
          }`}
        >
          <i className={`fas ${item.icon} text-lg ${currentModule === item.module ? 'animate-bounce-short' : ''}`}></i>
          <span className="text-[10px] font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default MobileNavbar;
