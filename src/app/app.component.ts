import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import Swal from 'sweetalert2';
interface userObject {
  avatar: string;
  name: string;
  bio: string;
  twitter: string;
  location: string;
  repositoryCount: number;
}

interface cardObject {
  name: string;
  topics: Array<string>;
  description: string;
  language: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  user: userObject = {
    avatar: '',
    name: '',
    bio: '',
    twitter: '',
    location: '',
    repositoryCount: 0,
  };

  isLoading: boolean = true;
  searchFound: boolean = false;
  searchUser: string = '';
  totalPages: number = 0;
  page: number = 1;
  pageFrom: number = 1;
  pageTo: number = 10;
  perPageRepos: number = 10;

  cardsData: Array<cardObject> = [];

  constructor(private apiService: ApiService) {}

  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  nextPage() {
    if (this.page < this.user.repositoryCount) {
      this.page++;
      this.pageFrom += 10;
      if (this.page < this.totalPages) {
        this.pageTo += 10;
      }
    }

    this.getUserRepositories();
  }
  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.pageFrom -= 10;
      if (this.pageTo > this.perPageRepos) {
        this.pageTo -= 10;
      }
    }
    this.getUserRepositories();
  }

  goToPage(pageNumber: number) {
    this.page = pageNumber;
    this.getUserRepositories();
  }

  onPerPageRepoChange() {
    this.getUserRepositories();
  }

  setUserDetails(data: any) {
    this.user.name = data.login;
    this.user.avatar = data.avatar_url;
    this.user.bio = data.bio;
    this.user.twitter = data.twitter_username;
    this.user.location = data.location;
    this.user.repositoryCount = data.public_repos;
  }

  getUserRepositories() {
    this.apiService
      .getRepos(this.searchUser, this.page, this.perPageRepos)
      .subscribe(
        (data: any) => {
          this.searchFound = true;
          this.cardsData = data;
          this.setActiveButton();
        },
        (error: Error) => {
          this.Toast.fire({
            icon: 'error',
            title: 'No Repository Found',
          });
        }
      );
  }
  findUser() {
    const regex = /^[a-zA-Z](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
    let searchValidation = true;
    if (!regex.test(this.searchUser)) {
      searchValidation = false;
      this.Toast.fire({
        icon: 'error',
        title: 'Invalid Username',
      });
    }
    if (searchValidation) {
      this.isLoading = true;
      this.searchFound = true;

      this.apiService.getUser(this.searchUser).subscribe(
        (data: any) => {
          this.setUserDetails(data);
          this.isLoading = false;
          this.searchFound = true;
          this.Toast.fire({
            icon: 'success',
            title: 'User Found',
          });
          this.totalPages = Math.ceil(
            this.user.repositoryCount / this.perPageRepos
          );
          this.getUserRepositories();
        },
        (error: Error) => {
          this.searchFound = false;
          this.Toast.fire({
            icon: 'error',
            title: 'No User Found',
          });
        }
      );
    }
  }

  setActiveButton() {
    let buttons = document.querySelectorAll('.btn');
    buttons?.forEach((button) => {
      button.classList.remove('bg-blue-950');
    });

    document
      .getElementById(`pageBtn-${this.page}`)
      ?.classList.add('bg-blue-950');
  }

  getPageNumbers(totalPages: number): number[] {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  }
}
