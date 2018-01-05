import urlParse from 'url-parse'
import qs from 'query-string'
import url from 'url'

 function addHrefToken(url, token) {
  let uri = urlParse(url)
  uri.query ? uri.query.token = token : uri.query = {token}
  return uri.toString()
}

let query = qs.parse('')

// let href = addHrefToken('http://localhost/contests/teacher-list/33/true', 'token:d4ff888db5604c45aaa8c6297a130a92-H5-STUDY-NTU1Mjk2OTI=')
console.log(href)