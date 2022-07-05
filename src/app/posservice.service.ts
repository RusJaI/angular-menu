import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PosserviceService {

  authorization_key= "Basic YWU2NjU1OWQ0YTk4NDkwYmJjNmQ3NmUxNTQ1ZWI0ZjM=";
  consumer_key= "ae66559d4a98490bbc6d76e1545eb4f3";
  allitems_resp;
  allitems_arr=[]; 

  constructor(private http:HttpClient) {
    this.getSelectedCategories();
    this.getAllProductsRequest();
    //this.getAllProducts();
    //this.getProductsForCategory(10296);
    //this.getCountForCategory(10296);
    //console.log("All prod :",this.allitems_arr);
   }

  getSelectedCategories(){
	var resp= this.http.get(this.rootURL + '/selectedcategories',{responseType: 'text'});
    return resp;
  }

rootURL = '/pos';

getAllProductsRequest() {
    var arr=[];
    var resp= this.http.get(this.rootURL + '/allitems',{responseType: 'text'});
    this.allitems_resp=resp;
    return resp;
}

processDjangoJson(respstring){
 /* console.log("received from django : ",respstring);
	var processed= respstring.replace(/'/g, '"');
	processed=processed.replace(/None/g, "\"\"");
	processed=processed.replace(/}/g,'},');
	processed=processed.slice(0,-1);
	processed='['+processed+']';
	console.log("step5 : ",processed);*/
	var itemarr=JSON.parse(respstring);
	//var itemarr=this.temparr;
	return itemarr;
}
processJson(allitems){
 /* var processed= allitems.replace(/'/g, '"');
  processed=processed.replace(/None/g, "\"\"");
  processed=processed.replace(/True/g, '"True"');
  processed=processed.replace(/False/g, '"False"');
  processed=processed.replace(/}/g,'},');
  processed=processed.slice(0,-1);
  processed='['+processed+']';
  console.log("Processed",(processed));*/
  var itemarr=JSON.parse(allitems);
  console.log("Processed",(itemarr));
  //var itemarr=this.temparr;
  return itemarr;
}
getAllProducts(){
  var allitems;
  this.allitems_resp.pipe().subscribe((obj) => {
    allitems=obj
    //console.log("Users",allitems);  
    var itemarr=this.processJson(allitems);
    this.allitems_arr=itemarr;
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
