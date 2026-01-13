export class User {
  id?: string;
  email: string;
  password: string;
  coordinate_id: string;
  party_id?: string;

  constructor(email: string, password: string, coordinate_id: string, party_id?: string, id?: string) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.coordinate_id = coordinate_id;
    this.party_id = party_id;
  }
}
