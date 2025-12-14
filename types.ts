export enum Module {
  DASHBOARD = 'DASHBOARD',
  KNOWLEDGE = 'KNOWLEDGE',
  REQUIREMENTS = 'REQUIREMENTS',
  PROJECTS = 'PROJECTS',
  USERS = 'USERS',
  SETTINGS = 'SETTINGS'
}

export enum RequirementStatus {
  DRAFT = '草稿',
  REVIEW = '待评审',
  APPROVED = '已通过',
  DEVELOPMENT = '开发中',
  DONE = '已完成'
}

export enum Priority {
  LOW = '低',
  MEDIUM = '中',
  HIGH = '高',
  CRITICAL = '紧急'
}

export enum TaskType {
  R_AND_D = '研发',
  DELIVERY = '交付'
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  employeeId: string;
  department: string;
  projectGroup: string;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
}

export interface Requirement {
  id: string;
  title: string;
  description: string;
  status: RequirementStatus;
  priority: Priority;
  assignedTo?: string;
  createdAt: Date;
  comments: Comment[];
}

export interface Doc {
  id: string;
  parentId: string | null;
  title: string;
  content: string; // Markdown or HTML
  type: 'folder' | 'document';
  attachments: Attachment[];
  lastModified: Date;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'video' | 'file';
  url: string;
}

export interface ProjectTask {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  assignee: string;
  type: TaskType; // Added type field
}
