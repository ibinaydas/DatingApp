import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../models/member';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/users/';

  public getMembers() {
    return this.http.get<Member[]>(this.baseUrl);
  }

  public getMemberById(id: number) {
    return this.http.get<Member>(this.baseUrl + id);
  }

  public getMemberByName(name: string) {
    return this.http.get<Member>(this.baseUrl + name);
  }
}
