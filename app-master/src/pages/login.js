// src/pages/callback.js
import React from "react"
import { login } from "../utils/auth"

const Login = () => {
  login()

  return <p>Loading...</p>
}

export default Login