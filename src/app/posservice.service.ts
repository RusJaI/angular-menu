import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProductModel } from './pages/ProductModel';

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
 products=[
  {
    "productId": 0,
    "sku": "fgf",
    "productName": "aaa",
    "categoryId": 10,
    "category": "string",
    "price": 5,
    "medPrice": 0,
    "recPrice": 0,
    "unitCost": 0,
    "unitType": "string",
    "daysSupply": 0
  },
  {
    "productId": 50,
    "sku": "string",
    "productName": "bbb",
    "categoryId": 10,
    "category": "string",
    "price": 10,
    "medPrice": 0,
    "recPrice": 0,
    "unitCost": 0,
    "unitType": "string",
    "daysSupply": 0
  },
  {
    "productId": 47,
    "sku": "string",
    "productName": "ccc",
    "categoryId": 40,
    "category": "string",
    "price": 20,
    "medPrice": 0,
    "recPrice": 0,
    "unitCost": 0,
    "unitType": "string",
    "daysSupply": 0
  },
  {
    "productId": 20,
    "sku": "string",
    "productName": "ddd",
    "categoryId": 25,
    "category": "string",
    "price": 30,
    "medPrice": 0,
    "recPrice": 0,
    "unitCost": 0,
    "unitType": "string",
    "daysSupply": 0
  },
];


  constructor(private http:HttpClient) {
    this.getSelectedCategories();
    this.getAllProducts();
    this.getProductsForCategory(25);
   }

  getSelectedCategories():Observable<any[]>{
    var categorylist=JSON.parse(JSON.stringify(this.product_categories));
    console.log("###",categorylist);
    return  of(categorylist);
  }

  getAllProducts():Observable<any[]>{
    var itemarr=[];
    var url='https://publicapi.leaflogix.net/products';

    const headers = new HttpHeaders()
    .set('Accept', 'application/json')
    .set("Authorization",this.authorization_key)
    .set("ConsumerKey",this.consumer_key)
    .set("Access-Control-Allow-Origin",'true');
    
    this.http.get<any>(url,{ headers: headers }).subscribe(data => {
        itemarr = data;
        console.log("response ",data);
    })   
    return of(itemarr) 
  }

  getProductsForCategory(cid):Observable<any[]>{
    var productlistforcategory=JSON.parse(JSON.stringify(this.products.filter(prd => {
      return prd.categoryId == cid;
   })));
   
    console.log("prd service : ",productlistforcategory);

    return of(productlistforcategory);
  }
}
