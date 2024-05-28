
export const login = async (email, password) => {
    let res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {"accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({email , password})
      })
      if (res.status === 200){
        res= await res.json();
        localStorage.setItem('user', res.access_token);
        localStorage.setItem('uuidUsuario', res.uuidUsuario);
        return res.access_token;
      }
    return "no entro200";
};



export const logout = () => {
    localStorage.removeItem('user');
};
