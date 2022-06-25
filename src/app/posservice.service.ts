import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { map, catchError, filter, scan, tap, count } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PosserviceService {

  authorization_key= "Basic YWU2NjU1OWQ0YTk4NDkwYmJjNmQ3NmUxNTQ1ZWI0ZjM=";
  consumer_key= "ae66559d4a98490bbc6d76e1545eb4f3";
  allitems_resp;
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
    this.getAllProductsRequest();
    this.getAllProducts();
    this.getProductsForCategory(10296);
    this.getCountForCategory(10296);
    console.log("All prod :",this.allitems_arr);
   }


  getSelectedCategories():Observable<any[]>{
    var categorylist=JSON.parse(JSON.stringify(this.product_categories));
    console.log("service:#category list",categorylist);
    return  of(categorylist);
  }

rootURL = '/pos';

getAllProductsRequest() {
    var arr=[];
    var resp= this.http.get(this.rootURL + '/allitems',{responseType: 'text'});
    this.allitems_resp=resp;
    return resp;
}

processJson(allitems){
  var processed= allitems.replace(/'/g, '"');
  processed=processed.replace(/None/g, "\"\"");
  processed=processed.replace(/True/g, '"True"');
  processed=processed.replace(/False/g, '"False"');
  processed=processed.replace(/}/g,'},');
  processed=processed.slice(0,-1);
  processed='['+processed+']';
  //console.log("Processed",(processed));
  var itemarr=JSON.parse(processed);
  return itemarr;
}
getAllProducts(){
  var allitems;
  this.allitems_resp.pipe().subscribe((obj) => {
    allitems=obj
    //console.log("Users",allitems);  
    var itemarr=this.processJson(allitems);
    itemarr.forEach(element => {
      this.allitems_arr.push(element);
    });
  });
  return of(this.allitems_arr);
}
  getProductsForCategory(cid){
    var allitems;
    var categoryitems=[];
    var itemmap=new Map();
      
    this.allitems_arr.forEach(element => {
      //console.log("Ele",element.categoryId);
      if(element.categoryId==cid){
        categoryitems.push(element);
        itemmap.set(element.productId,element);
      }
    });
    return from(categoryitems);
  }

  getCountForCategory(cid){
    var counts=[];
    //console.log("check if null",this.allitems_arr);
    var cnt=0;
    this.allitems_resp.pipe().subscribe((obj) => {
      var allitems=obj
      //console.log("Users",allitems);
      var processed= allitems.replace(/'/g, '"');
      processed=processed.replace(/None/g, "\"\"");
      processed=processed.replace(/True/g, '"True"');
      processed=processed.replace(/False/g, '"False"');
      processed=processed.replace(/}/g,'},');
      processed=processed.slice(0,-1);
      processed='['+processed+']';
      //console.log("Processed",(processed));
      var itemarr=JSON.parse(processed);
      
      itemarr.forEach(element => {
        if(element.categoryId==cid){
          cnt++;
          counts.pop();
          counts.push(cnt);
        }
      });
      console.log("Ele",counts);
  });
  return of(counts);
}


getProductsForCategory_copy(cid){
  var allitems;
  var categoryitems=[];
  var itemmap=new Map();

  this.allitems_resp.pipe().subscribe((obj) => {
    allitems=obj
    //console.log("Users",allitems);
    var processed= allitems.replace(/'/g, '"');
    processed=processed.replace(/None/g, "\"\"");
    processed=processed.replace(/True/g, '"True"');
    processed=processed.replace(/False/g, '"False"');
    processed=processed.replace(/}/g,'},');
    processed=processed.slice(0,-1);
    processed='['+processed+']';
    //console.log("Processed",(processed));
    var itemarr=JSON.parse(processed);
    
    itemarr.forEach(element => {
      //console.log("Ele",element.categoryId);
      if(element.categoryId==cid){
        categoryitems.push(element);
        itemmap.set(element.productId,element);
      }
    });
  });
  
  return of(itemmap);
}
}
