export class CreateUserDto {
  email: string;
  name: string;
  roles: string[];
  rolesOverride: string[];
}
