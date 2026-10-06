import { validateLoginInput } from './validators';

describe('validateLoginInput', () => {
  it('rechaza un usuario vacío', () => {
    expect(validateLoginInput('', '1234')).toContain('Completá el usuario y la contraseña.');
  });
  it('rechaza un usuario con espacios solamente', () => {
    expect(validateLoginInput('   ', '1234')).toHaveLength(1);
  });
  it('rechaza una contraseña vacía', () => {
    expect(validateLoginInput('Nico', '')).toHaveLength(1);
  });
  it('rechaza una contraseña con espacios solamente', () => {
    expect(validateLoginInput('Nico', '    ')).toHaveLength(1);
  });
  it('rechaza menos de 4 caracteres al registrarse', () => {
    expect(validateLoginInput('Nico', '123', true)).toEqual([
      'La contraseña debe tener al menos 4 caracteres.',
    ]);
  });
  it('acepta exactamente 4 caracteres al registrarse', () => {
    expect(validateLoginInput('Nico', '1234', true)).toEqual([]);
  });
  it('acepta los campos completos para iniciar sesión', () => {
    expect(validateLoginInput('Nico', '1234')).toEqual([]);
  });
});
