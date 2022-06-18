import { Component } from '@angular/core';
import { ScreenModel } from './pages/screenmodel';
import { PosserviceService } from './posservice.service';
import { ScreenserviceService } from './screenservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  screen_list :ScreenModel []=[]
  categoryList:any[]=[];
  productList:any[]=[];
  title = 'angular-web';
  screenwithdata:any[]=[];
  productcount_map = new Map();
  screendata_map=new Map();
  currentYear = new Date().getFullYear();
  
  constructor(screenService:ScreenserviceService,posService:PosserviceService){

    screenService.getScreens().subscribe((scrn:ScreenModel[]) =>{
      this.screen_list=scrn;
    });

    this.screenwithdata=this.screen_list;

    posService.getSelectedCategories().subscribe((ctg:any[]) =>{
      this.categoryList=ctg;
    });
    
    //console.log("Prod : ",this.categoryList);

    this.categoryList.forEach(catg=>{
      posService.getProductsForCategory(catg.productCategoryId).subscribe((prd:any[])=>{
      if(prd!=null){
        this.productcount_map.set(catg.productCategoryId,prd);
      }
    
      });
    });
    
    console.log("Product List : ",this.productcount_map,this.productList);

    var cnt=0;
    this.productcount_map.forEach((value: any[], key: number) => {
      value.forEach(obj=>{
        this.productList.push(obj);
      });
    });
    
    console.log("plist : ",this.productList);

    var catgid,nrows,diffrows,upperstartrow=0,i=0;
    this.screen_list.forEach(scrn=>{
      if(scrn.type=="menu"){
        scrn.content=[]
        nrows=Math.round((scrn.screen_height)/50);
        if(nrows>=this.productList.length){//equal or more space
          catgid=this.productList[0].categoryId;
          for(var l=0;l<this.productList.length;l++){
            if(catgid!=this.productList[l].categoryId){
              //if flagged {
                //catgid=this.productList[l].categoryId;
                //break;
              //}
            }
            scrn.content.push(this.productList[l]);
            this.productList=this.productList.shift();//remove first element
          }
        }else if(nrows<this.productList.length){
          for(var l=0;l<nrows;l++){
            if(catgid!=this.productList[l].categoryId){
              //if flagged {
                //catgid=this.productList[l].categoryId;
                //break;
              //}
            }
            scrn.content.push(this.productList[l]);
            this.productList=this.productList.shift();//remove first element
          }
        }
      }
      this.screendata_map.set(scrn.id,scrn);
    });

    console.log("screen data map : ",this.screendata_map);
  /*  var catgrows,nrows,diffrows,nextstartrow=0,i=0;

    this.categoryList.forEach(catg=>{

       catgrows=this.productcount_map.get(catg.productCategoryId);

       for (i < this.screen_list.length; i++;) {

        nrows=Math.round((this.screen_list[i].screen_height)/50);
        diffrows=catgrows-nrows;
        if(diffrows=0){
          this.screendata_map.set(this.screen_list[i].id,[nextstartrow,nrows]);
          nextstartrow=0;
          break;
        }
        else if(diffrows<0 ){ //more space left 
          this.screendata_map.set(this.screen_list[i].id,[i,catgrows]);
          nextstartrow=nrows+diffrows //diff is a negative value
          i--;
          break;

        }
        else if(diffrows>0){ //next screen also displays same category
          this.screendata_map.set(this.screen_list[i].id,[nextstartrow,nrows]);
          nextstartrow=0;
          continue;
        }
       }

       console.log("screen data map ",this.screendata_map)
    });
  */
  }

}

