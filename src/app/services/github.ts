import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class GithubService {
  http_client = inject(HttpClient);

  constructor() {}

  getUser(username: string) {
  return this.http_client.get<any>(`https://api.github.com/users/${username}`);
}

}
