import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  http_client = inject(HttpClient);

  constructor() {}

  getUser(username: string) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer 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').set('X-GitHub-Api-Version', '2022-11-28');
    const observable = this.http_client.get<any>(`https://api.github.com/users/${username}`, {headers});
    return observable;
  }
}
