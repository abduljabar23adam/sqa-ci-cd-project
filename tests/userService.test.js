const UserService = require('../src/userService');

describe('UserService', () => {
  let service;

  beforeEach(() => {
    service = new UserService();
  });

  test('addUser returns the new user with an id', () => {
    const user = service.addUser('Budi', 'budi@mail.com');
    expect(user).toEqual({ id: 1, name: 'Budi', email: 'budi@mail.com' });
  });

  test('ids increase for each new user', () => {
    service.addUser('A', 'a@mail.com');
    const second = service.addUser('B', 'b@mail.com');
    expect(second.id).toBe(2);
  });

  test('addUser throws when name is empty', () => {
    expect(() => service.addUser('', 'a@mail.com')).toThrow('Name is required');
  });

  test('addUser throws when name is only spaces', () => {
    expect(() => service.addUser('   ', 'a@mail.com')).toThrow('Name is required');
  });

  test('addUser throws on invalid email', () => {
    expect(() => service.addUser('A', 'not-an-email')).toThrow('Invalid email');
  });

  test('addUser throws when email is not a string', () => {
    expect(() => service.addUser('A', undefined)).toThrow('Invalid email');
  });

  test('addUser throws on duplicate email', () => {
    service.addUser('A', 'a@mail.com');
    expect(() => service.addUser('B', 'a@mail.com')).toThrow('Email already registered');
  });

  test('getUser returns an existing user', () => {
    const user = service.addUser('A', 'a@mail.com');
    expect(service.getUser(user.id)).toEqual(user);
  });

  test('getUser returns null for unknown id', () => {
    expect(service.getUser(999)).toBeNull();
  });

  test('deleteUser removes an existing user', () => {
    const user = service.addUser('A', 'a@mail.com');
    expect(service.deleteUser(user.id)).toBe(true);
    expect(service.getAllUsers()).toHaveLength(0);
  });

  test('deleteUser returns false for unknown id', () => {
    expect(service.deleteUser(999)).toBe(false);
  });
});