import sa from 'superagent'

const baseUrl = '/api/'

function call (method, path, data) {
  let request = sa(method, baseUrl + path)
    .type('application/json')
    .accept('application/json')

  if (data) {
    request.send(data)
  }

  return request.then(response => {
    return response.body
  })
}

export function getMap (params) {
  return call('POST', '', params)
}
