import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { IClassFormValue } from "../../types/types";
import { classSchema } from "../../schema/yupSchema";
import { useEffect, useState } from "react";
import { addClass, getClass, updateClass } from "../../api/classRoomApi";
import Spinner from "../UI/Spinner";

interface ClassProps {
  visible: boolean;
  onClose: () => void;
  id: string;
}

export const ClassModal = ({ visible, onClose, id }: ClassProps) => {
  const [_class, setClass] = useState({
    id: "",
    name: "",
    number: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<IClassFormValue>({
    resolver: yupResolver(classSchema),
    defaultValues: {
      className: "",
      classNumeric: "",
    },
  });

  useEffect(() => {
    if (id && visible) {
      const fetchClass = async () => {
        setIsLoading(true);
        const _class = await getClass(id);

        if (_class?.msg) {
          setClass(_class?.msg);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          onClose();
          toast.error(_class?.message);
        }
      };
      fetchClass();
    }
  }, [visible]);

  // mar walba oo aan kiciyo modalka visible true aya laso pass gareynyaa sidas drted ayan visible u galyy si uu u kiciyo useeffct una reset greyo data dii kujdihy formka
  useEffect(() => {
    reset();
  }, [isSubmitSuccessful, reset]);

  const { mutate } = useMutation({
    mutationFn: addClass,
    onSuccess: (data) => {
      if (data.message) {
        onClose();
        toast.error(data.message);
      } else if (data.msg) {
        queryClient.invalidateQueries(["classes"], { exact: true });
        onClose();
        toast.success("successfuly added!");
      } else {
        console.log(data);
      }
    },
  });

  const { mutate: UpdateMutate } = useMutation({
    mutationFn: updateClass,
    onSuccess: (data) => {
      if (data.message) {
        onClose();
        setTimeout(() => {
          toast.error(data.message, {});
        }, 10);
      } else if (data.msg) {
        queryClient.invalidateQueries(["classes"]);
        onClose();
        setTimeout(() => {
          toast.success("successfuly updated!");
        }, 5);
      } else {
        console.log(data);
      }
    },
  });

  const onSubmit = (data: IClassFormValue) => {
    mutate({
      name: data.className,
      number: Number(data.classNumeric),
    });
  };

  const onSubmitUpdate = () => {
    const { number, name } = _class;
    if (number && name) {
      UpdateMutate({ id, postData: { name, number } });
    }
  };

  if (!visible) return null;

  if (id) {
    return isLoading ? (
      <div
        id="static-modal"
        data-modal-backdrop="static"
        tabIndex={-1}
        aria-hidden="false"
        className="overflow-y-auto overflow-x-hidden bg-tr fixed top-0 right-0 left-0 z-50 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative p-4 w-full max-w-xl max-h-full">
          <Spinner />
        </div>
      </div>
    ) : (
      <div
        id="static-modal"
        data-modal-backdrop="static"
        tabIndex={-1}
        aria-hidden="false"
        className="overflow-y-auto overflow-x-hidden bg-tr fixed top-0 right-0 left-0 z-50 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative p-4 w-full max-w-xl max-h-full">
          {/* Modal content */}
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            {/* Modal header  */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Update class
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="static-modal"
                onClick={onClose}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/*  Modal body */}
            <div className="p-4 md:p-5 space-y-4">
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  onSubmitUpdate();
                }}
              >
                <div>
                  <label>Class name</label>
                  <div>
                    <input
                      type="text"
                      className="px-2 py-1 border-b border-black outline-none w-full"
                      placeholder="one"
                      value={_class?.name}
                      onChange={(e) =>
                        setClass({ ..._class, name: e.target.value })
                      }
                    />
                    {!_class?.name && (
                      <p className="text-red-600 text-sm">
                        class name is required
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label>Class in numeric</label>
                  <div>
                    <input
                      type="text"
                      className="px-2 py-1 border-b border-black outline-none w-full"
                      placeholder="1"
                      value={_class?.number}
                      onChange={(e) =>
                        setClass({ ..._class, number: +e.target.value })
                      }
                    />
                    {!_class?.number && (
                      <p className="text-red-600 text-sm">
                        class number is required
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
                    Add
                  </button>
                  <button
                    data-modal-hide="static-modal"
                    type="button"
                    className="ms-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div
        id="static-modal"
        data-modal-backdrop="static"
        tabIndex={-1}
        aria-hidden="false"
        className="overflow-y-auto overflow-x-hidden bg-tr fixed top-0 right-0 left-0 z-50 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative p-4 w-full max-w-xl max-h-full">
          {/* Modal content */}
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            {/* Modal header  */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add new class
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="static-modal"
                onClick={onClose}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/*  Modal body */}
            <div className="p-4 md:p-5 space-y-4">
              <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <label>Class name</label>
                  <div>
                    <input
                      type="text"
                      className="px-2 py-1 border-b border-black outline-none w-full"
                      placeholder="one"
                      {...register("className")}
                    />
                    {errors.className && (
                      <p className="text-red-600 text-sm">
                        {errors.className?.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label>Class in numeric</label>
                  <div>
                    <input
                      type="text"
                      className="px-2 py-1 border-b border-black outline-none w-full"
                      placeholder="1"
                      {...register("classNumeric")}
                    />
                    {errors.classNumeric && (
                      <p className="text-red-600 text-sm">
                        {errors.classNumeric?.message}
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
                    Add
                  </button>
                  <button
                    data-modal-hide="static-modal"
                    type="button"
                    className="ms-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
