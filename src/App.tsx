import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout';

// pages
import Home from './pages/home';
import Sale from './pages/sale';
import Client from './pages/client';
import Controller from './pages/controller';
import Cost from './pages/cost';


const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/sale',
        element: <Sale />
      },
      {
        path: '/client',
        element: <Client />
      },
      {
        path: '/cost',
        element: <Cost />
      },
      {
        path: '/controller',
        element: <Controller />
      }
    ]
  }
])

export default router