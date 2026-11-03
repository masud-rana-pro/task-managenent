import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Dashboard, Priority, Session, Task, TaskStatus, User } from './models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private key = 'taskflow-session';
  constructor(private http: HttpClient, private router: Router) {}
  get session(): Session | null { const raw = localStorage.getItem(this.key); if (!raw) return null; try { const s: Session = JSON.parse(raw); if (this.expired(s.token)) { this.logout(); return null; } return s; } catch { return null; } }
  get token(): string | null { return this.session?.token || null; }
  login(email: string, password: string): Observable<Session> { return this.http.post<Session>(`${environment.apiUrl}/auth/login`, { email, password }); }
  save(session: Session): void { localStorage.setItem(this.key, JSON.stringify(session)); }
  logout(): void { localStorage.removeItem(this.key); this.router.navigate(['/login']); }
  private expired(token: string): boolean { try { const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))); return payload.exp * 1000 <= Date.now(); } catch { return true; } }
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = `${environment.apiUrl}`;
  constructor(private http: HttpClient) {}
  dashboard(): Observable<Dashboard> { return this.http.get<Dashboard>(`${this.base}/dashboard/stats`); }
  tasks(filters: {status?: string; priority?: string; assigneeId?: string} = {}): Observable<Task[]> { let p = new HttpParams(); Object.entries(filters).forEach(([k,v]) => { if (v) p = p.set(k, v); }); return this.http.get<Task[]>(`${this.base}/tasks`, { params: p }); }
  createTask(task: Partial<Task>): Observable<Task> { return this.http.post<Task>(`${this.base}/tasks`, task); }
  updateStatus(id: number, status: TaskStatus): Observable<Task> { return this.http.put<Task>(`${this.base}/tasks/${id}/status`, { status }); }
  users(search = '', page = 0, size = 10): Observable<any> { return this.http.get<any>(`${this.base}/users`, { params: { search, page, size } }); }
  team(): Observable<User[]> { return this.http.get<User[]>(`${this.base}/users/team`); }
  saveUser(user: any, id?: number): Observable<User> { return id ? this.http.put<User>(`${this.base}/users/${id}`, user) : this.http.post<User>(`${this.base}/users`, user); }
  deleteUser(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/users/${id}`); }
  report(): Observable<Blob> { return this.http.get(`${this.base}/reports/tasks/pdf`, { responseType: 'blob' }); }
}
