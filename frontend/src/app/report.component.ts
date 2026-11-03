import { Component } from '@angular/core';
import { ApiService, AuthService } from './services';

@Component({
  template: `
    <section class="page-heading">
      <div><span class="eyebrow">REPORTING</span><h1>Team task report</h1>
        <p class="muted">Download a PDF snapshot of the tasks available to your role.</p></div>
    </section>
    <div class="alert alert-danger" *ngIf="error">{{error}}</div>
    <div class="alert alert-success" *ngIf="notice">{{notice}}</div>
    <section class="content-card report-card">
      <div class="report-mark">↓</div>
      <div><span class="eyebrow">PDF EXPORT</span><h2>Task management report</h2>
        <p class="muted">{{auth.session?.role === 'ADMIN' ? 'Includes tasks across the workspace.' : 'Includes tasks assigned by you to your own team.'}} The report is generated securely by the API.</p>
        <button class="btn-primary" [disabled]="loading" (click)="download()">{{loading ? 'Preparing report…' : 'Download PDF report'}}</button>
      </div>
    </section>`
})
export class ReportComponent {
  error = '';
  notice = '';
  loading = false;
  constructor(public auth: AuthService, private api: ApiService) {}

  download(): void {
    this.loading = true;
    this.error = '';
    this.notice = '';
    this.api.report().subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'task-report.pdf';
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        this.notice = 'Your report has been downloaded.';
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not download the report. Please try again.';
        this.loading = false;
      }
    });
  }
}
