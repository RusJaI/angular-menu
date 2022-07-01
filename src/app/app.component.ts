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
   /* screenService.getScreens().subscribe((scrn:ScreenModel[]) =>{
      this.screen_list=scrn;
    });*/
    
    screenService.getScreens().pipe().subscribe(scrn=>{
      var screens=[];
      screens=posService.processDjangoJson(scrn);
      screens.forEach(scr=>{
        this.screen_list.push(scr);
      });
      console.log("real screens : ",this.screen_list);
    });
  
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




