import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import TodoPage from "../pages/TodoPage";
import InfoPage from "../pages/InfoPage";

function Router() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/todos" element={<TodoPage />} />
                <Route path="/info/:id" element={<InfoPage />} />

                <Route path="*" element={<Navigate replace to="/"/>} />
            </Routes>
        </BrowserRouter>

    );
}

export default Router;