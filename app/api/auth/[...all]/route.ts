import { getAuth } from "@digitalcrew/auth"
import { routeHandlers } from "@digitalcrew/auth/http"

export const { GET, POST } = routeHandlers({
  handler: (request) => getAuth().handler(request),
})
