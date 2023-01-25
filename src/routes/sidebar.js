/** Icons are imported separatly to reduce build time */
import UserCircleIcon from '@heroicons/react/24/outline/UserCircleIcon'
import Wrench from '@heroicons/react/24/outline/WrenchIcon'
import Dolar from '@heroicons/react/24/outline/CurrencyDollarIcon'
import Home from '@heroicons/react/24/outline/HomeIcon'



const iconClasses = `h-6 w-6`
const submenuIconClasses = `h-5 w-5`

const routes = [
  {
    path: '/app/sindico',
    icon: <img width={25} src='https://cdn-icons-png.flaticon.com/512/2672/2672267.png'/>, 
    name: 'Sindico',
  },
  {
    path: '/app/morador',
    icon: <img width={25} src="https://cdn-icons-png.flaticon.com/512/4539/4539212.png"/>, 
    name: 'Morador',
  },
  {
    path: '/app/autorizado',
    icon: <img width={25} src="https://cdn-icons-png.flaticon.com/512/6214/6214954.png"/>, 
    name: 'Autorizado',
  },
  // {
  //   path: '/app/mocktoken',
  //   icon: <Dolar className={iconClasses}/>, 
  //   name: 'Mock Token',
  // }
  
]

export default routes
