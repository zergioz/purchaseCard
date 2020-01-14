import { JsonSerializer } from "./JsonSerializer";

export class JsonStringSerializer extends JsonSerializer {
  serialize(domainObject: any, classType: any): any {
    return JSON.stringify(super.serialize(domainObject, classType));
  }
  deserialize<T>(json: any, classType: any): T {
    return JSON.parse(super.deserialize(json, classType)) as T;
  }
}
