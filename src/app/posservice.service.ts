import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProductModel } from './pages/ProductModel';

@Injectable({
  providedIn: 'root'
})

export class PosserviceService {

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


  constructor() {
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
    var productlist=JSON.parse(JSON.stringify(this.products));
    console.log("###",productlist);
    return  of(productlist);
  }

  getProductsForCategory(cid):Observable<any[]>{
    var productlistforcategory=JSON.parse(JSON.stringify(this.products.filter(prd => {
      return prd.categoryId == cid;
   })));
   
    console.log("prd service : ",productlistforcategory);

    return of(productlistforcategory);
  }
}
