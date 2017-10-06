
export function save (configs) {
  localStorage.setItem('configs', JSON.stringify(configs))
}

export function load () {
  return JSON.parse(localStorage.getItem('configs') || '[]')
}
