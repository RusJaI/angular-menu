import { Component, OnDestroy, OnInit } from '@angular/core';
import { ScreenModel } from './pages/screenmodel';
import { PosserviceService } from './posservice.service';
import { ScreenserviceService } from './screenservice.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy{
  countryData = null;
  screen_list :ScreenModel []=[]
  categoryList:any[]=[];
  screendata_map=new Map();
  currentYear = new Date().getFullYear();
  allitemsList=[];

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private screenService:ScreenserviceService,private posService:PosserviceService){
    screenService.getScreens().subscribe((scrn:ScreenModel[]) =>{
      this.screen_list=scrn;
    });

    posService.getSelectedCategories().subscribe((ctg:any[]) =>{
      this.categoryList=ctg;
    });
    
    //this.allitemsList=posService.allitems_arr;
/*     this.posService.getAllProductsRequest().pipe(takeUntil(this.destroy$)).subscribe((items:any) => {
      var arr=this.posService.processJson(items);
      arr.forEach(item=>{
        this.allitemsList.push(item);
      })
      console.log("Alll : ",this.allitemsList);
      this.distributeData();
    });

    console.log("selected categories : ",this.categoryList);
    console.log('appComponent:#screen data map : ',this.screendata_map);
*/
  }
 
  distributeData(){
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
          cat_items= this.getCategoryItems(cat_id);
          item_count=cat_items.length;
          console.log("distribute data:catitemcount,iflag",item_count,cat_items);
          
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
    console.log("distribute data map :",this.screendata_map);
  }

  getCategoryId(cflag){
    var id= this.categoryList[cflag].productCategoryId;
    console.log("appComponents:getCategoryId() :",id);
    return id;
  }

  getCategoryItems(cat_id){
    var categoryitems=[];
    this.allitemsList.forEach(element => {
      if(element.categoryId==cat_id){
        categoryitems.push(element);
      }
    });
    console.log("distribute data:items for category",categoryitems);
    return categoryitems;
  }

  getItemsCount(cat_id){
    var cnt=[];
    this.posService.getCountForCategory(cat_id).subscribe((c) =>{
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

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  
}




