import axios from "axios"

export const loginPost = async (email: string, password: string) => {
  const header = { headers: { "Content-Type": "x-www-form-urlencoded" } }
  const form = new FormData()

  form.append('username', email)
  form.append('password', password)
  
  const res = await axios.post(`http://localhost:8080/user/login`, form, header)
  
  return res.data
}
