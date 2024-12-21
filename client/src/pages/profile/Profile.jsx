import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { usePrivateAxios } from "../../HOOKS/usePrivateAxios";
import { toast } from "sonner";
import { useGlobalProvider } from "../../HOOKS/useGlobalProvider";
import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner"

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
  password: yup.string().trim(),
});

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const Axios = usePrivateAxios();
  const { auth } = useGlobalProvider();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const getUsers = async (id) => {
      setIsLoading(true);
      try {
        const { data } = await Axios.get(`/profile/${id}`);
        reset({
          name: data?.msg.name,
          email: data?.msg.email,
        });
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.error);
        } else {
          console.log(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    getUsers(auth?.userData?.id);
  }, []);

  const onSubmit = async (data) => {
    try {
      await Axios.patch(
        `/profile/${auth?.userData?.id}`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("User updated successfully!");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error);
      } else {
        console.log(error.message);
      }
    } finally {
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="px-3">
        <div className="top p-2 text-blackLight text-lg mt-5 shadow-md">
          Update User Information
        </div>
        <div className="bottom flex flex-col space-y-4 mt-6 shadow-md p-5 md:flex-row md:justify-center md:space-x-28 md:px-10">
          <div className="left w-[400px]">
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
              <div className="flex items-center p-4 md:p-5 ">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="ml-[-15px] bg-teal-600 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
