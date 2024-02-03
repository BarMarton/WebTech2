import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit{
  constructor(private http: HttpClient,
              private authService: AuthService) {
  }
  myPaints: any;
  async ngOnInit() {
      await this.getPaints();
    //console.log(this.myPaints)
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
  calculateTotalPrice(paint: any): void {
    paint.totalPrice = paint.unitPrice * paint.quantity;
  }

  async buyPaint(paint: any): Promise<void> {
    await this.authService.buyPaint(paint.color, paint.quantity);
    await this.ngOnInit();
  }

  /*async getPaints(): Promise<any> {
    this.http.get('http://localhost:3000/getPaintList')
      .subscribe(
        (response) => {
          this.myPaints = response;
        },
        (error) => {
          console.error('Request failed with error')
        },
      )
  }*/
}
