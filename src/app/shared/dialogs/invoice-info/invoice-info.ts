import {Component, model, ModelSignal} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-invoice-info',
  imports: [
    Dialog,
    Button
  ],
  templateUrl: './invoice-info.html',
  styleUrl: './invoice-info.scss',
})
export class InvoiceInfo {
  visible: ModelSignal<boolean> = model.required();
}
