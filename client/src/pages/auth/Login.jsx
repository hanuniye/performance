import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { toast, Toaster } from "sonner";
import { useGlobalProvider } from "../../HOOKS/useGlobalProvider";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .test(
      "is-valid-email",
      "Invalid email format. Please include a dot (.) in the domain.",
      (value) => {
        if (!value) return false; // Required validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value); // Returns true for valid, false for invalid
      }
    ),
  password: yup.string().required().trim(),
});

const Login = () => {
  const { setAuth } = useGlobalProvider();

  const navigate = useNavigate();
  const location = useLocation();
  // redirect to the page you want to go after login or '/' first route
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const resp = await axios.post("/auth", JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      const accessToken = resp.data?.accessToken;
      const userData = resp.data?.user;
      const role = resp.data?.user?.role;

      setAuth({ userData, accessToken, role });
      // go to the next page
      navigate(from, { replace: true });
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        toast.error(error.response.data.error);
      } else {
        console.log(error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-5 h-screen">
      <div className="flex flex-col space-y-5 mt-6 shadow-xl p-10 w-[90%] md:w-[40%]">
        <h1 className="text-center text-xl text-blackLight font-bold">Login</h1>
        <div className="space-y-8">
          <div className="top flex flex-col space-y-5">
            {/* fields  */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-5">
                <label htmlFor="Email">Email</label>
                <div className="">
                  <input
                    type="text"
                    className="px-2 py-1 border-b border-black outline-none w-full"
                    placeholder="doe@gmail.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-5">
                <label htmlFor="Password">Password</label>
                <div className="">
                  <input
                    type="password"
                    className="px-2 py-1 border-b border-black outline-none w-full"
                    placeholder="*******"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-red-600 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="bottom flex flex-col items-center space-y-2 mt-5">
                <button
                  type="submit"
                  className="px-12 py-2 rounded-sm bg-teal-600 text-white"
                >
                  Login
                </button>
                {/* <p>
              you have not account{" "}
              <Link to="/singup">
                <strong>Singup</strong>
              </Link>
            </p> */}
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* <button
        onClick={() => {}}
        className="py-2 rounded-sm bg-teal-600 text-white outline-none border-none w-[90%] md:w-[40%]"
      >
        Demo
      </button> */}
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: {
            textTransform: "capitalize",
            // fontSize: "15px",
          },
        }}
      />
    </div>
  );
};

export default Login;
