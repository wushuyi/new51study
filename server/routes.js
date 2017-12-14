import nextRoutes from 'next-routes'

const routes = nextRoutes()
export default routes

routes.add('contests/contest-class', '/contests/contest-class/:id')
// routes.add('blog', '/blog/:slug')
// routes.add('about', '/about-us/:foo(bar|baz)')
