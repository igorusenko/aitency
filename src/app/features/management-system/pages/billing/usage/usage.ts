import {CommonModule, DatePipe} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import { TableModule } from 'primeng/table';
import {UsageService} from '../../../../../core/services/management-system/billing/usage/usage.service';
import {ChartModule, UIChart} from 'primeng/chart';

@Component({
  selector: 'app-usage',
  standalone: true,
  imports: [CommonModule, TableModule, UIChart, ChartModule],
  providers: [DatePipe],
  templateUrl: './usage.html',
  styleUrl: './usage.scss'
})
export class Usage implements OnInit {
  usageService = inject(UsageService);
  datePipe = inject(DatePipe);
  chartData: any;
  chartOptions: any;

  ngOnInit() {
    this.initializeUsageData();
  }

  initializeUsageData(): void {
    this.usageService.getUsageOverview().subscribe();
    this.usageService.getUsageSummary().subscribe();
    this.getUsageTrends();
    this.getUsageDetails();
  }

  getUsageTrends(): void {
    this.usageService.getUsageTrends(7).subscribe(trends => {
      this.initChart();
    });
  }

  initChart(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');
    const chartLabels = this.usageService.usageTrends()?.map(trend => this.datePipe.transform(trend.date, 'MMM d'))
    const priceData = this.usageService.usageTrends()?.map(trend => trend.cost)
    const tokensData = this.usageService.usageTrends()?.map(trend => trend.quantity)

    this.chartData = {
      labels: chartLabels || [],
      datasets: [
        {
          label: 'Tokens spent',
          data: tokensData,
          backgroundColor: ['rgba(249, 115, 22, 0.2)'],
          borderColor: ['rgb(249, 115, 22)'],
          borderWidth: 1
        },
        {
          label: 'Price €',
          data: priceData,
          backgroundColor: ['rgba(22,249,207,0.2)'],
          borderColor: ['rgb(22, 249, 207)'],
          borderWidth: 1
        }
      ]
    };
    // 'rgba(22,249,207,0.29)'
    this.chartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            }
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }

  getUsageDetails(): void {
    this.usageService.getUsageDetails(1, 10, 'date', 'desc').subscribe();
  }
}
