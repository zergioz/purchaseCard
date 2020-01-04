import dal from "./dal";
import { Observable } from "rxjs";

export class UserService {
  private dal: dal;

  constructor() {
    this.dal = new dal();
    this.dal.getCurrentUser().subscribe();
  }

  search() {}

  getCurrentUser(): Observable<any> {
    return this.dal.getCurrentUser();
  }
}
