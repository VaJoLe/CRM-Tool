export class User {
  id?: string;
  firstName: string;
  lastName: string;
  birthDate: any;
  mail: string;
  phone: number;
  street: string;
  zipCode: number;
  city: string;
  notice: string;
  date: string;

  constructor(obj?: any) {
    this.firstName = obj ? obj.firstName : '';
    this.lastName = obj ? obj.lastName : '';
    this.birthDate = obj ? obj.birthDate : '';
    this.mail = obj ? obj.mail : '';
    this.phone = obj ? obj.phone : '';
    this.street = obj ? obj.street : '';
    this.zipCode = obj ? obj.zipCode : '';
    this.city = obj ? obj.city : '';
    this.id = obj?.id || '';
    this.notice = obj ? obj.notice : '';
    this.date = obj ? obj.date : '';
  }

  toJSON() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      birthDate: this.birthDate,
      mail: this.mail,
      phone: this.phone,
      street: this.street,
      zipCode: this.zipCode,
      city: this.city,
      notice: this.notice,
      date: this.date,
    };
  }
}
