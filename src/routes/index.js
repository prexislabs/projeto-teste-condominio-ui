// All components mapping with path for internal routes

import { lazy } from 'react'

const Condominio = lazy(() => import('../pages/Condominio'))
const Pleitos = lazy(() => import('../pages/Pleitos'))
const Admin = lazy(() => import('../pages/Admin'))


const routes = [
  {
    path: '/condominio',
    component: Condominio
  },
  {
    path: '/pleitos',
    component: Pleitos
  },
]

export default routes
