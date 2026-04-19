export class User {
  constructor({
    id,
    email,
    passwordHash,
    fullName,
    role,
    licenseNumber,
    isActive = true,
    createdAt
  }) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.fullName = fullName;
    this.role = role;
    this.licenseNumber = licenseNumber;
    this.isActive = isActive;
    this.createdAt = createdAt;
  }

  toSafeJSON() {
    return {
      id: this.id,
      email: this.email,
      fullName: this.fullName,
      role: this.role,
      licenseNumber: this.licenseNumber,
      isActive: this.isActive,
      createdAt: this.createdAt
    };
  }
}

