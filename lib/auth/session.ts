import { getAuth } from "@digitalcrew/auth"
import { headers } from "next/headers"

export async function getServerSession() {
  const auth = getAuth()
  return auth.api.getSession({ headers: await headers() })
}
