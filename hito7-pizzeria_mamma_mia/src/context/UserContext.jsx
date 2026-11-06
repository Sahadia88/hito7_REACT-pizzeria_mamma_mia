import { createContext, useState } from "react";

// 1. Crear el contexto
// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext();

// 2. Proveer el contexto: guarda el token (simulado) y las funciones que lo cambian.
const UserProvider = ({ children }) => {
  // Por defecto el token está en true (el usuario parte con la sesión iniciada)
  const [token, setToken] = useState(true);

  // Cierra la sesión: el token pasa a false
  const logout = () => setToken(false);

  // Inicia la sesión: el token vuelve a true (lo usa el formulario de Login)
  const login = () => setToken(true);

  return (
    <UserContext.Provider value={{ token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
