import { ISerializer } from "./ISerializer";
import { Serialize, Deserialize } from "cerialize";

export class JsonSerializer implements ISerializer {
  serialize(domainObject: any, classType: any): any {
    return Serialize(domainObject, classType);
  }
  deserialize(json: any, classType: any): any {
    return Deserialize(json, classType);
  }
}
