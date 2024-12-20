import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { usePrivateAxios } from "../../HOOKS/usePrivateAxios";
import { toast } from "sonner";

const schema = yup.object().shape({
  name: yup.string().trim().required("Name is required"),
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

const NewHR = () => {
  const navigate = useNavigate();
  const Axios = usePrivateAxios();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (value) => {
    try {
      await Axios.post("/HR", JSON.stringify(value), {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success("HR created successfully!");
      navigate("/HR");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error);
      } else {
        console.log(error.message);
      }
    }
  };

  return (
    <div className="px-3">
      <div className="top p-2 text-blackLight text-xl mt-5 shadow-md">
        Create HR
      </div>
      <div className="bottom flex flex-col space-y-4 mt-6  shadow-md p-5 md:flex-row md:justify-center md:space-x-40">
        <div className="right space-y-8">
          {/* fields  */}
          <div className="top w-[400px]">
            <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="name">Name</label>
                <div className="">
                  <input
                    type="text"
                    className="px-2 py-1 border-b border-black outline-none w-full"
                    placeholder="name"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="name">Email</label>
                <div className="">
                  <input
                    type="email"
                    className="px-2 py-1 border-b border-black outline-none w-full"
                    placeholder="Email"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="name">Password</label>
                <div className="">
                  <input
                    type="password"
                    className="px-2 py-1 border-b border-black outline-none w-full"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-red-600 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
              {/*  Modal footer */}
              {/* if you want add border top use this (border-t border-gray-200 rounded-b dark:border-gray-600) */}
              <div className="flex items-center p-4 md:p-5 ">
                <button
                  type="submit"
                  className="ml-[-15px] bg-teal-600 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewHR;
