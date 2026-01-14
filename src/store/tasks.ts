import { create } from 'zustand'

export type TaskStatus = 'idle' | 'starting' | 'monitoring' | 'carting' | 'checkout' | 'success' | 'error'

export interface Task {
  id: string
  taskGroupId: string
  site: 'amazon' | 'carrefour'
  productName?: string
  productImage?: string
  quantity: number
  maxPrice?: number
  scheduledStart?: Date
  status: TaskStatus
  statusMessage?: string
  profileId?: string
  profileName?: string
  proxyGroupId?: string
  proxyGroupName?: string
  accountId?: string
  // Amazon
  asin?: string
  offerId?: string
  amazonRegion?: string
  amazonMode?: string
  // Carrefour
  carrefourPid?: string
  carrefourUrl?: string
  carrefourMode?: string
  zipCode?: string
  slotPreference?: string
  allowSubstitutions?: boolean
}

export interface TaskGroup {
  id: string
  name: string
  color: string
  taskCount: number
}

interface TaskStore {
  tasks: Task[]
  taskGroups: TaskGroup[]
  selectedGroupId: string | null
  isRunningAll: boolean
  
  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  removeTask: (id: string) => void
  removeTasks: (ids: string[]) => void
  
  setTaskGroups: (groups: TaskGroup[]) => void
  addTaskGroup: (group: TaskGroup) => void
  removeTaskGroup: (id: string) => void
  selectGroup: (id: string | null) => void
  
  startAll: () => void
  stopAll: () => void
  startTask: (id: string) => void
  stopTask: (id: string) => void
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  taskGroups: [],
  selectedGroupId: null,
  isRunningAll: false,
  
  setTasks: (tasks) => set({ tasks }),
  
  addTask: (task) => set((state) => ({ 
    tasks: [...state.tasks, task] 
  })),
  
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map((t) => 
      t.id === id ? { ...t, ...updates } : t
    )
  })),
  
  removeTask: (id) => set((state) => ({
    tasks: state.tasks.filter((t) => t.id !== id)
  })),
  
  removeTasks: (ids) => set((state) => ({
    tasks: state.tasks.filter((t) => !ids.includes(t.id))
  })),
  
  setTaskGroups: (groups) => set({ taskGroups: groups }),
  
  addTaskGroup: (group) => set((state) => ({
    taskGroups: [...state.taskGroups, group]
  })),
  
  removeTaskGroup: (id) => set((state) => ({
    taskGroups: state.taskGroups.filter((g) => g.id !== id),
    selectedGroupId: state.selectedGroupId === id ? null : state.selectedGroupId
  })),
  
  selectGroup: (id) => set({ selectedGroupId: id }),
  
  startAll: () => {
    set({ isRunningAll: true })
    const tasks = get().tasks.filter(t => t.status === 'idle')
    tasks.forEach(t => get().updateTask(t.id, { status: 'starting' }))
  },
  
  stopAll: () => {
    set({ isRunningAll: false })
    const tasks = get().tasks.filter(t => 
      ['starting', 'monitoring', 'carting', 'checkout'].includes(t.status)
    )
    tasks.forEach(t => get().updateTask(t.id, { status: 'idle' }))
  },
  
  startTask: (id) => get().updateTask(id, { status: 'starting' }),
  
  stopTask: (id) => get().updateTask(id, { status: 'idle' }),
}))
