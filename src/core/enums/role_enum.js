export class UserTypeEnum {
  static admin = "admin";
  static user = "user";

  static get values() {
    return [UserTypeEnum.admin, UserTypeEnum.user];
  }

  static isValid(role) {
    return this.values.includes(role);
  }
}
