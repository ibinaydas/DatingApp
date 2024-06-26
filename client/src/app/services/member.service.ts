import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../models/member';
import { of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  public members = signal<Member[]>([]);
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/users/';

  public getMembers() {
    return this.http.get<Member[]>(this.baseUrl).subscribe(res => {
      this.members.set(res);
    });
  }

  public getMemberById(id: number) {
    const matchingMember = this.members().find(x => x.id === id);
    if (matchingMember) {
      return of(matchingMember);
    } else {
      return this.http.get<Member>(this.baseUrl + id);
    }
  }

  public getMemberByName(name: string) {
    const matchingMember = this.members().find(x => x.username.toLowerCase() === name.toLowerCase());
    if (matchingMember) {
      return of(matchingMember);
    } else {
      return this.http.get<Member>(this.baseUrl + name);
    }
  }

  public updateMember(member: Member) {
    return this.http.put(this.baseUrl, member).pipe(
      tap(() => {
        this.members.update(x => x.map(m => m.id === member.id ? member : m));
      })
    );
  }
}
