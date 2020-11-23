export default function ({ $axios, redirect, $cookies}) {
  $axios.onRequest(config => {
    console.log('Making request to ' + config.url)
  })

  const auth = $cookies.get('auth')
  if (auth) {
      $axios.setToken(auth.token, 'Bearer')
      $axios.setHeader('Content-Type', 'application/json')
  }
}
