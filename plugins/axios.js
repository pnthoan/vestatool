export default function ({ $axios, redirect, $cookies}) {
  $axios.onRequest(config => {
    console.log('Making request to ' + config.url)
  })

  const token = $cookies.get('token')
  console.log("pnthoan" + token)
  $axios.setToken(token, 'Bearer')
  $axios.setHeader('Content-Type', 'application/json')
}
