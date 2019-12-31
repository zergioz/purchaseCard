import dal from "./dal";
import { ISerializer } from "./ISerializer";
import { JsonStringSerializer } from "./JsonStringSerializer";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

export class UserService {
  private dal: dal;
  private serializer: ISerializer;

  constructor() {
    this.dal = new dal();
    this.serializer = new JsonStringSerializer();
    this.dal.getCurrentUser().subscribe();
  }

  search() {}

  getCurrentUser(): Observable<any> {
    return this.dal.getCurrentUser();
  }
}
