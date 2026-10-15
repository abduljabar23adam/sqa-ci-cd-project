class UserService {
  constructor() {
    this.users = [];
    this.nextId = 1;
  }

  isValidEmail(email) {
    return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  addUser(name, email) {
    if (!name || !name.trim()) throw new Error('Name is required');
    if (!this.isValidEmail(email)) throw new Error('Invalid email');
    if (this.users.some((u) => u.email === email)) {
      throw new Error('Email already registered');
    }
    const user = { id: this.nextId++, name: name.trim(), email };
    this.users.push(user);
    return user;
  }

  getUser(id) {
    return this.users.find((u) => u.id === id) || null;
  }

  deleteUser(id) {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }

  getAllUsers() {
    return [...this.users];
  }
}
module.exports = UserService;