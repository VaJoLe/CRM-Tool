export class User {
  [key: string]: any;


  id?: string;
  firstName: string = '';
  lastName: string = '';
  mail: string = '';
  phone: string = '';
  street: string = '';
  zipCode: string = '';
  city: string = '';
  birthDate: string = '';
  notice: string = '';
  date: string = '';

  constructor(obj?: Partial<User>) {
    if (obj) {
      Object.assign(this, obj);
    }
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
