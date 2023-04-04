import Vue from 'vue'
import VueRouter from 'vue-router'
import Users from '../views/Users'
import Start from '../views/Start'
import SignIn from '../views/SignIn'
import SignUp from '../views/SignUp'
import Profile from '../views/Profile'
import TransportType from '../views/TransportType'
import Cars from '../views/Cars'
import CarCreate from '../views/CarCreate'
import Order from '../views/Order'
import Counter from '../views/Counter'
import OrderCreate from '../views/OrderCreate'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'SignIn',
    component: SignIn
  },
  {
    path: '/types',
    name: 'Types',
    component: TransportType
  },
  {
    path: '/cars/:id',
    name: 'Car',
    component: Cars
  },
  {
    path: '/carsCreate/:id',
    name: 'CarCreate',
    component: CarCreate
  },
  {
    path: '/users/:super',
    name: 'User',
    component: Users
  },
  {
    path: '/start/',
    name: 'Start',
    component: Start
  },
  {
    path: '/signin/',
    name: 'SignIn',
    component: SignIn
  },
  {
    path: '/signup/',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/profile/',
    name: 'profile',
    component: Profile
  },
  {
    path: '/orders/',
    name: 'orders',
    component: Order
  },
  {
    path: '/filter/',
    name: 'counter',
    component: Counter
  },
  {
    path: '/orderCreate/:car/:date',
    name: 'createOrder',
    component: OrderCreate
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
