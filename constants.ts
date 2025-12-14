import { Doc, Requirement, RequirementStatus, Priority, ProjectTask, TaskType, User } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Engineer',
  avatar: 'https://picsum.photos/id/64/100/100',
  employeeId: 'RD-001',
  department: '研发部',
  projectGroup: '核心平台组'
};

export const INITIAL_USERS: User[] = [
  MOCK_USER,
  {
    id: 'u2',
    name: 'Sarah Product',
    avatar: 'https://picsum.photos/id/65/100/100',
    employeeId: 'PM-002',
    department: '产品部',
    projectGroup: '移动端组'
  },
  {
    id: 'u3',
    name: 'Mike Dev',
    avatar: 'https://picsum.photos/id/66/100/100',
    employeeId: 'RD-003',
    department: '研发部',
    projectGroup: '交付组'
  }
];

export const INITIAL_DOCS: Doc[] = [
  {
    id: 'root',
    parentId: null,
    title: '通用文档',
    content: '',
    type: 'folder',
    attachments: [],
    lastModified: new Date()
  },
  {
    id: 'd1',
    parentId: 'root',
    title: '新人入职指南',
    content: '# 欢迎来到 Nexus 研发平台\n\n这是我们工程团队的核心知识库。在这里你可以找到环境搭建指南、架构图以及更多内容。\n\n## 快速开始\n1. 安装 Node.js\n2. 克隆仓库\n3. 运行 `npm install`',
    type: 'document',
    attachments: [
      { id: 'a1', name: '系统架构图.png', type: 'image', url: 'https://picsum.photos/id/2/600/400' }
    ],
    lastModified: new Date('2023-10-01')
  },
  {
    id: 'd2',
    parentId: 'root',
    title: 'API 开发规范',
    content: '所有 API 必须遵循 RESTful 原则。请求和响应体请统一使用 JSON 格式。',
    type: 'document',
    attachments: [],
    lastModified: new Date('2023-10-05')
  }
];

export const INITIAL_REQUIREMENTS: Requirement[] = [
  {
    id: 'r1',
    title: '用户 SSO 单点登录',
    description: '使用 OAuth2 提供商实现单点登录功能。必须支持 Google 和 GitHub 登录方式。',
    status: RequirementStatus.APPROVED,
    priority: Priority.HIGH,
    assignedTo: 'u1',
    createdAt: new Date('2023-10-10'),
    comments: [
      { id: 'c1', userId: 'u2', content: '请确保优雅地处理 Token 刷新机制。', timestamp: new Date() }
    ]
  },
  {
    id: 'r2',
    title: '视频上传与处理',
    description: '允许用户上传最大 500MB 的视频文件。上传后需转码为 HLS 格式以支持流媒体播放。',
    status: RequirementStatus.REVIEW,
    priority: Priority.MEDIUM,
    assignedTo: 'u1',
    createdAt: new Date('2023-10-12'),
    comments: []
  },
  {
    id: 'r3',
    title: '暗黑模式 UI',
    description: '根据用户偏好添加系统级的暗黑模式切换开关。',
    status: RequirementStatus.DRAFT,
    priority: Priority.LOW,
    createdAt: new Date('2023-10-15'),
    comments: []
  }
];

export const INITIAL_TASKS: ProjectTask[] = [
  { id: 't1', title: '设计数据库 Schema', status: 'done', assignee: 'Alex', type: TaskType.R_AND_D },
  { id: 't2', title: '实现登录 API 接口', status: 'in-progress', assignee: 'Alex', type: TaskType.R_AND_D },
  { id: 't3', title: '设计个人主页 UI', status: 'todo', assignee: 'Sarah', type: TaskType.R_AND_D },
  { id: 't4', title: '客户 A 现场部署', status: 'in-progress', assignee: 'Mike', type: TaskType.DELIVERY },
  { id: 't5', title: '编写系统交付手册', status: 'todo', assignee: 'Sarah', type: TaskType.DELIVERY },
  { id: 't6', title: '演示环境搭建', status: 'done', assignee: 'Alex', type: TaskType.DELIVERY },
];
