export function save (config) {
  let configs = JSON.parse(localStorage.getItem('configs') || '[]')
  configs.push(config)
  localStorage.setItem('configs', JSON.stringify(configs))
}

export function load () {
  return JSON.parse(localStorage.getItem('configs') || '[]')
}
