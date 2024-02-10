export class User {
  constructor(public token: string, public userInfo: {firstName: string, lastName: string, username: string, createdAt: Date}) {
  }
}
