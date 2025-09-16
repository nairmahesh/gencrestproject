import { LoginDTO, LoginResponse } from "../types";
import api from "../utils/api";


export async function LoginUser(data: LoginDTO): Promise<LoginResponse | null> {
 return new Promise((resolve) => {
  api.post('/auth/login', data)
  .then(res => resolve(res.data as LoginResponse))
  .catch(error => {
   console.log("error logging in", error)
   resolve(null)
  })
 })
}