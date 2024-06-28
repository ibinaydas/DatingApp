import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../models/member';
import { of, tap } from 'rxjs';
import { Photo } from '../models/photo';

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

  public setMainPhoto(photo: Photo) {
    return this.http.put(this.baseUrl + `set-main/${photo.id}`, {}).pipe(
      tap(() => {
        this.members.update(x => x.map(m => {
          if (m.photos.includes(photo)) {
            m.photoUrl = photo.url;
          }
          return m;
        }));
      })
    );
  }

  public deletePhoto(photo: Photo) {
    return this.http.delete(this.baseUrl + `delete-photo/${photo.id}`, {}).pipe(
      tap(() => {
        this.members.update(x => x.map(m => {
          if (m.photos.includes(photo)) {
            m.photos = m.photos.filter(f => f.id !== photo.id);
          }
          return m;
        }));
      })
    );
  }
}
