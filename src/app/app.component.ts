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

    screenService.getScreens().pipe(takeUntil(this.destroy$)).subscribe(scrn=>{
      var screens=[];
      screens=posService.processDjangoJson(scrn);
      screens.forEach(scr=>{
        this.screen_list.push(scr);
      });
      console.log("real screens : ",this.screen_list);
    });
  
    setInterval(()=>{window.location.reload();},300000);
  }
 
  refreshPage(){
    window.location.reload();
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  
}




