// Sample data
let tasks = [
  {
    id: '1',
    title: 'Design Homepage Layout',
    description: 'Create wireframes and mockups for the new homepage',
    status: 'in-progress',
    priority: 'high',
    urgency: 'urgent',
    importance: 'important',
    assignedTo: 'John Doe',
    createdBy: 'Jane Smith',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    dueDate: new Date('2024-01-15'),
    estimatedHours: 8,
    actualHours: 5,
    projectId: '1',
    dependencies: [],
    tags: ['design', 'frontend'],
    comments: []
  },
  {
    id: '2',
    title: 'Implement User Authentication',
    description: 'Set up login and registration functionality',
    status: 'todo',
    priority: 'medium',
    urgency: 'not-urgent',
    importance: 'important',
    assignedTo: 'Mike Johnson',
    createdBy: 'Jane Smith',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date(),
    dueDate: new Date('2024-01-20'),
    estimatedHours: 12,
    projectId: '2',
    dependencies: [],
    tags: ['backend', 'security'],
    comments: []
  }
];

// DOM Elements
const newTaskBtn = document.getElementById('newTaskBtn');
const taskModal = document.getElementById('taskModal');
const closeBtn = document.querySelector('.close-btn');
const taskForm = document.getElementById('taskForm');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Stats elements
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const inProgressTasksEl = document.getElementById('inProgressTasks');
const overdueTasksEl = document.getElementById('overdueTasks');
const completionRateEl = document.getElementById('completionRate');
const progressFillEl = document.getElementById('progressFill');
const progressTextEl = document.getElementById('progressText');

// Task list elements
const highPriorityTasksEl = document.getElementById('highPriorityTasks');
const recentTasksEl = document.getElementById('recentTasks');
const urgentImportantTasksEl = document.getElementById('urgentImportantTasks');
const notUrgentImportantTasksEl = document.getElementById('notUrgentImportantTasks');
const urgentNotImportantTasksEl = document.getElementById('urgentNotImportantTasks');
const notUrgentNotImportantTasksEl = document.getElementById('notUrgentNotImportantTasks');
const allTasksGridEl = document.getElementById('allTasksGrid');

// Analytics elements
const todoCountEl = document.getElementById('todoCount');
const inProgressCountEl = document.getElementById('inProgressCount');
const completedCountEl = document.getElementById('completedCount');
const urgentCountEl = document.getElementById('urgentCount');
const highCountEl = document.getElementById('highCount');
const mediumCountEl = document.getElementById('mediumCount');
const lowCountEl = document.getElementById('lowCount');

// Event Listeners
newTaskBtn.addEventListener('click', openTaskModal);
closeBtn.addEventListener('click', closeTaskModal);
taskForm.addEventListener('submit', handleTaskSubmit);

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabId = btn.getAttribute('data-tab');
    switchTab(tabId);
  });
});

// Initialize the app
function init() {
  renderAllViews();
  lucide.createIcons();
}

// Open task modal
function openTaskModal() {
  taskModal.classList.add('active');
  document.getElementById('modalTitle').textContent = 'New Task';
  taskForm.reset();
}

// Close task modal
function closeTaskModal() {
  taskModal.classList.remove('active');
}

// Handle task form submission
function handleTaskSubmit(e) {
  e.preventDefault();
  
  const newTask = {
    id: Date.now().toString(),
    title: document.getElementById('taskTitle').value,
    description: document.getElementById('taskDescription').value,
    status: document.getElementById('taskStatus').value,
    priority: document.getElementById('taskPriority').value,
    urgency: document.getElementById('taskUrgency').value,
    importance: document.getElementById('taskImportance').value,
    dueDate: document.getElementById('taskDueDate').value ? new Date(document.getElementById('taskDueDate').value) : null,
    tags: document.getElementById('taskTags').value.split(',').map(tag => tag.trim()),
    createdAt: new Date(),
    updatedAt: new Date(),
    assignedTo: 'Current User',
    createdBy: 'Current User',
    projectId: '1',
    dependencies: [],
    comments: [],
    estimatedHours: 0,
    actualHours: 0
  };
  
  tasks.push(newTask);
  renderAllViews();
  closeTaskModal();
}

// Switch between tabs
function switchTab(tabId) {
  tabBtns.forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('active');
    }
  });
  
  tabContents.forEach(content => {
    content.classList.remove('active');
    if (content.id === tabId) {
      content.classList.add('active');
    }
  });
}

// Render all views
function renderAllViews() {
  updateStats();
  renderHighPriorityTasks();
  renderRecentTasks();
  renderEisenhowerMatrix();
  renderAllTasks();
  updateAnalytics();
}

// Update stats
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const overdue = tasks.filter(t => 
    t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
  ).length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  totalTasksEl.textContent = total;
  completedTasksEl.textContent = completed;
  inProgressTasksEl.textContent = inProgress;
  overdueTasksEl.textContent = overdue;
  completionRateEl.textContent = `${rate}%`;
  progressFillEl.style.width = `${rate}%`;
  progressTextEl.textContent = `${completed} of ${total} tasks completed`;
}

// Render high priority tasks
function renderHighPriorityTasks() {
  const highPriorityTasks = tasks
    .filter(task => task.priority === 'high' || task.priority === 'urgent')
    .slice(0, 5);
  
  highPriorityTasksEl.innerHTML = highPriorityTasks.length > 0 
    ? highPriorityTasks.map(task => createTaskCard(task)).join('')
    : '<div class="empty-state">No high priority tasks</div>';
}

// Render recent tasks
function renderRecentTasks() {
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
  
  recentTasksEl.innerHTML = recentTasks.length > 0 
    ? recentTasks.map(task => createTaskCard(task)).join('')
    : '<div class="empty-state">No recent tasks</div>';
}

// Render Eisenhower Matrix
function renderEisenhowerMatrix() {
  const urgentImportant = tasks.filter(t => t.urgency === 'urgent' && t.importance === 'important');
  const notUrgentImportant = tasks.filter(t => t.urgency === 'not-urgent' && t.importance === 'important');
  const urgentNotImportant = tasks.filter(t => t.urgency === 'urgent' && t.importance === 'not-important');
  const notUrgentNotImportant = tasks.filter(t => t.urgency === 'not-urgent' && t.importance === 'not-important');
  
  urgentImportantTasksEl.innerHTML = urgentImportant.length > 0 
    ? urgentImportant.map(task => createTaskCard(task)).join('')
    : '<div class="empty-state">No tasks in this quadrant</div>';
  
  notUrgentImportantTasksEl.innerHTML = notUrgentImportant.length > 0 
    ? notUrgentImportant.map(task => createTaskCard(task)).join('')
    : '<div class="empty-state">No tasks in this quadrant</div>';
  
  urgentNotImportantTasksEl.innerHTML = urgentNotImportant.length > 0 
    ? urgentNotImportant.map(task => createTaskCard(task)).join('')
    : '<div class="empty-state">No tasks in this quadrant</div>';
  
  notUrgentNotImportantTasksEl.innerHTML = notUrgentNotImportant.length > 0 
    ? notUrgentNotImportant.map(task => createTaskCard(task)).join('')
    : '<div class="empty-state">No tasks in this quadrant</div>';
}

// Render all tasks
function renderAllTasks() {
  allTasksGridEl.innerHTML = tasks.length > 0 
    ? tasks.map(task => createTaskCard(task)).join('')
    : '<div class="empty-state">No tasks yet. Create your first task!</div>';
}

// Update analytics
function updateAnalytics() {
  const todoCount = tasks.filter(t => t.status === 'todo').length;
  const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const urgentCount = tasks.filter(t => t.priority === 'urgent').length;
  const highCount = tasks.filter(t => t.priority === 'high').length;
  const mediumCount = tasks.filter(t => t.priority === 'medium').length;
  const lowCount = tasks.filter(t => t.priority === 'low').length;
  
  todoCountEl.textContent = todoCount;
  inProgressCountEl.textContent = inProgressCount;
  completedCountEl.textContent = completedCount;
  urgentCountEl.textContent = urgentCount;
  highCountEl.textContent = highCount;
  mediumCountEl.textContent = mediumCount;
  lowCountEl.textContent = lowCount;
}

// Create task card HTML
function createTaskCard(task) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
  const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
  
  return `
    <div class="task-card ${isOverdue ? 'overdue' : ''}" data-id="${task.id}">
      <div class="task-card-header">
        <div class="task-card-title">
          ${getStatusIcon(task.status)}
          <span>${task.title}</span>
        </div>
        <div class="task-card-badges">
          <span class="badge ${getPriorityClass(task.priority)}">${task.priority}</span>
          ${task.urgency === 'urgent' && task.importance === 'important' 
            ? '<span class="badge badge-danger">Do First</span>' 
            : ''}
        </div>
      </div>
      <div class="task-card-content">
        ${task.description ? `<p class="task-card-description">${task.description}</p>` : ''}
        
        ${task.tags.length > 0 ? `
          <div class="task-card-tags">
            ${task.tags.map(tag => `<span class="badge badge-secondary">${tag}</span>`).join('')}
          </div>
        ` : ''}
        
        <div class="task-card-meta">
          ${dueDate ? `
            <div class="task-card-meta-item">
              <i data-lucide="calendar" class="icon"></i>
              <span class="${isOverdue ? 'text-red-600 font-medium' : ''}">${dueDate}</span>
            </div>
          ` : ''}
          
          ${task.estimatedHours ? `
            <div class="task-card-meta-item">
              <i data-lucide="clock" class="icon"></i>
              <span>${task.estimatedHours}h est.</span>
            </div>
          ` : ''}
          
          ${task.assignedTo ? `
            <div class="task-card-meta-item">
              <i data-lucide="user" class="icon"></i>
              <span>${task.assignedTo}</span>
            </div>
          ` : ''}
          
          <div class="task-card-meta-item">
            <i data-lucide="message-square" class="icon"></i>
            <span>${task.comments.length} comments</span>
          </div>
        </div>
        
        <div class="task-card-actions">
          <button class="btn btn-outline" onclick="changeTaskStatus('${task.id}')">
            ${getStatusButtonText(task.status)}
          </button>
          <button class="btn btn-ghost" onclick="editTask('${task.id}')">
            Edit
          </button>
        </div>
      </div>
    </div>
  `;
}

// Helper functions
function getStatusIcon(status) {
  switch (status) {
    case 'completed': return '<i data-lucide="check-circle-2" class="icon text-green-600"></i>';
    case 'in-progress': return '<i data-lucide="play" class="icon text-blue-600"></i>';
    default: return '<i data-lucide="circle" class="icon text-gray-400"></i>';
  }
}

function getPriorityClass(priority) {
  switch (priority) {
    case 'urgent': return 'badge-danger';
    case 'high': return 'badge-primary';
    case 'medium': return 'bg-yellow-500 text-white';
    case 'low': return 'bg-green-500 text-white';
    default: return 'badge-secondary';
  }
}

function getStatusButtonText(status) {
  switch (status) {
    case 'completed': return 'Reopen';
    case 'todo': return 'Start';
    default: return 'Complete';
  }
}

// Task actions
function changeTaskStatus(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;
  
  if (task.status === 'completed') {
    task.status = 'todo';
  } else if (task.status === 'todo') {
    task.status = 'in-progress';
  } else {
    task.status = 'completed';
  }
  
  task.updatedAt = new Date();
  renderAllViews();
}

function editTask(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;
  
  document.getElementById('modalTitle').textContent = 'Edit Task';
  document.getElementById('taskTitle').value = task.title;
  document.getElementById('taskDescription').value = task.description;
  document.getElementById('taskStatus').value = task.status;
  document.getElementById('taskPriority').value = task.priority;
  document.getElementById('taskUrgency').value = task.urgency;
  document.getElementById('taskImportance').value = task.importance;
  document.getElementById('taskDueDate').value = task.dueDate ? task.dueDate.toISOString().split('T')[0] : '';
  document.getElementById('taskTags').value = task.tags.join(', ');
  
  // Store the task ID in the form for reference
  taskForm.dataset.taskId = taskId;
  
  taskModal.classList.add('active');
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);