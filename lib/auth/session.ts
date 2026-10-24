import { getAuth } from "@digitalcrew/auth"
import { headers } from "next/headers"

export async function getServerSession() {
  // Read the request headers first: during static prerendering this marks the
  // route as dynamic before getAuth() validates the server-only auth env.
  const requestHeaders = await headers()
  const auth = getAuth()
  return auth.api.getSession({ headers: requestHeaders })
}
