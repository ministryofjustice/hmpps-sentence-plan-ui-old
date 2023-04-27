import { RequestHandler } from 'express'
import { pagination } from '../utils/utils'
import ProbationSearchClient from '../data/probationSearchClient'

export default class SearchController {
  constructor(private readonly probationSearchClient: ProbationSearchClient) {}

  submitQuery: RequestHandler = async (req, res) => {
    const { search } = req.body
    if (search == null || search.length === 0) {
      res.render('pages/search', { errorMessage: { text: 'Please enter a search term' } })
    } else {
      res.redirect(`/search?q=${req.body.search}`)
    }
  }

  loadResults: RequestHandler = async (req, res) => {
    const query = req.query.q as string
    if (query != null) {
      const currentPage = req.query.page ? Number.parseInt(req.query.page as string, 10) : 1
      const results = await this.probationSearchClient.search(query, currentPage, res.locals.user.username)
      res.locals.query = query
      res.locals.headers = [{ text: 'Name' }, { text: 'CRN' }, { text: 'Date of Birth' }]
      res.locals.results = results.content?.map(result => [
        { html: `<a href='/sentence-plans/${result.otherIds.crn}'>${result.firstName} ${result.surname}</a>` },
        { text: result.otherIds.crn },
        { text: result.dateOfBirth },
      ])
      res.locals.page = pagination(
        currentPage,
        results.totalPages,
        results.totalElements,
        page => `/search?q=${query}&page=${page}`,
      )
    }
    res.render('pages/search')
  }
}
