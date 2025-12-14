import React, { useState } from 'react';
import { Requirement, RequirementStatus, Priority } from '../types';
import { summarizeRequirement } from '../services/geminiService';

interface RequirementsProps {
  requirements: Requirement[];
  setRequirements: React.Dispatch<React.SetStateAction<Requirement[]>>;
}

const Requirements: React.FC<RequirementsProps> = ({ requirements, setRequirements }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [selectedReq, setSelectedReq] = useState<Requirement | null>(null);
  const [newReq, setNewReq] = useState({ title: '', description: '', priority: Priority.MEDIUM });
  const [loadingSummary, setLoadingSummary] = useState(false);

  const handleStatusChange = (id: string, newStatus: RequirementStatus) => {
    setRequirements(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    if (selectedReq?.id === id) {
        setSelectedReq(prev => prev ? {...prev, status: newStatus} : null);
    }
  };

  const createRequirement = () => {
    const r: Requirement = {
      id: `r${Date.now()}`,
      title: newReq.title,
      description: newReq.description,
      status: RequirementStatus.DRAFT,
      priority: newReq.priority,
      createdAt: new Date(),
      comments: []
    };
    setRequirements([...requirements, r]);
    setShowCreate(false);
    setNewReq({ title: '', description: '', priority: Priority.MEDIUM });
  };

  const getStatusColor = (status: RequirementStatus) => {
    switch (status) {
      case RequirementStatus.DRAFT: return 'bg-slate-100 text-slate-600';
      case RequirementStatus.REVIEW: return 'bg-orange-100 text-orange-600';
      case RequirementStatus.APPROVED: return 'bg-emerald-100 text-emerald-600';
      case RequirementStatus.DEVELOPMENT: return 'bg-blue-100 text-blue-600';
      case RequirementStatus.DONE: return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const handleGenerateAISummary = async () => {
    if (!selectedReq) return;
    setLoadingSummary(true);
    const summary = await summarizeRequirement(selectedReq.description);
    alert(`AI 智能分析报告:\n${summary}`);
    setLoadingSummary(false);
  };

  return (
    <div className="h-full flex bg-slate-50 relative">
      {/* List View - Hidden on mobile if detail is selected */}
      <div className={`
        transition-all duration-300 flex flex-col border-r border-slate-200 bg-white h-full
        ${selectedReq ? 'hidden md:flex md:w-1/2' : 'w-full'}
      `}>
        <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800">需求管理</h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1">跟踪和管理产品规格</p>
          </div>
          <button 
            onClick={() => setShowCreate(true)}
            className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors flex items-center"
          >
            <i className="fas fa-plus mr-1"></i> <span className="hidden md:inline">新建需求</span><span className="md:hidden">提需求</span>
          </button>
        </div>

        {showCreate && (
            <div className="p-4 bg-slate-50 border-b border-slate-200 animate-fade-in">
                <input 
                    placeholder="需求标题" 
                    className="w-full mb-2 p-2 border rounded"
                    value={newReq.title}
                    onChange={e => setNewReq({...newReq, title: e.target.value})}
                />
                <textarea 
                    placeholder="需求详细描述..." 
                    className="w-full mb-2 p-2 border rounded h-20"
                    value={newReq.description}
                    onChange={e => setNewReq({...newReq, description: e.target.value})}
                />
                <div className="flex justify-end gap-2">
                    <button onClick={() => setShowCreate(false)} className="px-3 py-1 text-sm text-slate-600">取消</button>
                    <button onClick={createRequirement} className="px-3 py-1 text-sm bg-indigo-600 text-white rounded">创建</button>
                </div>
            </div>
        )}

        <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <ul className="divide-y divide-slate-100">
              {requirements.map((req) => (
                <li 
                    key={req.id} 
                    onClick={() => setSelectedReq(req)}
                    className={`cursor-pointer hover:bg-slate-50 transition-colors p-4 ${selectedReq?.id === req.id ? 'bg-indigo-50/50' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-mono text-slate-400">#{req.id}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${getStatusColor(req.status)}`}>
                        {req.status}
                      </span>
                  </div>
                  <h3 className="text-sm font-medium text-slate-800 mb-1">{req.title}</h3>
                  <div className="flex items-center text-xs text-slate-500">
                      <span className="mr-3"><i className="fas fa-signal mr-1"></i>{req.priority}</span>
                      <span><i className="far fa-clock mr-1"></i>{req.createdAt.toLocaleDateString()}</span>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>

      {/* Detail View - Full width on mobile when active */}
      {selectedReq && (
        <div className="absolute inset-0 md:static md:w-1/2 flex flex-col bg-white animate-slide-in-right z-20 h-full">
          <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-start bg-white sticky top-0 z-10">
            <div className="flex items-center">
               <button onClick={() => setSelectedReq(null)} className="md:hidden mr-3 text-slate-500 hover:text-slate-800">
                   <i className="fas fa-arrow-left text-lg"></i>
               </button>
               <div>
                   <h1 className="text-lg md:text-2xl font-bold text-slate-800 leading-tight">{selectedReq.title}</h1>
               </div>
            </div>
            <button onClick={() => setSelectedReq(null)} className="hidden md:block text-slate-400 hover:text-slate-600">
                <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
             <div className="flex flex-wrap gap-2 mb-6">
                 <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(selectedReq.status)}`}>{selectedReq.status}</span>
                 <span className="px-2 py-1 rounded text-xs bg-slate-100 text-slate-500">优先级: {selectedReq.priority}</span>
                 <span className="px-2 py-1 rounded text-xs bg-slate-100 text-slate-500">{selectedReq.createdAt.toLocaleDateString()}</span>
             </div>

            <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">需求描述</h3>
                    <button 
                        onClick={handleGenerateAISummary}
                        disabled={loadingSummary}
                        className="text-indigo-600 text-xs hover:underline flex items-center"
                    >
                       <i className={`fas fa-magic mr-1 ${loadingSummary ? 'fa-spin' : ''}`}></i> AI 分析
                    </button>
                </div>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm md:text-base">
                    {selectedReq.description}
                </p>
            </div>

            <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">工作流操作</h3>
                <div className="flex flex-wrap gap-3">
                    {selectedReq.status === RequirementStatus.DRAFT && (
                        <button onClick={() => handleStatusChange(selectedReq.id, RequirementStatus.REVIEW)} className="btn-action bg-orange-50 text-orange-700 border-orange-200 w-full md:w-auto">请求评审</button>
                    )}
                    {selectedReq.status === RequirementStatus.REVIEW && (
                        <>
                            <button onClick={() => handleStatusChange(selectedReq.id, RequirementStatus.APPROVED)} className="btn-action bg-emerald-50 text-emerald-700 border-emerald-200 flex-1">通过</button>
                            <button onClick={() => handleStatusChange(selectedReq.id, RequirementStatus.DRAFT)} className="btn-action bg-red-50 text-red-700 border-red-200 flex-1">驳回</button>
                        </>
                    )}
                    {selectedReq.status === RequirementStatus.APPROVED && (
                        <button onClick={() => handleStatusChange(selectedReq.id, RequirementStatus.DEVELOPMENT)} className="btn-action bg-blue-50 text-blue-700 border-blue-200 w-full md:w-auto">开始开发</button>
                    )}
                    {selectedReq.status === RequirementStatus.DEVELOPMENT && (
                        <button onClick={() => handleStatusChange(selectedReq.id, RequirementStatus.DONE)} className="btn-action bg-purple-50 text-purple-700 border-purple-200 w-full md:w-auto">标记完成</button>
                    )}
                </div>
            </div>

             {/* Comments Section */}
             <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">动态</h3>
                <div className="space-y-4">
                    {selectedReq.comments.length === 0 && <p className="text-sm text-slate-400 italic">暂无评论。</p>}
                    {selectedReq.comments.map(c => (
                        <div key={c.id} className="flex space-x-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-500 font-bold shrink-0">
                                {c.userId.toUpperCase()}
                            </div>
                            <div className="flex-1 bg-slate-50 p-3 rounded-lg text-sm text-slate-700">
                                <p>{c.content}</p>
                                <span className="text-xs text-slate-400 mt-1 block">{c.timestamp.toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
          </div>
        </div>
      )}
      <style>{`
        .btn-action {
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            font-weight: 500;
            border: 1px solid;
            transition: all 0.2s;
            text-align: center;
        }
        .btn-action:hover {
            opacity: 0.8;
            transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};

export default Requirements;
