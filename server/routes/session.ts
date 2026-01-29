import { Router } from 'express'

export default function sessionRoutes(): Router {
  const router = Router()

  /**
   * Extend the user's session.
   *
   * Called by the session timeout modal when user clicks "Continue".
   * The act of making this request automatically extends the session
   * because express-session is configured with `rolling: true`.
   */
  router.post('/extend', (req, res) => {
    if (!req.session?.principal) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    return res.status(204).send()
  })

  return router
}
