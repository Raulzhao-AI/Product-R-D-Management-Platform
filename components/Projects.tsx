import React, { useState } from 'react';
import { ProjectTask, TaskType } from '../types';

interface ProjectsProps {
  tasks: ProjectTask[];
  setTasks: React.Dispatch<React.SetStateAction<ProjectTask[]>>;
}

const Projects: React.FC<ProjectsProps> = ({ tasks, setTasks }) => {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<TaskType | 'ALL'>('ALL');

  const columns = [
    { id: 'todo', label: '待办事项', color: 'border-slate-300' },
    { id: 'in-progress', label: '进行中', color: 'border-blue-400' },
    { id: 'done', label: '已完成', color: 'border-emerald-400' },
  ];

  const filteredTasks = tasks.filter(t => filterType === 'ALL' || t.type === filterType);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: ProjectTask['status']) => {
    e.preventDefault();
    if (draggedTaskId) {
      setTasks(prev => prev.map(t => t.id === draggedTaskId ? { ...t, status } : t));
      setDraggedTaskId(null);
    }
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col">
       <div className="px-6 py-6 md:py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">项目看板</h1>
                <p className="text-sm text-slate-500 mt-1">
                    {filterType === 'ALL' ? '全部项目' : filterType === TaskType.R_AND_D ? '研发任务' : '交付任务'}
                </p>
            </div>
            
            <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                 <div className="flex bg-slate-200 p-1 rounded-lg shrink-0">
                     <button 
                        onClick={() => setFilterType('ALL')}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filterType === 'ALL' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                     >
                        全部
                     </button>
                     <button 
                        onClick={() => setFilterType(TaskType.R_AND_D)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filterType === TaskType.R_AND_D ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                     >
                        研发
                     </button>
                     <button 
                        onClick={() => setFilterType(TaskType.DELIVERY)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filterType === TaskType.DELIVERY ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                     >
                        交付
                     </button>
                 </div>
                 
                 <div className="flex -space-x-2 shrink-0">
                    <img className="w-8 h-8 rounded-full border-2 border-white" src="https://picsum.photos/id/10/100/100" />
                    <img className="w-8 h-8 rounded-full border-2 border-white" src="https://picsum.photos/id/12/100/100" />
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs text-slate-500">+3</div>
                 </div>
            </div>
       </div>

       <div className="flex-1 overflow-x-auto overflow-y-hidden px-6 pb-20 md:pb-6">
         <div className="flex gap-4 md:gap-6 h-full min-w-[calc(100vw-3rem)] md:min-w-0">
             {columns.map(col => (
               <div 
                 key={col.id} 
                 className="w-[85vw] md:w-auto md:flex-1 bg-slate-100 rounded-xl flex flex-col shrink-0 md:min-w-[300px]"
                 onDragOver={handleDragOver}
                 onDrop={(e) => handleDrop(e, col.id as ProjectTask['status'])}
               >
                 <div className={`p-3 md:p-4 border-t-4 ${col.color} rounded-t-xl bg-white/50 backdrop-blur-sm`}>
                    <h3 className="font-semibold text-slate-700 flex justify-between items-center">
                        {col.label}
                        <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs">
                            {filteredTasks.filter(t => t.status === col.id).length}
                        </span>
                    </h3>
                 </div>
                 
                 <div className="p-3 md:p-4 flex-1 overflow-y-auto space-y-3">
                    {filteredTasks.filter(t => t.status === col.id).map(task => (
                        <div
                            key={task.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                            className="bg-white p-3 md:p-4 rounded-lg shadow-sm border border-slate-200 cursor-move hover:shadow-md transition-shadow group relative"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-slate-800 text-sm leading-tight pr-4">{task.title}</h4>
                            </div>
                            <div className="flex justify-between items-center mt-3">
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                        task.type === TaskType.R_AND_D ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                    }`}>
                                        {task.type}
                                    </span>
                                    <span className="text-[10px] text-slate-400">#{task.id}</span>
                                </div>
                                
                                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-600 font-bold border border-slate-200">
                                    {task.assignee.charAt(0)}
                                </div>
                            </div>
                        </div>
                    ))}
                 </div>
                 
                 <button className="m-3 p-2 rounded-lg border-2 border-dashed border-slate-300 text-slate-400 text-sm font-medium hover:border-indigo-300 hover:text-indigo-500 transition-colors">
                    <i className="fas fa-plus mr-1"></i> 添加任务
                 </button>
               </div>
             ))}
         </div>
       </div>
    </div>
  );
};

export default Projects;
