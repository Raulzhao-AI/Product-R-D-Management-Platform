import React, { useState } from 'react';
import { User } from '../types';

interface UserManagementProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, setUsers }) => {
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New user form state
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    department: '',
    projectGroup: ''
  });

  const handleImport = () => {
    // Expected format: Name,EmployeeId,Department,ProjectGroup
    const lines = importText.trim().split('\n');
    const newUsers: User[] = lines.map((line, index) => {
        const parts = line.split(/,|，/); // Support both English and Chinese commas
        return {
            id: `u-imp-${Date.now()}-${index}`,
            name: parts[0]?.trim() || 'Unknown',
            employeeId: parts[1]?.trim() || 'N/A',
            department: parts[2]?.trim() || 'Unassigned',
            projectGroup: parts[3]?.trim() || 'Unassigned',
            avatar: `https://picsum.photos/seed/${Date.now() + index}/100/100`
        };
    }).filter(u => u.name && u.name !== 'Unknown');

    setUsers([...users, ...newUsers]);
    setImportText('');
    setShowImportModal(false);
  };

  const handleDelete = (id: string) => {
      if (window.confirm('确认删除该用户吗？')) {
          setUsers(users.filter(u => u.id !== id));
      }
  };

  const handleAddUser = () => {
      const newUser: User = {
          id: `u-new-${Date.now()}`,
          name: formData.name,
          employeeId: formData.employeeId,
          department: formData.department,
          projectGroup: formData.projectGroup,
          avatar: `https://picsum.photos/seed/${Date.now()}/100/100`
      };
      setUsers([...users, newUser]);
      setFormData({ name: '', employeeId: '', department: '', projectGroup: '' });
      setShowAddModal(false);
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-slate-800">用户管理</h1>
            <p className="text-sm text-slate-500 mt-1">管理团队成员、部门归属及权限</p>
        </div>
        <div className="flex gap-3">
             <button 
                onClick={() => setShowImportModal(true)}
                className="bg-white text-slate-700 border border-slate-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 shadow-sm transition-colors"
             >
                <i className="fas fa-file-import mr-2"></i> 批量导入
            </button>
            <button 
                onClick={() => setShowAddModal(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors"
            >
                <i className="fas fa-user-plus mr-2"></i> 新增成员
            </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">成员信息</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">工号</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">部门</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">项目组</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">操作</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {users.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                            <div className="flex items-center">
                                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-slate-200" />
                                <span className="ml-3 text-sm font-medium text-slate-800">{user.name}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 font-mono">{user.employeeId}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs border border-slate-200">{user.department}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{user.projectGroup}</td>
                        <td className="px-6 py-4 text-right">
                            <button onClick={() => handleDelete(user.id)} className="text-slate-400 hover:text-red-600 transition-colors">
                                <i className="fas fa-trash-alt"></i>
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      {/* Import Modal */}
      {showImportModal && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-fade-in">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-slate-800">批量导入用户</h3>
                      <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-600">
                          <i className="fas fa-times"></i>
                      </button>
                  </div>
                  <p className="text-sm text-slate-500 mb-2">请按以下格式输入（支持多行）：<br/>姓名,工号,部门,项目组</p>
                  <p className="text-xs text-slate-400 mb-4 bg-slate-50 p-2 rounded border border-slate-100 font-mono">
                      张三, RD-1001, 研发部, 支付平台<br/>
                      李四, PM-2002, 产品部, 增长组
                  </p>
                  <textarea 
                      className="w-full h-40 border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none mb-4"
                      placeholder="在此处粘贴 CSV 数据..."
                      value={importText}
                      onChange={e => setImportText(e.target.value)}
                  />
                  <div className="flex justify-end gap-3">
                      <button onClick={() => setShowImportModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium">取消</button>
                      <button onClick={handleImport} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">确认导入</button>
                  </div>
              </div>
          </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-slate-800">新增成员</h3>
                      <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                          <i className="fas fa-times"></i>
                      </button>
                  </div>
                  <div className="space-y-4 mb-6">
                      <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">姓名</label>
                          <input 
                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">工号</label>
                          <input 
                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={formData.employeeId}
                            onChange={e => setFormData({...formData, employeeId: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">部门</label>
                          <input 
                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={formData.department}
                            onChange={e => setFormData({...formData, department: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">项目组</label>
                          <input 
                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={formData.projectGroup}
                            onChange={e => setFormData({...formData, projectGroup: e.target.value})}
                          />
                      </div>
                  </div>
                  <div className="flex justify-end gap-3">
                      <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium">取消</button>
                      <button onClick={handleAddUser} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">保存</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default UserManagement;
