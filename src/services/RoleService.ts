import dal from "./dal";
import { ISerializer } from "./ISerializer";
import { JsonStringSerializer } from "./JsonStringSerializer";
import { Observable, from } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Role } from "./models/Role";
import { ccUsers } from "./models/ccUsers";
import { Item, ItemVersion } from "@pnp/sp";

export class RoleService {
  private dal: dal;
  private serializer: ISerializer;
  private listName: string;

  constructor() {
    this.dal = new dal();
    this.serializer = new JsonStringSerializer();
    this.listName = "ccUsers";
  }

  mapAndParse(item: ccUsers): any {
    let parsed = {};
    try {
      parsed = {
        id: item.Id,
        active: item.PERSON_ACTIVE,
        directorate: item.PERSON_DIRECTORATE,
        email: item.PERSON_EMAIL,
        firstName: item.P_FIRST_NAME,
        lastName: item.P_LAST_NAME,
        rank: item.PERSON_RANK,
        role: item.PERSON_ROLE,
        created: item.Created
      };
    } catch (e) {
      console.error(`Error parsing value in ccRequestTracker item`, e);
      console.error(item);
    }
    return JSON.stringify(parsed);
  }

  read(filters?: string): Observable<Role[]> {
    const select = `Id,Title,Created,PERSON_ACTIVE,PERSON_ATTRIBUTES,PERSON_DIRECTORATE,PERSON_EMAIL,P_FIRST_NAME,P_LAST_NAME,PERSON_RANK,PERSON_ROLE,PERSON_TRAINING`;

    return this.dal
      .getRowsWhere(this.listName, undefined, select, filters)
      .pipe(
        //tap((items: any) => console.log(items)),
        map((items: ccUsers[]) => {
          return items.map(item => this.mapAndParse(item));
        }),
        //hydrate each into an instance of the Request class
        map((items: any[]) => {
          let deserialized: Array<Role> = [];
          items.forEach(item => {
            deserialized.push(
              new Role(this.serializer.deserialize(item, Role))
            );
          });
          return deserialized;
        })
        // tap((items: any) => console.log(items))
      );
  }
}
