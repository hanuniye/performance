import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import "./index.css";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Login from "./pages/auth/Login";
// import Singup from "./pages/auth/Singup";
import HRList from "./pages/HR/HRList.jsx";
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
import Profile from "./pages/profile/Profile";
import Login from "./pages/auth/Login";
import NewPerformance from "./pages/performance/NewPerf";
import PerformanceReviewsList from "./pages/performance/PerformanceReviewsList";
import PerformanceReviewDetails from "./pages/performance/PerformanceReviewDetails";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoutes from "./components/ProtectedRoute";
import UpdatePerformanceReview from "./pages/performance/UpdatePerformanceReview";

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
            <Route
              element={
                <ProtectedRoutes
                  allowedRoles={["EMPLOYEE", "HR", "SUPERVISOR"]}
                />
              }
            >
              <Route path="/" element={<Home />} />
              <Route path="profile" element={<Profile />} />
              <Route path="performance_reviews">
                <Route index element={<PerformanceReviewsList />} />
                <Route
                  path=":id/details"
                  element={<PerformanceReviewDetails />}
                />
                <Route
                  element={<ProtectedRoutes allowedRoles={["EMPLOYEE"]} />}
                >
                  <Route path="new" element={<NewPerformance />} />
                </Route>
                <Route
                  element={
                    <ProtectedRoutes
                      allowedRoles={["SUPERVISOR", "EMPLOYEE"]}
                    />
                  }
                >
                  <Route
                    path=":id/update"
                    element={<UpdatePerformanceReview />}
                  />
                </Route>
              </Route>
            </Route>
            <Route element={<ProtectedRoutes allowedRoles={["HR"]} />}>
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
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/singup" element={<Singup />} /> */}
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
