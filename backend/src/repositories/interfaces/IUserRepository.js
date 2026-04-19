export class IUserRepository {
  async findByEmail(_email) {
    throw new Error("findByEmail must be implemented");
  }

  async findById(_id) {
    throw new Error("findById must be implemented");
  }

  async save(_userData) {
    throw new Error("save must be implemented");
  }
}

