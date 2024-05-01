import { Route, Routes } from "react-router-dom";
import Home from "../Screens/Home";
import Login from "../Screens/Login";
import Info from "../Screens/Info";

function AllRoutes() {

    return (
        <>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/home' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/info' element={<Info />} />
            </Routes>
        </>
    )
}

export default AllRoutes