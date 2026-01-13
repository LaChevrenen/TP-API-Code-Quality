export class PartyAggregateCity {
  party_name: string;
  city: string;
  member_count: number;

  constructor(party_name: string, city: string, member_count: number) {
    this.party_name = party_name;
    this.city = city;
    this.member_count = member_count;
  }
}

export class PartyAggregateCountry {
  party_name: string;
  country: string;
  member_count: number;

  constructor(party_name: string, country: string, member_count: number) {
    this.party_name = party_name;
    this.country = country;
    this.member_count = member_count;
  }
}
