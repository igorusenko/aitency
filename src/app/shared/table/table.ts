import {Component, input, InputSignal, WritableSignal} from '@angular/core';
import {PrimeTemplate} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {Tag} from 'primeng/tag';
import {ITableColumn} from '../../core/interfaces/table/table.interface';

@Component({
  selector: 'app-table',
  imports: [
    TableModule,
  ],
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class Table {
  columns: InputSignal<Array<ITableColumn>> = input.required();
  items: InputSignal<Array<any>> = input.required();
}
