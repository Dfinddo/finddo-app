export default class UserDTO {
  constructor(
    params
  ) {
    Object.keys(params).forEach((param) => {
      this[param + ''] = params[param + ''];
    });
  }
}