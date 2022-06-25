import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ScreenModel } from './pages/screenmodel';
import { PosserviceService } from './posservice.service';
import { ScreenserviceService } from './screenservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  countryData = null;
  screen_list :ScreenModel []=[]
  categoryList:any[]=[];
  screendata_map=new Map();
  currentYear = new Date().getFullYear();
  allitemsList;
  constructor(private screenService:ScreenserviceService,private posService:PosserviceService){
    screenService.getScreens().subscribe((scrn:ScreenModel[]) =>{
      this.screen_list=scrn;
    });

    posService.getSelectedCategories().subscribe((ctg:any[]) =>{
      this.categoryList=ctg;
    });
    
    this.allitemsList=posService.allitems_arr;
    
    console.log("selected categories : ",this.categoryList);
    this.distributeData(posService);
    console.log('appComponent:#screen data map : ',this.screendata_map);

    this.getItemsCount(posService,10296);
    this.getCategoryItems_cp(posService,10296);
  }
 
  distributeData(posService){
    var cflag=0;//category flag
    var iflag=0;//item flag
    var sflag=true;//space flag
    var maxrows=12;
    var cat_id,cat_items:any[]=[],item_count=0,display_count,ifflagged=false;
    this.screen_list.forEach(scrn=>{
      console.log("In distribute data :",scrn.id);
      if(scrn.type=="menu"){
        console.log("In distribute data menu :",scrn.id);
        sflag=true;
        while(sflag){ 
          cat_id=this.getCategoryId(cflag);
          cat_items= this.getCategoryItems(posService,cat_id);
          item_count=cat_items.length;
          console.log("appComponent:catitemcount,iflag",item_count,cat_items);
          
          if((item_count-iflag)<maxrows){//less than screen size
            display_count=iflag+(item_count-iflag)
            this.setScreenDisplayContent(scrn.id,cat_items.slice(iflag,display_count));
            cflag++;
            iflag=0;
            sflag=true;
          }else if((item_count-iflag)==maxrows){//fit to screen
            display_count=maxrows+iflag;
            this.setScreenDisplayContent(scrn.id,cat_items.slice(iflag,display_count));
            cflag++;
            iflag=0;
            sflag=false;
          }else if((item_count-iflag)>maxrows){//more than screen
            display_count=maxrows+iflag;
            this.setScreenDisplayContent(scrn.id,cat_items.slice(iflag,display_count));
            iflag+=maxrows;
            sflag=false;
          }
          ifflagged=this.ifCategoryFlagged(cflag);
          if(ifflagged){
            sflag=false;
          }
        }
      }else{
        //media
      }
    });
  }

  getCategoryId(cflag){
    var id= this.categoryList[cflag].productCategoryId;
    console.log("appComponents:getCategoryId() :",id);
    return id;
  }

  getCategoryItems(posService,cat_id){
    var itemlist=[];
    posService.getProductsForCategory(cat_id).subscribe((ilist:any[]) =>{
      itemlist=ilist;
    });
    console.log("#appcompponent:items for given category:",itemlist);
    return itemlist;
  }

  getItemsCount(posService,cat_id){
    var cnt=[];
    posService.getCountForCategory(cat_id).subscribe((c) =>{
      cnt=c;
    });
    console.log("#appcompponent:count for given category:",cnt);
    return cnt;
  }

  ifCategoryFlagged(cflag: number): boolean {
    var res=this.categoryList[cflag].flagged;
    return res;
  }

  setScreenDisplayContent(scrn_id,content:any[]) {
    this.screendata_map.set(scrn_id,content);
  }

  roleData;
  getCategoryItems_cp(posService,cat_id){
    console.log("allitemslist",this.allitemsList);

    posService.getAllProducts().subscribe(data => {
      this.roleData = data;
      console.log("data['data']",data);
      console.log("roleData",this.roleData);
    });
  }
}




