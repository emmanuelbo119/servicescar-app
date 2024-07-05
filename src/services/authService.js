export const login = async (email, password) => {
  const res = await fetch("http://localhost:8000/auth/login", {
      method: "POST",
      headers: { "accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
  });

  if (res.status === 200) {
      const data = await res.json();
      localStorage.setItem('user', data.access_token);
      localStorage.setItem('uuidUsuario', data.uuidUsuario);
      return data.access_token;
  } else {
      throw new Error('Unauthorized');
  }
};

export const logout = () => {
  localStorage.removeItem('user');
};
