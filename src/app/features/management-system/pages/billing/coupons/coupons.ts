import {Component, WritableSignal, effect, inject, OnInit, signal} from '@angular/core';
import {PrimeTemplate} from 'primeng/api';
import {TableModule, TableLazyLoadEvent} from 'primeng/table';
import {Button} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {CheckboxModule} from 'primeng/checkbox';
import {PaginatorModule} from 'primeng/paginator';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {FormsModule} from '@angular/forms';
import {BillingCouponsService} from '../../../../../core/services/management-system/billing/billing-coupons.service';
import {MessageService} from 'primeng/api';
import {
  BillingAdminCouponParams,
  BillingCouponListItemResponse,
  BillingCouponType
} from '../../../../../core/interfaces/billing/billing-coupons.interface';
import {CreateCouponDialog} from '../../../../../shared/dialogs/create-coupon/create-coupon';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-coupons',
  standalone: true,
  imports: [
    PrimeTemplate,
    TableModule,
    Button,
    InputTextModule,
    CheckboxModule,
    PaginatorModule,
    FormsModule,
    CreateCouponDialog,
    DatePipe
  ],
  providers: [DialogService],
  templateUrl: './coupons.html',
  styleUrl: './coupons.scss'
})
export class Coupons implements OnInit {
  private readonly couponsService = inject(BillingCouponsService);
  private readonly messageService = inject(MessageService);
  private readonly dialogService = inject(DialogService);

  coupons: WritableSignal<BillingCouponListItemResponse[]> = signal([]);
  totalCount: WritableSignal<number> = signal(0);
  loading: WritableSignal<boolean> = signal(false);
  dialogRef: DynamicDialogRef | null = null;

  // filters
  search: string = '';
  isActive: boolean | null = null;
  page: number = 1;
  count: number = 10;

  couponTypes = [
    { label: 'Percentage', value: BillingCouponType.PercentageDiscount },
    { label: 'Fixed', value: BillingCouponType.FixedDiscount },
    { label: 'Virtual deposit', value: BillingCouponType.VirtualDeposit }
  ];

  ngOnInit(): void {
    this.loadCoupons();
  }

  loadCoupons(): void {
    this.loading.set(true);
    const params: BillingAdminCouponParams = {
      search: this.search?.trim() || null,
      isActive: this.isActive ?? null,
      page: this.page,
      count: this.count
    };
    this.couponsService.getAdminCoupons(params).subscribe({
      next: (res) => {
        this.coupons.set(res.items);
        this.totalCount.set(res.totalCount);
        this.loading.set(false);
      },
      error: () => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Failed to load coupons'});
        this.loading.set(false);
      }
    })
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    // Update paging from table event and reload
    if (typeof event.rows === 'number' && event.rows > 0) {
      this.count = event.rows;
    }
    const first = typeof event.first === 'number' ? event.first : 0;
    this.page = Math.floor(first / this.count) + 1; // Prime starts pages from 0
    this.loadCoupons();
  }

  openCreate(): void {
    this.dialogRef = this.dialogService.open(CreateCouponDialog, {
      header: 'Create coupon',
      width: '35rem'
    });
    this.dialogRef?.onClose.subscribe((created: BillingCouponListItemResponse) => {
      if (created) {
        // reload to respect sorting/pagination
        this.loadCoupons();
      }
    });
  }

  disable(coupon: BillingCouponListItemResponse): void {
    if (!confirm('Disable this coupon?')) return;
    this.couponsService.disableAdminCoupon(coupon.id).subscribe({
      next: () => {
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'Coupon disabled'});
        this.loadCoupons();
      },
      error: () => this.messageService.add({severity: 'error', summary: 'Error', detail: 'Failed to disable'})
    });
  }

  reactivate(coupon: BillingCouponListItemResponse): void {
    if (!confirm('Reactivate this coupon?')) return;
    this.couponsService.reactivateAdminCoupon(coupon.id, {}).subscribe({
      next: () => {
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'Coupon reactivated'});
        this.loadCoupons();
      },
      error: () => this.messageService.add({severity: 'error', summary: 'Error', detail: 'Failed to reactivate'})
    });
  }

  duplicate(coupon: BillingCouponListItemResponse): void {
    const newCode = prompt('Enter new coupon code');
    if (!newCode) return;
    this.couponsService.duplicateAdminCoupon(coupon.id, { newCode, expiryDate: coupon.expiryDate }).subscribe({
      next: () => {
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'Coupon duplicated'});
        this.loadCoupons();
      },
      error: () => this.messageService.add({severity: 'error', summary: 'Error', detail: 'Failed to duplicate'})
    });
  }

  delete(coupon: BillingCouponListItemResponse): void {
    if (!confirm('Delete this coupon?')) return;
    this.couponsService.deleteAdminCoupon(coupon.id).subscribe({
      next: () => {
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'Coupon deleted'});
        this.loadCoupons();
      },
      error: () => this.messageService.add({severity: 'error', summary: 'Error', detail: 'Failed to delete'})
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(value);
  }
}
