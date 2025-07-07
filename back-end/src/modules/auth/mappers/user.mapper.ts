import { User } from '../domain/user.domain';
import { User as TypeORMUser } from './../../users/entities/user.entity';

export class UserMapper {
  static toDomain(user: TypeORMUser): User {
    return User.create(
      {
        email: user.email,
        password: user.password, // In a real application, you should not expose the password
      },
      user.id,
    );
  }
  static toTypeORM(user: User): TypeORMUser {
    const typeOrmUser = new TypeORMUser();
    typeOrmUser.id = user.id;
    typeOrmUser.email = user.email;
    typeOrmUser.password = user.password; // In a real application, you should not expose the password

    return typeOrmUser;
  }
  static toJson(user: User) {
    return {
      id: user.id,
      email: user.email,
    };
  }
}
