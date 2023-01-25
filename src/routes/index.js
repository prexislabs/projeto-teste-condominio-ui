// All components mapping with path for internal routes

import { lazy } from 'react'

const Condominio = lazy(() => import('../pages/Condominio'))
const Pleitos = lazy(() => import('../pages/Pleitos'))

const Sindico = lazy(() => import('../pages/Sindico'))
const Morador = lazy(() => import('../pages/Morador'))
const Autorizado = lazy(() => import('../pages/Autorizado'))


const routes = [
  {
    path: '/sindico',
    component: Sindico
  },
  {
    path: '/morador',
    component: Morador
  },
  {
    path: '/autorizado',
    component: Autorizado
  },
]

export default routes
