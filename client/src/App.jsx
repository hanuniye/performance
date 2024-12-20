import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import "./index.css";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Login from "./pages/auth/Login";
// import Singup from "./pages/auth/Singup";
import HRList from "./pages/HR/HRList";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Layout from "./layout/Layout";
import NewHR from "./pages/HR/NewHR";
import UpdateHR from "./pages/HR/UpdateHR";
import ListSupervisor from "./pages/supervisor/ListSuperv";
import NewSupervisor from "./pages/supervisor/NewSuperv";
import UpdateSupervisor from "./pages/supervisor/UpdateSuperv";
import ListEmployee from "./pages/employee/ListEmployee";
import NewEmployee from "./pages/employee/NewEmployee";
import UpdateEmployee from "./pages/employee/UpdateEmployee";

function App() {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* <Route element={<ProtectedRoute />}> */}
            <Route path="/" element={<Home />} />
            <Route path="HR">
              <Route index element={<HRList />} />
              <Route path="new" element={<NewHR />} />
              <Route path=":id" element={<UpdateHR />} />
            </Route>
            <Route path="supervisors">
              <Route index element={<ListSupervisor />} />
              <Route path="new" element={<NewSupervisor />} />
              <Route path=":id" element={<UpdateSupervisor />} />
            </Route>
            <Route path="employees">
              <Route index element={<ListEmployee />} />
              <Route path="new" element={<NewEmployee />} />
              <Route path=":id" element={<UpdateEmployee />} />
            </Route>
            {/* <Route path="/users">
                <Route index element={<List />} />
                <Route path="new" element={<New />} />
                <Route path=":id" element={<Single />} />
              </Route>
              <Route path="/products">
                <Route index element={<ProductList />} />
                <Route path="new" element={<NewProduct />} />
                <Route path=":id" element={<SingleProduct />} />
              </Route> */}
            {/* </Route> */}
          </Route>
          {/* <Route path="/login" element={<Login />} />
          <Route path="/singup" element={<Singup />} /> */}
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
