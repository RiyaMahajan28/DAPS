import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loading = false;
  error: string | null = null;
  data: any[] = [];
//   chartInstance: Chart | null = null;
chartInstance: any = null;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadChartData();
  }

  loadChartData() {
    this.loading = true;
    this.error = null;

    this.api.getChartClient({}).subscribe({
      next: (res: any) => {
        this.data = Array.isArray(res) ? res : (res?.data || []);
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load chart data';
        this.loading = false;
      }
    });
  }

  renderCharts() {
    const labels = this.data.map(d =>
      d.clientName || d.client_name || `#${d.client_id}`
    );
    const values = this.data.map(d =>
      Number(d.currentMCount ?? d.currentCount ?? 0)
    );

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const canvas = document.getElementById('dashboardChart') as HTMLCanvasElement;
    if (!canvas) {
      this.error = 'Canvas not found';
      return;
    }

    this.chartInstance = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Client Count',
          data: values,
          backgroundColor: 'rgba(33, 150, 243, 0.6)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}
