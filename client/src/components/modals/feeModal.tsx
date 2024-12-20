import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { FeeFormValue, IClassesData, IFeeTypeData } from "../../types/types";
import { feeSchema } from "../../schema/yupSchema";
import { useEffect, useState } from "react";
import Spinner from "../UI/Spinner";
import { getFeeTypes } from "../../api/feeTypeApi";
import { addFee, getFee, updateFee } from "../../api/feeApi";
import { getClasses } from "../../api/classRoomApi";

interface FeeProps {
  visible: boolean;
  onClose: () => void;
  id: string;
}

type FeeType = {
  id: string;
  amount: number;
  classId: string;
  fee_typeId: string;
};

export const FeeModal = ({ visible, onClose, id }: FeeProps) => {
  const [fee, setFee] = useState<FeeType>({
    id: "",
    classId: "",
    fee_typeId: "",
    amount: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<FeeFormValue>({
    resolver: yupResolver(feeSchema),
  });

  // fetching class from server
  const { data: _classes, isSuccess: classIsSuccesss } = useQuery({
    queryKey: ["class"],
    queryFn: getClasses,
  });

  // fetching feeTypes from server
  const { data: feeTypes, isSuccess: feeTypeIsSuccesss } = useQuery({
    queryKey: ["feeType"],
    queryFn: getFeeTypes,
  });

  useEffect(() => {
    if (id && visible) {
      const fetchFee = async () => {
        setIsLoading(true);
        const fee = await getFee(id);

        if (fee?.msg) {
          setFee(fee?.msg);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          onClose();
          toast.error(fee?.message);
        }
      };
      fetchFee();
    }
  }, [visible]);

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful, reset]);

  const { mutate: AddMutate } = useMutation({
    mutationFn: addFee,
    onSuccess: (data) => {
      if (data.message) {
        onClose();
        toast.error(data.message);
      } else if (data.msg) {
        queryClient.invalidateQueries(["fee"]);
        onClose();
        toast.success("successfuly added!");
      } else {
        console.log(data);
      }
    },
  });

  const onSubmitAdd = (data: FeeFormValue) => {
    AddMutate({
      amount: data.amount,
      classId: data.class,
      feeTypeid: data.feeType,
    });
  };

  const { mutate: UpdateMutate } = useMutation({
    mutationFn: updateFee,
    onSuccess: (data) => {
      if (data.message) {
        onClose();
        toast.error(data.message, {});
      } else if (data.msg) {
        queryClient.invalidateQueries(["fee"]);
        onClose();
        toast.success("successfuly updated!");
      } else {
        console.log(data);
      }
    },
  });

  const onSubmitUpdate = () => {
    const { amount, classId, fee_typeId } = fee;
    if (amount && classId && fee_typeId) {
      UpdateMutate({
        id,
        postData: {
          amount,
          classId,
          feeTypeid: fee_typeId,
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
                Update class fee
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
                  <label htmlFor="name">Amount</label>
                  <div className="">
                    <input
                      type="number"
                      className="px-2 py-1 border-b border-black outline-none w-full"
                      value={fee?.amount ? fee.amount : ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFee({ ...fee, amount: +e.target.value });
                      }}
                    />
                    {!fee?.amount && fee?.amount !== 0 && (
                      <p className="text-red-600 text-sm">
                        amount is required field!!
                      </p>
                    )}
                    {fee?.amount < 1 && (
                      <p className="text-red-600 text-sm">
                        amount must be greater than 0
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label>Class</label>
                  <div className="mt-2">
                    <select
                      className="w-full border px-2 py-1 border-black outline-none"
                      value={fee?.classId}
                      onChange={(e) =>
                        setFee({ ...fee, classId: e.target.value })
                      }
                    >
                      <option value="">select class</option>
                      {classIsSuccesss &&
                        _classes?.msg.map(
                          (_class: IClassesData, index: number) => {
                            return (
                              <option value={_class.id} key={index}>
                                {_class.name}
                              </option>
                            );
                          }
                        )}
                    </select>
                    {!fee?.classId && (
                      <p className="text-red-600 text-sm">
                        class is required field!!
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label>FeeTypes</label>
                  <div className="mt-2">
                    <select
                      className="w-full border px-2 py-1 border-black outline-none"
                      value={fee?.fee_typeId}
                      onChange={(e) =>
                        setFee({ ...fee, fee_typeId: e.target.value })
                      }
                    >
                      <option value="">select feeType</option>
                      {feeTypeIsSuccesss &&
                        feeTypes?.msg.map(
                          (feeType: IFeeTypeData, index: number) => {
                            return (
                              <option value={feeType.id} key={index}>
                                {feeType.name}
                              </option>
                            );
                          }
                        )}
                    </select>
                    {!fee?.fee_typeId && (
                      <p className="text-red-600 text-sm">
                        feeType is required field!!
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
                Add new class fee
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
                  <label htmlFor="name">Amount</label>
                  <div className="">
                    <input
                      type="number"
                      className="px-2 py-1 border-b border-black outline-none w-full"
                      placeholder="amount"
                      {...register("amount")}
                    />
                    {errors.amount && (
                      <p className="text-red-600 text-sm">
                        {errors.amount.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label>Class</label>
                  <div className="mt-2">
                    <select
                      className="w-full border px-2 py-1 border-black outline-none"
                      {...register("class")}
                    >
                      <option value="">select class</option>
                      {classIsSuccesss &&
                        _classes?.msg.map(
                          (_class: IClassesData, index: number) => {
                            return (
                              <option value={_class.id} key={index}>
                                {_class.name}
                              </option>
                            );
                          }
                        )}
                    </select>
                    {errors.class && (
                      <p className="text-red-600 text-sm">
                        {errors.class.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label>FeeTypes</label>
                  <div className="mt-2">
                    <select
                      className="w-full border px-2 py-1 border-black outline-none"
                      {...register("feeType")}
                    >
                      <option value="">select feeType</option>
                      {feeTypeIsSuccesss &&
                        feeTypes?.msg.map(
                          (feeType: IFeeTypeData, index: number) => {
                            return (
                              <option value={feeType.id} key={index}>
                                {feeType.name}
                              </option>
                            );
                          }
                        )}
                    </select>
                    {errors.feeType && (
                      <p className="text-red-600 text-sm">
                        {errors.feeType.message}
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
