import React, { useState } from 'react';
import { Doc, Attachment } from '../types';
import { generateAssistantResponse } from '../services/geminiService';

interface KnowledgeBaseProps {
  docs: Doc[];
  setDocs: React.Dispatch<React.SetStateAction<Doc[]>>;
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ docs, setDocs }) => {
  const [selectedDocId, setSelectedDocId] = useState<string | null>(docs[1]?.id || null);
  const [isEditing, setIsEditing] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  // Add state to control mobile view (list vs detail)
  const [showDetailOnMobile, setShowDetailOnMobile] = useState(false);

  const selectedDoc = docs.find(d => d.id === selectedDocId);

  const handleDocClick = (id: string) => {
      setSelectedDocId(id);
      setShowDetailOnMobile(true);
  };

  const handleBackToList = () => {
      setShowDetailOnMobile(false);
  };

  const handleCreateDoc = () => {
    const newDoc: Doc = {
      id: `d${Date.now()}`,
      parentId: 'root',
      title: '未命名文档',
      content: '# 新文档\n\n开始输入...',
      type: 'document',
      attachments: [],
      lastModified: new Date()
    };
    setDocs([...docs, newDoc]);
    setSelectedDocId(newDoc.id);
    setShowDetailOnMobile(true);
    setIsEditing(true);
  };

  const handleUpdateContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (selectedDoc) {
      const updatedDocs = docs.map(d => 
        d.id === selectedDoc.id ? { ...d, content: e.target.value, lastModified: new Date() } : d
      );
      setDocs(updatedDocs);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && selectedDoc) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith('image') ? 'image' : file.type.startsWith('video') ? 'video' : 'file';
      
      const newAttachment: Attachment = {
        id: `a${Date.now()}`,
        name: file.name,
        type: type as any,
        url: url
      };

      const updatedDocs = docs.map(d => 
        d.id === selectedDoc.id 
          ? { ...d, attachments: [...d.attachments, newAttachment], lastModified: new Date() } 
          : d
      );
      setDocs(updatedDocs);
    }
  };

  const handleAskAI = async () => {
    if (!aiQuery || !selectedDoc) return;
    setIsAiLoading(true);
    const answer = await generateAssistantResponse(aiQuery, selectedDoc.content);
    setAiResponse(answer);
    setIsAiLoading(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 relative">
      {/* Sidebar List - Hidden on mobile if viewing detail */}
      <div className={`
        w-full md:w-64 border-r border-slate-200 bg-white flex flex-col h-full absolute md:static z-10
        ${showDetailOnMobile ? 'hidden md:flex' : 'flex'}
      `}>
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-semibold text-slate-700">文档列表</h2>
          <button onClick={handleCreateDoc} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded">
            <i className="fas fa-plus"></i>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 pb-20 md:pb-2">
          {docs.map(doc => (
            <div 
              key={doc.id}
              onClick={() => handleDocClick(doc.id)}
              className={`flex items-center p-3 rounded-md cursor-pointer mb-1 ${selectedDocId === doc.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <i className={`fas ${doc.type === 'folder' ? 'fa-folder text-yellow-400' : 'fa-file-alt text-slate-400'} mr-3 w-5 text-center`}></i>
              <span className="text-sm font-medium truncate">{doc.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className={`
        flex-1 flex flex-col bg-white overflow-hidden relative w-full h-full absolute md:static z-20
        ${!showDetailOnMobile ? 'hidden md:flex' : 'flex'}
      `}>
        {selectedDoc ? (
          <>
            {/* Toolbar */}
            <div className="h-14 border-b border-slate-200 flex items-center justify-between px-4 md:px-6 bg-white shrink-0 sticky top-0 z-30">
              <div className="flex items-center flex-1 min-w-0">
                <button onClick={handleBackToList} className="md:hidden mr-3 text-slate-500 p-1">
                   <i className="fas fa-arrow-left"></i>
                </button>
                {isEditing ? (
                   <input 
                     value={selectedDoc.title}
                     onChange={(e) => {
                       const updated = docs.map(d => d.id === selectedDoc.id ? {...d, title: e.target.value} : d);
                       setDocs(updated);
                     }}
                     className="text-lg md:text-xl font-bold text-slate-800 border-b border-indigo-300 focus:outline-none bg-transparent w-full"
                   />
                ) : (
                  <div className="flex flex-col overflow-hidden">
                    <h1 className="text-lg md:text-xl font-bold text-slate-800 truncate">{selectedDoc.title}</h1>
                    <span className="text-[10px] md:text-xs text-slate-400 hidden md:inline">
                      最后编辑: {selectedDoc.lastModified.toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2 md:space-x-3 ml-2">
                <label className="cursor-pointer text-slate-500 hover:text-indigo-600 transition-colors p-1">
                  <i className="fas fa-paperclip md:mr-2"></i> <span className="hidden md:inline">上传附件</span>
                  <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*,video/*" />
                </label>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${isEditing ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {isEditing ? '完成' : '编辑'}
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-4xl mx-auto w-full pb-20 md:pb-8">
              {isEditing ? (
                <textarea 
                  className="w-full h-full resize-none outline-none text-slate-700 leading-relaxed font-mono bg-transparent min-h-[50vh]"
                  value={selectedDoc.content}
                  onChange={handleUpdateContent}
                />
              ) : (
                <div className="prose prose-slate max-w-none">
                  {/* Simple Markdown Rendering Simulation */}
                  {selectedDoc.content.split('\n').map((line, i) => {
                    if (line.startsWith('# ')) return <h1 key={i} className="text-2xl md:text-3xl font-bold mb-4 text-slate-900">{line.replace('# ', '')}</h1>
                    if (line.startsWith('## ')) return <h2 key={i} className="text-xl md:text-2xl font-semibold mt-6 mb-3 text-slate-800">{line.replace('## ', '')}</h2>
                    if (!line.trim()) return <br key={i} />
                    return <p key={i} className="mb-2 text-slate-700 leading-relaxed">{line}</p>
                  })}
                </div>
              )}

              {/* Attachments Section */}
              {selectedDoc.attachments.length > 0 && (
                <div className="mt-8 pt-8 border-t border-slate-200">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">附件列表</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedDoc.attachments.map(att => (
                      <div key={att.id} className="border border-slate-200 rounded-lg p-2 bg-slate-50">
                        {att.type === 'image' && <img src={att.url} alt={att.name} className="w-full h-40 object-cover rounded-md mb-2" />}
                        {att.type === 'video' && <video src={att.url} controls className="w-full h-40 object-cover rounded-md mb-2" />}
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-600 truncate">{att.name}</span>
                            <a href={att.url} download className="text-indigo-600 hover:text-indigo-800"><i className="fas fa-download"></i></a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI Assistant Overlay (Bottom Right) */}
            <div className="hidden md:flex absolute bottom-6 right-6 w-80 bg-white border border-slate-200 shadow-2xl rounded-xl overflow-hidden flex-col z-40">
                <div className="bg-indigo-600 px-4 py-3 flex items-center justify-between">
                    <span className="text-white font-medium text-sm"><i className="fas fa-robot mr-2"></i>Nexus 智能助手</span>
                </div>
                <div className="p-4 bg-slate-50 max-h-60 overflow-y-auto text-sm text-slate-700">
                    {aiResponse ? (
                        <div className="prose prose-sm">{aiResponse}</div>
                    ) : (
                        <p className="text-slate-400 italic">针对此文档有什么问题，问我吧...</p>
                    )}
                </div>
                <div className="p-2 border-t border-slate-200 bg-white flex">
                    <input 
                        className="flex-1 px-3 py-2 text-sm outline-none"
                        placeholder="总结这篇文档..."
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                    />
                    <button 
                        onClick={handleAskAI}
                        disabled={isAiLoading}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded"
                    >
                        {isAiLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
                    </button>
                </div>
            </div>

          </>
        ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <i className="fas fa-book-open text-6xl mb-4 text-slate-200"></i>
                <p>请选择一个文档以查看</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBase;
