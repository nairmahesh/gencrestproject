export function getUserDetails(field: string) {
 if (localStorage.getItem('user')) {
  const user = JSON.parse(localStorage.getItem('user') ?? '{}')
  return user[field]
 }
 return '';
}
export function getAvatarFromName(name: string) {
 if (name.split(' ').length == 1) return name.slice(0, 2)
 else if (name.split(' ').length > 1) return name.split(' ')[0][0] + name.split(' ')[1][0]
 return 'GC'
}