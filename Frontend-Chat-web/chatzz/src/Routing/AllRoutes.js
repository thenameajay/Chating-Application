import { Route, Routes } from "react-router-dom";
import Home from "../Screens/Home";
import Login from "../Screens/Login";

function AllRoutes() {

    return (
        <>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/home' element={<Home />} />
                <Route path='/login' element={<Login />} />
            </Routes>
        </>
    )
}

export default AllRoutes