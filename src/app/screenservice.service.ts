import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ScreenModel } from './pages/screenmodel';

@Injectable({
  providedIn: 'root'
})

export class ScreenserviceService {
  screen_list=[];
  screens=[
{"id":"s001","screen_width":2438,"screen_height":4224,"bgcolor":"black","type":"menu","orientation":"portrait"},
{"id":"s003","screen_width":350,"screen_height":400,"bgcolor":"black","type":"menu","orientation":"landscape"},
{"id":"s005","screen_width":250,"screen_height":500,"bgcolor":"white","type":"media","orientation":"portrait"}];


  constructor() {
    this.getScreens();
   }

  getScreens():Observable<ScreenModel[]>{
    var screenlist=JSON.parse(JSON.stringify(this.screens));
    console.log("service: screenlist",screenlist);
    return  of(screenlist);
  }

  

}
