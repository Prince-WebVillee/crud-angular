import { ApiService } from './../services/api.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, Form } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgToastService } from 'ng-angular-popup';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  freshnessList = ['Brand New', 'Second Hand', 'Refurbished'];
  productForm!: FormGroup;
  actionBtn: string = 'Save';
  constructor(
    private toast: NgToastService,
    private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<DialogComponent>
  ) {}
  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      freshness: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['', Validators.required],
      date: ['', Validators.required],
    });

    if (this.editData) {
      this.actionBtn = 'Update';
      this.productForm.controls['productName'].setValue(
        this.editData.productName
      );
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['freshness'].setValue(this.editData.freshness);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
      this.productForm.controls['date'].setValue(this.editData.date);
    }
  }

  addProduct() {
    if (!this.editData) {
      if (this.productForm.valid) {
        this.api.postProduct(this.productForm.value).subscribe({
          next: (res) => {
            this.showToastAdd();
            this.productForm.reset();
            this.dialogRef.close('save');
          },
          error: () => {
            alert('Error Ocurred');
          },
        });
      }
    } else {
      this.putProduct();
    }
  }

  putProduct() {
    this.api.putProduct(this.productForm.value, this.editData._id).subscribe({
      next: (res) => {
        this.showToastUpdate();
        this.productForm.reset();
        this.dialogRef.close('update');
      },
      error: () => {
        alert('error while updating');
      },
    });
  }
  showToastUpdate() {
    this.toast.success({
      detail: 'SUCCESS',
      summary: 'Product Updated Successfully',
      duration: 3000,
    });
  }
  showToastAdd() {
    this.toast.success({
      detail: 'SUCCESS',
      summary: 'Product Updated Successfully',
      duration: 3000,
    });
  }
}
