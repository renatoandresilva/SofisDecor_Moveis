import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout';

// pages
import Home from './pages/home';
import Sale from './pages/sale';
import Client from './pages/client';
import Controller from './pages/controller';
import Cost from './pages/cost';
import Login from './pages/login/Login';


import Private from './router/Private';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/sale',
        element: <Private>  <Sale />  </Private>
      },
      {
        path: '/client',
        element: <Private>  <Client />  </Private>
      },
      {
        path: '/cost',
        element: <Private>  <Cost />  </Private>
      },
      {
        path: '/controller',
        element: <Private> <Controller />  </Private>
      }
    ]
  }
])

export default router