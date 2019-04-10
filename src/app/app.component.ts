import { Component } from '@angular/core';
import { HubConnection, HubConnectionBuilder, IHttpConnectionOptions, LogLevel } from "@aspnet/signalr";
import { HttpClient } from '@angular/common/http';
import { tap } from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public httpClient: HttpClient) { }

  title = 'signalr-serverless-angular-client';

  ngOnInit() {
    this.httpClient.get("http://localhost:7071/api/signalrInfo")
    .pipe(tap(async (x:any) => await this.connect(x.url,x.accessToken)))
    .subscribe();    
  }

  public connect(url:string, accessToken:string):Promise<any> {
    this._connect = new Promise((resolve,reject) => {

      const options: IHttpConnectionOptions = {
        accessTokenFactory: () => accessToken,
      };

      this._connection = new HubConnectionBuilder()
      .withUrl(url,options)
      .build();

      this._connection.start()
      .then(() => resolve("Connected"))
      .catch(() => reject("Failed Connection"));
    });

    return this._connect;
  }

  private _connection:HubConnection;
  private _connect:Promise<any>;
}
