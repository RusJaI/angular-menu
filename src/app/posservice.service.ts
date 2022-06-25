import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError, filter, scan } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PosserviceService {

  authorization_key= "Basic YWU2NjU1OWQ0YTk4NDkwYmJjNmQ3NmUxNTQ1ZWI0ZjM=";
  consumer_key= "ae66559d4a98490bbc6d76e1545eb4f3";
  allitems_arr=[];
  product_categories=[
    {
      "productCategoryId": 10296,
      "productCategoryName": "string",
      "flagged": "false"
    },
    {
      "productCategoryId": 0,
      "productCategoryName": "string",
      "flagged": "true"
    },
    {
      "productCategoryId": 10303,
      "productCategoryName": "string",
      "flagged": "false"
    }
  ];

  constructor(private http:HttpClient) {
    this.getSelectedCategories();
    this.getAllProducts();
    this.getProductsForCategory(10296);
   }

  getSelectedCategories():Observable<any[]>{
    var categorylist=JSON.parse(JSON.stringify(this.product_categories));
    console.log("###",categorylist);
    return  of(categorylist);
  }

  /*getAllProducts():Observable<any[]>{
   // var url='https://cors-anywhere.herokuapp.com/https://publicapi.leaflogix.net/products';
    //var url='https://publicapi.leaflogix.net/products';
    //var url='http://localhost:8000/pos/allitems';
    var url='pos/allitems';

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
*/
rootURL = '/pos';

getAllProducts() {
    var resp= this.http.get(this.rootURL + '/allitems',{responseType: 'text'});
    resp.subscribe(s=>{
      console.log("##sss",s);
    });
    return resp;
}
  getProductsForCategory(cid){
    var allitems;
    var categoryitems=[];

    this.getAllProducts().pipe().subscribe((obj) => {
      allitems=obj
      console.log("Users",allitems);
      var processed= allitems.replace(/'/g, '"');
      processed=processed.replace(/None/g, "\"\"");
      processed=processed.replace(/True/g, '"True"');
      processed=processed.replace(/False/g, '"False"');
      processed=processed.replace(/}/g,'},');
      processed=processed.slice(0,-1);
      processed='['+processed+']';
      console.log("Processed",(processed));
      var itemarr=JSON.parse(processed);
      
      itemarr.forEach(element => {
        console.log("Ele",element.categoryId);
        if(element.categoryId==cid){
          categoryitems.push(element);
        }
      });
    });
    console.log("final:",categoryitems);
    
    /* allitems.subscribe(obj=>{
      console.log("GetllProf: ",obj);
      obj.forEach(itm=>{
        if(itm.categoryId == cid){
          categoryitems.push(itm);
        }
      });
    })*/
    return of(categoryitems);
  }
  
}
