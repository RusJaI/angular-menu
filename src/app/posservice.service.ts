import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PosserviceService {

  authorization_key= "Basic YWU2NjU1OWQ0YTk4NDkwYmJjNmQ3NmUxNTQ1ZWI0ZjM=";
  consumer_key= "ae66559d4a98490bbc6d76e1545eb4f3";
  
  product_categories=[
    {
      "productCategoryId": 25,
      "productCategoryName": "string",
      "flagged": "false"
    },
    {
      "productCategoryId": 0,
      "productCategoryName": "string",
      "flagged": "true"
    },
    {
      "productCategoryId": 10,
      "productCategoryName": "string",
      "flagged": "false"
    }
  ];

  constructor(private http:HttpClient) {
    this.getSelectedCategories();
    this.getAllProducts();
    this.getProductsForCategory(12);
   }

  getSelectedCategories():Observable<any[]>{
    var categorylist=JSON.parse(JSON.stringify(this.product_categories));
    console.log("###",categorylist);
    return  of(categorylist);
  }

  getAllProducts():Observable<any[]>{
   // var url='https://cors-anywhere.herokuapp.com/https://publicapi.leaflogix.net/products';
    var url='http://127.0.0.1:8000/pos/allitems';
    const headers = new HttpHeaders()
    .set('Accept', 'application/json')
    .set("Authorization",this.authorization_key)
    .set("ConsumerKey",this.consumer_key)
  
    return this.http.get<any>(url,{ headers: headers })
    .pipe(
      map((response) => {
        console.log("#resp:",response);
        return response;
      }),
      catchError((err, caught) => {
        console.error(err);
        throw err;
      }
      )
    );
  }

  getProductsForCategory(cid){
    var allitems=this.getAllProducts();
    var categoryitems=[];

    allitems.subscribe(obj=>{
      obj.forEach(itm=>{
        if(itm.categoryId == cid){
          categoryitems.push(itm);
        }
      });
    })
    return of(categoryitems);
  }
  
}
