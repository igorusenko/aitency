import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-usage',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './usage.html',
  styleUrl: './usage.scss'
})
export class Usage {
  summaryCards = [
    { label: 'Current Period', value: 'Mar 1–31', detail: '9 days remaining' },
    { label: 'Total Usage', value: '45,231', detail: 'API calls used' },
    { label: 'Current Period Cost', value: '€904.62', detail: '@ €0.02 per call' }
  ];

  usageTrend = [
    { label: 'Mar 3', height: '45%' },
    { label: 'Mar 4', height: '72%' },
    { label: 'Mar 5', height: '85%' },
    { label: 'Mar 6', height: '60%' },
    { label: 'Mar 7', height: '90%' },
    { label: 'Mar 8', height: '78%' },
    { label: 'Mar 9', height: '55%' }
  ];

  usageDetails = [
    { date: 'Mar 9, 2026', metric: 'API Calls (Usage-Based API)', quantity: '6,450', unitPrice: '€0.02', total: '€129.00' },
    { date: 'Mar 8, 2026', metric: 'API Calls (Usage-Based API)', quantity: '8,231', unitPrice: '€0.02', total: '€164.62' },
    { date: 'Mar 7, 2026', metric: 'API Calls (Usage-Based API)', quantity: '9,450', unitPrice: '€0.02', total: '€189.00' },
    { date: 'Mar 6, 2026', metric: 'API Calls (Usage-Based API)', quantity: '7,200', unitPrice: '€0.02', total: '€144.00' },
    { date: 'Mar 5, 2026', metric: 'API Calls (Usage-Based API)', quantity: '8,900', unitPrice: '€0.02', total: '€178.00' },
    { date: 'Mar 4, 2026', metric: 'API Calls (Usage-Based API)', quantity: '3,200', unitPrice: '€0.02', total: '€64.00' },
    { date: 'Mar 3, 2026', metric: 'API Calls (Usage-Based API)', quantity: '1,800', unitPrice: '€0.02', total: '€36.00' }
  ];
}
