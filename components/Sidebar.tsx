import React from 'react';
import { Module } from '../types';

interface SidebarProps {
  currentModule: Module;
  setModule: (m: Module) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentModule, setModule }) => {
  const menuItems = [
    { module: Module.DASHBOARD, icon: 'fa-chart-pie', label: '工作台' },
    { module: Module.KNOWLEDGE, icon: 'fa-book', label: '知识库' },
    { module: Module.REQUIREMENTS, icon: 'fa-list-check', label: '需求管理' },
    { module: Module.PROJECTS, icon: 'fa-trello', label: '项目看板' },
    { module: Module.USERS, icon: 'fa-users', label: '用户管理' },
    { module: Module.SETTINGS, icon: 'fa-cog', label: '系统设置' },
  ];

  return (
    <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 flex-col h-screen fixed left-0 top-0 border-r border-slate-800 shadow-xl z-50">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center mr-3">
          <i className="fas fa-layer-group text-white"></i>
        </div>
        <span className="font-bold text-lg text-white tracking-tight">Nexus 研发</span>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.module}
            onClick={() => setModule(item.module)}
            className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${
              currentModule === item.module
                ? 'bg-indigo-600 text-white shadow-md'
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <i className={`fas ${item.icon} w-6 text-center mr-3 ${currentModule === item.module ? 'text-indigo-200' : 'text-slate-500 group-hover:text-white'}`}></i>
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center">
          <img src="https://picsum.photos/id/64/100/100" alt="User" className="w-8 h-8 rounded-full border border-slate-600" />
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Alex Engineer</p>
            <p className="text-xs text-slate-500">首席开发工程师</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
