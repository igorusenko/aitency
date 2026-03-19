import { Component } from '@angular/core';
import {StripeElementsDirective, StripePaymentElementComponent} from 'ngx-stripe';

@Component({
  selector: 'app-coupons',
  standalone: true,
  imports: [
    StripeElementsDirective,
    StripePaymentElementComponent
  ],
  templateUrl: './coupons.html',
  styleUrl: './coupons.scss'
})
export class Coupons { }
