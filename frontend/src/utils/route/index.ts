// import loginGuardIsLoggedIn from ''

export default (
  title: string,
  path: string,
  component,
  requiresAuth = false,
  others = undefined
) => {
  return {
    path,
    name: title,
    meta: {title, requiresAuth: requiresAuth},
    component: component,
    // beforeEnter: loginGuardIsLoggedIn,
    ...others
  }
}
