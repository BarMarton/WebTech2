import {Component, Input} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {CommonModule} from '@angular/common';
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private http: HttpClient,
              private authService: AuthService) {
  }
  myPaints: any;
  myOrders: any;
  async ngOnInit() {
      await this.getPaints();
      await this.getOrders();
    //console.log(this.myPaints)
  }

  async getOrders(): Promise<any> {
    try {
      const response = await this.http.get('http://localhost:3000/getOrders').toPromise();
      // @ts-ignore
      this.myOrders = response[0];
    } catch (error) {
      console.error('Request failed with error', error);
    }
  }

  async ship(order: any): Promise<void> {
    await this.authService.ship(order._id);
    await this.ngOnInit()
  }
  async getPaints(): Promise<any> {
    try {
      const response = await this.http.get('http://localhost:3000/getPaintList').toPromise();
      // @ts-ignore
      this.myPaints = response[0];
    } catch (error) {
      console.error('Request failed with error', error);
    }
  }

  newPaint: any = { color: '', stock: 0, unitPrice: 0 };

  async addNewPaint(): Promise<void> {
    await this.authService.addPaint(this.newPaint.color.substring(1), this.newPaint.stock, this.newPaint.unitPrice);
    await this.ngOnInit()
  }

  clearNewPaintForm(): void {
    this.newPaint = { color: '', stock: 0, unitPrice: 0 };
  }
  showAddPaintForm: boolean = false;

  toggleAddPaintForm(): void {
    this.showAddPaintForm = !this.showAddPaintForm;
    if (this.showAddPaintForm) {
      this.clearNewPaintForm();
    }
  }
}
