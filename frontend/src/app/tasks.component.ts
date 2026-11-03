import { Component, OnInit } from '@angular/core';
import { ApiService, AuthService } from './services';
import { Task, TaskStatus, User } from './models';

@Component({
  template: `
    <section class="page-heading">
      <div><span class="eyebrow">{{auth.session?.role === 'EMPLOYEE' ? 'YOUR PERSONAL QUEUE' : 'TEAM WORKSPACE'}}</span>
        <h1>{{auth.session?.role === 'EMPLOYEE' ? 'My tasks' : 'Tasks'}}</h1>
        <p class="muted">{{filteredTasks.length}} tasks · Keep good work moving.</p></div>
      <div class="heading-actions">
        <button *ngIf="canAssign" class="btn-primary" (click)="showCreate=!showCreate">＋ Assign a task</button>
        <a *ngIf="auth.session?.role !== 'EMPLOYEE'" class="btn-outline" routerLink="/reports">View reports →</a>
      </div>
    </section>
    <div class="alert alert-danger" *ngIf="error">{{error}}</div>
    <div class="alert alert-success" *ngIf="notice">{{notice}}</div>
    <section class="content-card create-card" *ngIf="showCreate">
      <div class="card-heading"><div><span class="eyebrow">NEW TASK</span><h2>Give the team a clear next step</h2></div><button class="close-btn" (click)="showCreate=false">×</button></div>
      <form (ngSubmit)="create()" class="row g-3">
        <div class="col-md-6"><label>Task title</label><input class="form-control" name="title" [(ngModel)]="draft.title" required maxlength="200" placeholder="What needs to get done?"></div>
        <div class="col-md-3"><label>Assignee</label><select class="form-select" name="assignee" [(ngModel)]="draft.assignedToId" required><option value="">Choose a teammate</option><option *ngFor="let u of employees" [ngValue]="u.id">{{u.fullName}}</option></select></div>
        <div class="col-md-3"><label>Priority</label><select class="form-select" name="priority" [(ngModel)]="draft.priority"><option>LOW</option><option>MEDIUM</option><option>HIGH</option></select></div>
        <div class="col-md-8"><label>Description</label><textarea class="form-control" name="description" [(ngModel)]="draft.description" maxlength="10000" rows="2" placeholder="Add helpful context (optional)"></textarea></div>
        <div class="col-md-4"><label>Deadline</label><input class="form-control" type="date" name="deadline" [(ngModel)]="draft.deadline"></div>
        <div class="col-12"><button class="btn-primary" [disabled]="saving">{{saving ? 'Saving…' : 'Create task'}}</button></div>
      </form>
    </section>
    <section class="filter-row">
      <div class="filter-search"><span>⌕</span><input [(ngModel)]="search" (ngModelChange)="page=0" placeholder="Search tasks or teammates"></div>
      <select class="form-select filter-select" [(ngModel)]="statusFilter" (change)="refresh()"><option value="">All statuses</option><option>PENDING</option><option>IN_PROGRESS</option><option>DONE</option></select>
      <select class="form-select filter-select" [(ngModel)]="priorityFilter" (change)="refresh()"><option value="">All priorities</option><option>LOW</option><option>MEDIUM</option><option>HIGH</option></select>
      <select *ngIf="auth.session?.role !== 'EMPLOYEE'" class="form-select filter-select" [(ngModel)]="assigneeFilter" (change)="refresh()"><option value="">All teammates</option><option *ngFor="let u of employees" [ngValue]="u.id">{{u.fullName}}</option></select>
    </section>
    <section class="content-card table-card">
      <div class="table-responsive"><table class="table align-middle"><thead><tr><th>Task</th><th>{{auth.session?.role === 'EMPLOYEE' ? 'Assigned by' : 'Assigned to'}}</th><th>Due date</th><th>Priority</th><th>Status</th><th *ngIf="auth.session?.role === 'EMPLOYEE'">Update</th></tr></thead>
        <tbody><tr *ngFor="let t of visibleTasks"><td><strong>{{t.title}}</strong><small>{{t.description || 'No description added'}}</small></td><td>{{auth.session?.role === 'EMPLOYEE' ? t.assignerName : t.assigneeName}}</td><td>{{t.deadline || '—'}}</td><td><span class="priority" [ngClass]="t.priority.toLowerCase()"><i></i>{{t.priority}}</span></td><td><span class="status" [ngClass]="t.status.toLowerCase()">{{t.status.replace('_',' ')}}</span></td><td *ngIf="auth.session?.role === 'EMPLOYEE'"><select class="form-select status-select" [ngModel]="t.status" (ngModelChange)="setStatus(t,$event)"><option *ngFor="let s of allowedStatuses(t.status)" [value]="s">{{s.replace('_',' ')}}</option></select></td></tr>
        <tr *ngIf="filteredTasks.length===0"><td [attr.colspan]="auth.session?.role === 'EMPLOYEE' ? 6 : 5" class="empty-state"><div class="empty-icon">✳</div><strong>Nothing on this list yet</strong><span>Try changing a filter or check back in a little while.</span></td></tr></tbody>
      </table></div>
      <div class="pagination-row" *ngIf="filteredTasks.length"><span>Showing {{pageStart+1}}–{{pageEnd}} of {{filteredTasks.length}}</span><div><button class="btn-outline" [disabled]="page===0" (click)="page=page-1">← Previous</button><button class="btn-outline" [disabled]="page+1>=totalPages" (click)="page=page+1">Next →</button></div></div>
    </section>`
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  employees: User[] = [];
  error = '';
  notice = '';
  search = '';
  statusFilter = '';
  priorityFilter = '';
  assigneeFilter: number | '' = '';
  showCreate = false;
  saving = false;
  page = 0;
  readonly pageSize = 10;
  draft: any = { title: '', description: '', priority: 'MEDIUM', deadline: '', assignedToId: '' };

  constructor(public auth: AuthService, private api: ApiService) {}
  get canAssign(): boolean { return ['ADMIN', 'MANAGER'].includes(this.auth.session?.role || ''); }
  get filteredTasks(): Task[] {
    const q = this.search.trim().toLowerCase();
    return this.tasks.filter(t => !q || t.title.toLowerCase().includes(q) || t.assigneeName.toLowerCase().includes(q) || t.assignerName.toLowerCase().includes(q));
  }
  get totalPages(): number { return Math.max(1, Math.ceil(this.filteredTasks.length / this.pageSize)); }
  get pageStart(): number { return this.page * this.pageSize; }
  get pageEnd(): number { return Math.min(this.pageStart + this.pageSize, this.filteredTasks.length); }
  get visibleTasks(): Task[] { return this.filteredTasks.slice(this.pageStart, this.pageEnd); }
  allowedStatuses(current: TaskStatus): TaskStatus[] {
    const steps: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'DONE'];
    return current === 'DONE' ? ['DONE'] : steps.slice(steps.indexOf(current));
  }
  ngOnInit(): void {
    this.load();
    if (this.canAssign) this.api.team().subscribe({ next: users => this.employees = users, error: () => this.error = 'Could not load team members.' });
  }
  refresh(): void { this.page = 0; this.load(); }
  load(): void {
    this.api.tasks({ status: this.statusFilter, priority: this.priorityFilter, assigneeId: this.assigneeFilter === '' ? '' : String(this.assigneeFilter) })
      .subscribe({ next: tasks => { this.tasks = tasks; this.page = Math.min(this.page, this.totalPages - 1); }, error: () => this.error = 'Could not load tasks. Please try again.' });
  }
  create(): void {
    this.saving = true; this.error = ''; this.notice = '';
    const payload = { ...this.draft, assignedToId: Number(this.draft.assignedToId), deadline: this.draft.deadline || null };
    this.api.createTask(payload).subscribe({
      next: () => { this.showCreate = false; this.draft = { title: '', description: '', priority: 'MEDIUM', deadline: '', assignedToId: '' }; this.notice = 'Task assigned successfully.'; this.load(); this.saving = false; },
      error: e => { this.error = e.error?.message || 'Could not create task.'; this.saving = false; }
    });
  }
  setStatus(task: Task, status: TaskStatus): void {
    this.api.updateStatus(task.id, status).subscribe({
      next: updated => { task.status = updated.status; this.notice = 'Task status updated.'; },
      error: e => { this.error = e.error?.message || 'Could not update status.'; this.load(); }
    });
  }
}
