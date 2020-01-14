export interface ISerializer {
  serialize(domainObject: any, classType: any): any;
  deserialize<T>(json: any, classType: any): T;
}
