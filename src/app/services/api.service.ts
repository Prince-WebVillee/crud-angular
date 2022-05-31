import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  postProduct(data: any) {
    return this.http.post<any>('http://localhost:8000/productList', data);
  }

  getProduct() {
    return this.http.get<any>('http://localhost:8000/productList');
  }
  putProduct(data: any, id: any) {
    return this.http.put<any>('http://localhost:8000/productList/' + id, data);
  }

  deleteProduct(id: any) {
    return this.http.delete<any>('http://localhost:8000/productList/' + id);
  }
}
