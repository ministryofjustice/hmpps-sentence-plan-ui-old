import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import { formatDate, pagination } from '../utils/utils'

export default function searchRoutes(router: Router, service: Services): Router {
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  post('/search', async function submitQuery(req, res) {
    const { search } = req.body
    if (search == null || search.length === 0) {
      res.render('pages/search', { errorMessage: { text: 'Please enter a search term' } })
    } else {
      res.redirect(`/search?q=${req.body.search}`)
    }
  })

  get('/search', async function loadResults(req, res) {
    const query = req.query.q as string
    if (query != null) {
      const currentPage = req.query.page ? Number.parseInt(req.query.page as string, 10) : 1
      const results = await service.probationSearchClient.search(query, currentPage, res.locals.user.username)
      res.locals.query = query
      res.locals.headers = [{ text: 'Name' }, { text: 'CRN' }, { text: 'Date of Birth' }]
      res.locals.results = results.content?.map(result => [
        { html: `<a href='/case/${result.otherIds.crn}'>${result.firstName} ${result.surname}</a>` },
        { text: result.otherIds.crn },
        { text: formatDate(result.dateOfBirth) },
      ])
      res.locals.page = pagination(
        currentPage,
        results.totalPages,
        results.totalElements,
        page => `/search?q=${query}&page=${page}`,
      )
    }
    res.render('pages/search')
  })

  return router
}
