import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of, tap, throwError } from 'rxjs';
import { ApiCacheService } from './api-cache.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private httpClient: HttpClient,
    private cacheService: ApiCacheService
  ) {}

  getUser(githubUsername: string) {
    const cacheKey = githubUsername;

    return this.cacheService.get(cacheKey)
      ? of(this.cacheService.get(cacheKey))
      : this.httpClient
          .get(`https://api.github.com/users/${githubUsername}`)
          .pipe(
            tap((data) => this.cacheService.set(cacheKey, data)),
            catchError((error) => throwError(error))
          );
  }

  getRepos(githubUsername: string, pageNumber: number, perPageRepos: number) {
    const cacheKey = `https://api.github.com/users/${githubUsername}/repos?page=${pageNumber}&per_page=${perPageRepos}`;

    return this.cacheService.get(cacheKey)
      ? of(this.cacheService.get(cacheKey))
      : this.httpClient
          .get(
            `https://api.github.com/users/${githubUsername}/repos?page=${pageNumber}&per_page=${perPageRepos}`
          )
          .pipe(
            tap((data) => this.cacheService.set(cacheKey, data)),
            catchError((error) => throwError(error))
          );
  }
}
