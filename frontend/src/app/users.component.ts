import { Component, OnInit } from '@angular/core';
import { ApiService } from './services';
import { User } from './models';

@Component({
  template: `
    <section class="page-heading">
      <div><span class="eyebrow">PEOPLE &amp; PERMISSIONS</span><h1>Your people.</h1><p class="muted">Manage workspace accounts, roles, and team assignments.</p></div>
      <button class="btn-primary" (click)="open()">＋ Add a person</button>
    </section>
    <div class="alert alert-danger" *ngIf="error">{{error}}</div>
    <div class="alert alert-success" *ngIf="notice">{{notice}}</div>
    <section class="content-card user-form" *ngIf="editing">
      <div class="card-heading"><div><span class="eyebrow">{{form.id?'EDIT PROFILE':'NEW PROFILE'}}</span><h2>{{form.id?'Update account':'Create an account'}}</h2></div><button class="close-btn" (click)="editing=false">×</button></div>
      <form class="row g-3" (ngSubmit)="save()">
        <div class="col-md-6"><label>Full name</label><input class="form-control" name="fullName" [(ngModel)]="form.fullName" required></div>
        <div class="col-md-6"><label>Email</label><input class="form-control" type="email" name="email" [(ngModel)]="form.email" required></div>
        <div class="col-md-4"><label>{{form.id?'New password (optional)':'Password (8+ characters)'}}</label><input class="form-control" type="password" name="password" [(ngModel)]="form.password" [required]="!form.id" minlength="8"></div>
        <div class="col-md-4"><label>Role</label><select class="form-select" name="role" [(ngModel)]="form.role" (change)="form.managerId=null"><option value="ADMIN">Admin</option><option value="MANAGER">Manager</option><option value="EMPLOYEE">Employee</option></select></div>
        <div class="col-md-4" *ngIf="form.role==='EMPLOYEE'"><label>Manager</label><select class="form-select" name="manager" [(ngModel)]="form.managerId" required><option value="">Select manager</option><option *ngFor="let m of managers" [ngValue]="m.id">{{m.fullName}}</option></select></div>
        <div class="col-md-4" *ngIf="form.id"><label>Account status</label><select class="form-select" name="active" [(ngModel)]="form.active"><option [ngValue]="true">Active</option><option [ngValue]="false">Inactive</option></select></div>
        <div class="col-12"><button class="btn-primary" [disabled]="saving">{{saving?'Saving…':'Save person'}}</button><button type="button" class="btn-outline ms-2" (click)="editing=false">Cancel</button></div>
      </form>
    </section>
    <section class="content-card table-card">
      <div class="people-toolbar"><div><h2>Workspace people <span class="count-pill">{{totalElements}}</span></h2><p class="muted">Accounts and team memberships</p></div><div class="filter-search"><span>⌕</span><input [(ngModel)]="query" (ngModelChange)="searchChanged()" placeholder="Search people"></div></div>
      <div class="table-responsive"><table class="table align-middle"><thead><tr><th>Person</th><th>Role</th><th>Manager</th><th>Status</th><th></th></tr></thead><tbody>
        <tr *ngFor="let u of users"><td><div class="person-cell"><div class="avatar soft">{{u.fullName.charAt(0)}}</div><div><strong>{{u.fullName}}</strong><small>{{u.email}}</small></div></div></td><td><span class="role-pill" [ngClass]="u.role.toLowerCase()">{{u.role}}</span></td><td>{{u.managerName||'—'}}</td><td><span class="status" [ngClass]="u.active?'done':'pending'">{{u.active?'ACTIVE':'INACTIVE'}}</span></td><td class="actions"><button class="icon-action" (click)="edit(u)" title="Edit">✎</button><button class="icon-action delete" (click)="deactivate(u)" [disabled]="!u.active" title="Deactivate">×</button></td></tr>
        <tr *ngIf="users.length===0"><td colspan="5" class="empty-state">No people match your search.</td></tr>
      </tbody></table></div>
      <div class="pagination-row"><span>Page {{page+1}} of {{totalPages||1}}</span><div><button class="btn-outline" [disabled]="page===0" (click)="page=page-1;load()">← Previous</button><button class="btn-outline" [disabled]="page+1>=totalPages" (click)="page=page+1;load()">Next →</button></div></div>
    </section>`
})
export class UsersComponent implements OnInit {
  users: User[] = []; managers: User[] = []; query = ''; error = ''; notice = ''; editing = false; saving = false;
  page = 0; totalPages = 0; totalElements = 0; form: any = {};
  constructor(private api: ApiService) {}
  ngOnInit(): void { this.load(); this.api.users('', 0, 100).subscribe(r => this.managers = r.content.filter((u: User) => u.role === 'MANAGER' && u.active)); }
  searchChanged(): void { this.page = 0; this.load(); }
  load(): void { this.api.users(this.query, this.page).subscribe({ next: r => { this.users = r.content; this.totalPages = r.totalPages; this.totalElements = r.totalElements; }, error: () => this.error = 'Could not load users.' }); }
  open(): void { this.form = { role: 'EMPLOYEE', active: true }; this.editing = true; this.error = ''; this.notice = ''; }
  edit(u: User): void { this.form = { ...u, password: '' }; this.editing = true; this.error = ''; this.notice = ''; }
  save(): void { this.saving = true; this.error = ''; const f = { ...this.form }; if (!f.password) delete f.password; this.api.saveUser(f, f.id).subscribe({ next: () => { this.notice = 'Person saved successfully.'; this.editing = false; this.load(); this.saving = false; }, error: e => { this.error = e.error?.message || 'Could not save this account.'; this.saving = false; } }); }
  deactivate(u: User): void { if (!confirm(`Deactivate ${u.fullName}'s account?`)) return; this.api.deleteUser(u.id).subscribe({ next: () => { this.notice = 'Account deactivated.'; this.load(); }, error: e => this.error = e.error?.message || 'Could not deactivate account.' }); }
}
