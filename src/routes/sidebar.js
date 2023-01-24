/** Icons are imported separatly to reduce build time */
import UserCircleIcon from '@heroicons/react/24/outline/UserCircleIcon'
import Wrench from '@heroicons/react/24/outline/WrenchIcon'
import Dolar from '@heroicons/react/24/outline/CurrencyDollarIcon'



const iconClasses = `h-6 w-6`
const submenuIconClasses = `h-5 w-5`

const routes = [
  {
    path: '/app/condominio',
    icon: <UserCircleIcon className={iconClasses}/>, 
    name: 'Condomínio',
  },
  {
    path: '/app/pleitos',
    icon: <Wrench className={iconClasses}/>, 
    name: 'Pleitos',
  },
  // {
  //   path: '/app/mocktoken',
  //   icon: <Dolar className={iconClasses}/>, 
  //   name: 'Mock Token',
  // }
  
]

export default routes
