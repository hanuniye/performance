import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { ExamFormValue } from "../../types/types";
import { examSchema } from "../../schema/yupSchema";
import { useEffect, useState } from "react";
import Spinner from "../UI/Spinner";
import { addExam, getExam, updateExam } from "../../api/examApi";

interface ExamProps {
  visible: boolean;
  onClose: () => void;
  id: string;
}

type Exam = {
  id: string;
  name: string;
  date: Date | null;
};

export const ExamModal = ({ visible, onClose, id }: ExamProps) => {
  const [exam, setExam] = useState<Exam>({
    id: "",
    name: "",
    date: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<ExamFormValue>({
    resolver: yupResolver(examSchema),
  });

  useEffect(() => {
    if (id && visible) {
      const fetchExam = async () => {
        setIsLoading(true);
        const exam = await getExam(id);

        if (exam?.msg) {
          setExam({
            id: exam?.msg?.id,
            name: exam?.msg?.name,
            date: new Date(exam?.msg?.date),
          });
          setIsLoading(false);
        } else {
          setIsLoading(false);
          onClose();
          toast.error(exam?.message);
        }
      };
      fetchExam();
    }
  }, [visible]);

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful, reset, visible]);

  const { mutate: AddMutate } = useMutation({
    mutationFn: addExam,
    onSuccess: (data) => {
      if (data.message) {
        onClose();
        toast.error(data.message);
      } else if (data.msg) {
        queryClient.invalidateQueries(["exams"]);
        onClose();
        toast.success("successfuly added!");
      } else {
        console.log(data);
      }
    },
  });

  const onSubmitAdd = (data: ExamFormValue) => {
    const examDate = new Date(data.date);
    AddMutate({
      date: examDate.toISOString(),
      name: data.name,
    });
  };

  const { mutate: UpdateMutate } = useMutation({
    mutationFn: updateExam,
    onSuccess: (data) => {
      if (data.message) {
        onClose();
        toast.error(data.message, {});
      } else if (data.msg) {
        queryClient.invalidateQueries(["exams"]);
        onClose();
        toast.success("successfuly updated!");
      } else {
        console.log(data);
      }
    },
  });

  const onSubmitUpdate = () => {
    const { date, name } = exam;
    if (name && date) {
      UpdateMutate({
        id,
        postData: {
          name,
          date: date ? date?.toISOString() : "",
        },
      });
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
                Update exam
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
                  <label htmlFor="name">Exam_name</label>
                  <div className="">
                    <input
                      type="text"
                      className="px-2 py-1 border-b border-black outline-none w-full"
                      placeholder="xam name"
                      value={exam?.name}
                      onChange={(e) =>
                        setExam({ ...exam, name: e.target.value })
                      }
                    />
                    {!exam?.name && (
                      <p className="text-red-600 text-sm">
                        exam name field is required!
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="name">Date</label>
                  <div className="">
                    <input
                      type="date"
                      className="px-2 py-1 border-b border-black outline-none w-full"
                      value={
                        exam?.date
                          ? exam?.date?.toISOString().substr(0, 10)
                          : ""
                      }
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        // Parse the input value to a Date object
                        const parsedDate = new Date(e.target.value);
                        setExam({ ...exam, date: parsedDate });
                      }}
                    />
                    {!exam?.date && (
                      <p className="text-red-600 text-sm">
                        date field is required!
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
                    Update
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
                Add new exam
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
              <form className="space-y-3" onSubmit={handleSubmit(onSubmitAdd)}>
                <div>
                  <label htmlFor="name">Exam_name</label>
                  <div className="">
                    <input
                      type="text"
                      className="px-2 py-1 border-b border-black outline-none w-full"
                      placeholder="exam name"
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
                  <label htmlFor="name">Date</label>
                  <div className="">
                    <input
                      type="date"
                      className="px-2 py-1 border-b border-black outline-none w-full"
                      {...register("date")}
                    />
                    {errors.date && (
                      <p className="text-red-600 text-sm">
                        {errors.date.message}
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
