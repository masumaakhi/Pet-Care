import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Adopt from "../pages/Adopt";
import Signup from "../pages/Signup";
import Signin from "../pages/Signin";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { path: '/', index: true, element: <Home /> },
            { path:'/adopt', element:<Adopt />},
            {path: '/register', element: <Signup />},
            {path: '/login', element: <Signin />}
            
           
           
        ]

    },
])