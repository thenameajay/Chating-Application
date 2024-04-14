import { Route, Routes } from "react-router-dom";
import Home from "../Screens/Home";

function AllRoutes() {

    return (
        <>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/home' element={<Home />} />
            </Routes>
        </>
    )
}

export default AllRoutes