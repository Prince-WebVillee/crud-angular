import { NgToastService } from 'ng-angular-popup';
import { ApiService } from './services/api.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'pagination';
  displayedColumns: string[] = [
    'productName',
    'category',
    'date',
    'freshness',
    'price',
    'comment',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private api: ApiService,
    private toast: NgToastService
  ) {}

  openDialog() {
    this.dialog
      .open(DialogComponent, { width: '30%' })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllProducts();
        }
      });
  }

  ngOnInit(): void {
    this.getAllProducts();
  }
  showToastSuccess() {
    this.toast.success({
      detail: 'SUCCESS',
      summary: 'Product Deleted Successfully',
      duration: 3000,
    });
  }
  getAllProducts() {
    return this.api.getProduct().subscribe({
      next: (res) => {
        console.log(res);
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        alert('error while fetching the records');
      },
    });
  }

  editProduct(row: any) {
    console.log(row);

    this.dialog
      .open(DialogComponent, { width: '30%', data: row })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllProducts();
        }
      });
  }

  deleteProduct(data: any) {
    console.log(data);
    let confirmation = confirm('Are you sure You want to delete this record');
    if (confirmation == true) {
      this.api.deleteProduct(data._id).subscribe({
        next: (res) => {
          this.showToastSuccess();
          this.getAllProducts();
        },
        error: () => {
          alert('Error while deleting');
        },
      });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
