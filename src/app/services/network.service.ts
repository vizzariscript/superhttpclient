import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Network } from '@ionic-native/network/ngx';
import { ToastController, Platform } from '@ionic/angular';

export enum ConnectionStatus {
  Online,
  Offline
}

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(ConnectionStatus.Offline);

  constructor(private network: Network, private toastController: ToastController, private plt: Platform) {
  }

  public initializeNetworkEvents() {
    console.log(this.network.type);
    let status = this.network.type !== 'none' ? ConnectionStatus.Online : ConnectionStatus.Offline;
    this.status.next(status);

    this.network.onDisconnect().subscribe(() => {
      if (this.status.getValue() === ConnectionStatus.Online) {
        this.updateNetworkStatus(ConnectionStatus.Offline);
      }
    });

    this.network.onConnect().subscribe(() => {
      if (this.status.getValue() === ConnectionStatus.Offline) {
        this.updateNetworkStatus(ConnectionStatus.Online);
      }
    });
  }

  private async updateNetworkStatus(status: ConnectionStatus) {
    this.status.next(status);

    let connection = status == ConnectionStatus.Offline ? 'Offline' : 'Online';
    if (this.plt.is('mobile')) {
      let toast = this.toastController.create({
        message: `You are now ${connection}`,
        duration: 3000,
        position: 'bottom'
      });
      toast.then(toast => toast.present());
    } else {
      console.log(`You are now ${connection}`);

    }
  }

  public setOnline() {
    this.status.next(ConnectionStatus.Online);
  }

  public setOffline() {
    this.status.next(ConnectionStatus.Offline);
  }

  public onNetworkChange(): Observable<ConnectionStatus> {
    return this.status.asObservable();
  }

  public getCurrentNetworkStatus(): boolean {
    return this.status.getValue() == ConnectionStatus.Online ? true : false;
  }
}
