import bcrypt from "bcryptjs";
import { UserRole } from "../domain/enums/user-role.js";
import { AppError } from "../utils/app-error.js";
import { signAccessToken } from "../utils/jwt.js";

export class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async register({ email, password, fullName, licenseNumber, role = UserRole.CUSTOMER }) {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new AppError("Email is already registered", 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.userRepository.save({
      email,
      passwordHash,
      fullName,
      licenseNumber,
      role: UserRole.CUSTOMER
    });

    return this.buildAuthResponse(user);
  }

  async login({ email, password }) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    return this.buildAuthResponse(user);
  }

  async getProfile(userId) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user.toSafeJSON();
  }

  buildAuthResponse(user) {
    const token = signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role
    });

    return {
      token,
      user: user.toSafeJSON()
    };
  }
}
