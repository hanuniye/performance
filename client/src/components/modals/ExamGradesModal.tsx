import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { ExamGradesFormValue, IExamGradesData } from "../../types/types";
import { examGradesSchema } from "../../schema/yupSchema";
import { useEffect, useState } from "react";
import Spinner from "../UI/Spinner";
import {
  addExamGrade,
  getExamGrade,
  updateExamGrade,
} from "../../api/examGradesApi";

interface SessionProps {
  visible: boolean;
  onClose: () => void;
  id: string;
}

export const ExamGradesModal = ({ visible, onClose, id }: SessionProps) => {
  const [examGarde, setExamGarde] = useState<IExamGradesData>({
    _id: "",
    gradeName: "",
    markFrom: 0,
    markUpTo: 0,
    comment: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<ExamGradesFormValue>({
    resolver: yupResolver(examGradesSchema),
  });

  useEffect(() => {
    if (id && visible) {
      const fetchExamGrade = async () => {
        setIsLoading(true);
        const examGrade = await getExamGrade(id);
        setExamGarde(examGrade?.msg);
        setIsLoading(false);
      };
      fetchExamGrade();
    }
  }, [visible]);

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful, reset, visible]);

  const { mutate: AddMutate } = useMutation({
    mutationFn: addExamGrade,
    onSuccess: (data) => {
      if (data.message) {
        onClose();
        setTimeout(() => {
          toast.error(data.message, {});
        }, 10);
      } else if (data.msg) {
        queryClient.invalidateQueries(["examGrades"]);
        onClose();
          toast.success("successfuly added!");
      } else {
        console.log(data);
      }
    },
  });

  const onSubmitAdd = (data: ExamGradesFormValue) => {
    AddMutate({
      gradeName: data.gradeName,
      markFrom: data.markFrom,
      markUpTo: data.markUpTo,
      comment: data.comment,
    });
  };

  const { mutate: UpdateMutate } = useMutation({
    mutationFn: updateExamGrade,
    onSuccess: (data) => {
      if (data.message) {
        onClose();
        setTimeout(() => {
          toast.error(data.message, {});
        }, 10);
      } else if (data.msg) {
        queryClient.invalidateQueries(["examGrades"]);
        onClose();
          toast.success("successfuly updated!");
      } else {
        console.log(data);
      }
    },
  });

  const onSubmitUpdate = () => {
    const { gradeName, comment, markFrom, markUpTo } = examGarde;
    if (gradeName && comment && markFrom && markUpTo) {
      UpdateMutate({ id, postData: { 
        gradeName, comment, markFrom, markUpTo
       } });
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
                Update exam grade
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
                  <label htmlFor="name">Grade_name</label>
                  <div className="">
                    <input
                      type="text"
                      className="px-2 py-1 border-b border-black outline-none w-full"
                      placeholder="Grade_name"
                      value={examGarde.gradeName}
                      onChange={(e) => setExamGarde({...examGarde, gradeName: e.target.value })}
                    />
                    {!examGarde.gradeName && (
                      <p className="text-red-600 text-sm">
                        grade_name field is required!
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="name">MarkFrom</label>
                  <div className="">
                    <input
                      type="number"
                      className="px-2 py-1 border-b border-black outline-none w-full"
                      placeholder="MarkFrom"
                      value={examGarde.markFrom}
                      onChange={(e) => setExamGarde({...examGarde, markFrom: +e.target.value })}
                    />
                    {!examGarde.markFrom && (
                      <p className="text-red-600 text-sm">
                        markFrom field is required!
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="name">MarkUpTo</label>
                  <div className="">
                    <input
                      type="number"
                      className="px-2 py-1 border-b border-black outline-none w-full"
                      placeholder="MarkUpTo"
                      value={examGarde.markUpTo}
                      onChange={(e) => setExamGarde({...examGarde, markUpTo: +e.target.value })}
                    />
                    {!examGarde.markUpTo && (
                      <p className="text-red-600 text-sm">
                        MarkUpTo field is required!
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="name">Comment</label>
                  <div className="">
                    <input
                      type="text"
                      className="px-2 py-1 border-b border-black outline-none w-full"
                      placeholder="comment"
                      value={examGarde.comment}
                      onChange={(e) => setExamGarde({...examGarde, comment: e.target.value })}
                    />
                    {!examGarde.comment && (
                      <p className="text-red-600 text-sm">
                        comment field is required!
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
                Add new exam grade
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
                  <label htmlFor="name">Grade_name</label>
                  <div className="">
                    <input
                      type="text"
                      className="px-2 py-1 border-b border-black outline-none w-full"
                      placeholder="Grade_name"
                      {...register("gradeName")}
                    />
                    {errors.gradeName && (
                      <p className="text-red-600 text-sm">
                        {errors.gradeName.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="name">MarkFrom</label>
                  <div className="">
                    <input
                      type="text"
                      className="px-2 py-1 border-b border-black outline-none w-full"
                      placeholder="MarkFrom"
                      {...register("markFrom")}
                    />
                    {errors.markFrom && (
                      <p className="text-red-600 text-sm">
                        {errors.markFrom.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="name">MarkUpTo</label>
                  <div className="">
                    <input
                      type="text"
                      className="px-2 py-1 border-b border-black outline-none w-full"
                      placeholder="MarkUpTo"
                      {...register("markUpTo")}
                    />
                    {errors.markUpTo && (
                      <p className="text-red-600 text-sm">
                        {errors.markUpTo.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="name">Comment</label>
                  <div className="">
                    <input
                      type="text"
                      className="px-2 py-1 border-b border-black outline-none w-full"
                      placeholder="comment"
                      {...register("comment")}
                    />
                    {errors.comment && (
                      <p className="text-red-600 text-sm">
                        {errors.comment.message}
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
