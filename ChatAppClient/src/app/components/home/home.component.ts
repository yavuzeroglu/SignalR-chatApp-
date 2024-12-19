import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserModel } from '../../Models/user.model';
import { ChatModel } from '../../Models/chat.model';
import * as signalR from "@microsoft/signalr";
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NgOptimizedImage, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass'
})

export class HomeComponent {
  users: UserModel[] = [];
  chats: ChatModel[] = [];
  selectedUserId: string = "";
  selectedUser: UserModel = new UserModel();
  user = new UserModel();
  hub: signalR.HubConnection | undefined;
  message: string = "";

  constructor(
    private http: HttpClient
  ) {
    this.user = JSON.parse(localStorage.getItem("accessToken") ?? "");
    this.getUsers();

    this.hub = new signalR.HubConnectionBuilder().withUrl("http://localhost:5082/chat-hub").build();
    this.hub.start().then(() => {
      console.log("Connection Started");

      this.hub?.invoke("Connect", this.user.id);

      this.hub?.on("Users", res => {
        console.log(res);
        this.users.find(p => p.id == res.id)!.status = res.status;
      })

      this.hub?.on("Messages", (res: ChatModel) => {
        console.log(res);
        if (this.selectedUserId === res.userId) {
          this.chats.push(res);
        }
      })
    });
  }

  changeUser(user: UserModel) {
    this.selectedUserId = user.id;
    this.selectedUser = user;

    this.http
      .get(`http://localhost:5082/api/Chats/GetChats?userId=${this.user.id}&toUserId=${this.selectedUserId}`)
      .subscribe((res: any) => {
        this.chats = res;
      })

  }

  logout() {
    localStorage.clear();
    document.location.reload();
  }

  getUsers() {
    this.http.get<UserModel[]>("http://localhost:5082/api/Chats/getusers").subscribe(res => {
      this.users = res.filter(p => p.id != this.user.id);
    })
  }

  sendMessage() {
    const data = {
      "userId": this.user.id,
      "toUserId": this.selectedUserId,
      "message": this.message
    };
    this.http.post<ChatModel>("http://localhost:5082/api/Chats/SendMessage", data)
      .subscribe((res) => {
        this.chats.push(res);
        this.message = "";
      });
  }
}

