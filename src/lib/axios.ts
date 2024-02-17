import axios from 'axios'
import { getSession } from 'next-auth/react'

export const api = axios.create({
  baseURL: process.env.API_URL,
})

api.interceptors.request.use(async (request) => {
  const session = await getSession()
  if (session) {
    request.headers.Authorization = `Bearer ${session.user.token}`
  }
  return request
})

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.log(`error`, error)
  },
)
