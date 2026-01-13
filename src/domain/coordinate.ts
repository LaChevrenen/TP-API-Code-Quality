export class Coordinate {
  id?: string;
  city: string;
  country: string;

  constructor(city: string, country: string, id?: string) {
    this.id = id;
    this.city = city;
    this.country = country;
  }
}
