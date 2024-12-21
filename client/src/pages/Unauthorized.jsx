import React from "react";
import CustomButton from "../components/Buttons/CustomButton";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  // navigate(-1) means back to the location you are from
  const goBack = () => navigate(-1);

  return (
    <div className="flex flex-col items-center justify-center space-y-5 h-screen">
      <div className="flex flex-col justify-center items-center space-y-5 mt-3 shadow-xl p-10 w-[90%] md:w-[40%]">
        <h1 className="text-center text-xl text-blackLight font-semibold">
          Unauthorized
        </h1>
        <p className="capitalize text-blackLight font-bold">
          You do not have permission of this page
        </p>
        <button
          type="button"
          onClick={goBack}
          className="ml-[-15px] bg-teal-600 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center "
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
