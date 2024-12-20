import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { FeePaymentFormValue } from "../../types/types";
import { feePaymentSchema } from "../../schema/yupSchema";
import { useEffect, useState } from "react";
import Spinner from "../UI/Spinner";
import {
  getSinglePayment,
  TakeFeePayment,
  updateFeePayment,
} from "@/api/feePaymentApi";

interface FeePaymentProps {
  visible: boolean;
  onClose: () => void;
  fetchStdFeePayment: () => void;
  dueAmount: number;
  id: string;
  value: {
    classId: string;
    sectionId: string;
    sessionId: string;
    stdId: string;
    fee_typeId: string;
  };
}

type FeePayment = {
  id: string;
  amount_paid: number;
  discount: number;
  month_paid: string;
};

export const FeePaymentModal = ({
  visible,
  onClose,
  id,
  value,
  fetchStdFeePayment,
  dueAmount,
}: FeePaymentProps) => {
  const [payment, setPayment] = useState<FeePayment>({
    id: "",
    amount_paid: 0,
    discount: 0,
    month_paid: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const months = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<FeePaymentFormValue>({
    resolver: yupResolver(feePaymentSchema),
  });


  useEffect(() => {
    if (id && visible) {
      const fetchSinglePayemnt = async () => {
        setIsLoading(true);
        const payment = await getSinglePayment(id);

        if (payment?.msg) {
          setPayment(payment?.msg);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          onClose();
          toast.error(payment?.message);
        }
      };
      fetchSinglePayemnt();
    }
  }, [visible]);

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful, reset]);

  const { mutate: AddMutate } = useMutation({
    mutationFn: TakeFeePayment,
    onSuccess: (data) => {
      if (data.message) {
        onClose();
        toast.error(data.message);
      } else if (data.msg) {
        fetchStdFeePayment();
        onClose();
        toast.success("successfuly added!");
      } else {
        console.log(data);
      }
    },
  });

  const onSubmitAdd = (data: FeePaymentFormValue) => {
    AddMutate({
      amount_paid: data.amount,
      discount: data.discount ? +data.discount : 0,
      classId: value.classId,
      feeTypeid: value.fee_typeId,
      sectionId: value.sectionId,
      sessionId: value.sessionId,
      stdId: value.stdId,
      month_paid: data.month ? data.month : "",
    });
  };

  const { mutate: UpdateMutate } = useMutation({
    mutationFn: updateFeePayment,
    onSuccess: (data) => {
      if (data.message) {
        onClose();
        toast.error(data.message);
      } else if (data.msg) {
        fetchStdFeePayment();
        onClose();
        toast.success("successfuly updated!");
      } else {
        console.log(data);
      }
    },
  });

  const onSubmitUpdate = () => {
    const { amount_paid, discount, month_paid } = payment;
    if (amount_paid && month_paid) {
      UpdateMutate({
        id,
        postData: {
          amount_paid,
          discount,
          month_paid,
          feeTypeid: value.fee_typeId,
          classId: value.classId,
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
                  <label htmlFor="name">Due_Amount</label>
                  <div className="">
                    <input
                      type="number"
                      className="px-2 py-1 border-b border-black outline-none w-full"
                      value={dueAmount}
                      disabled
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="name">Pay_Amount</label>
                  <div className="">
                    <input
                      type="number"
                      className="px-2 py-1 border-b border-black outline-none w-full"
                      value={payment?.amount_paid ? payment.amount_paid : ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setPayment({
                          ...payment,
                          amount_paid: +e.target.value,
                        });
                      }}
                    />
                    {!payment?.amount_paid && (
                      <p className="text-red-600 text-sm">
                        amount_paid is required field!!
                      </p>
                    )}
                    
                  </div>
                </div>

                <div>
                  <label htmlFor="name">Discount</label>
                  <div className="">
                    <input
                      type="number"
                      className="px-2 py-1 border-b border-black outline-none w-full"
                      value={payment?.discount}
                      onChange={(e) =>
                        setPayment({ ...payment, discount: +e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label>Month</label>
                  <div className="mt-2">
                    <select
                      className="w-full border px-2 py-1 border-black outline-none"
                      placeholder="month"
                      value={payment?.month_paid}
                      onChange={(e) =>
                        setPayment({ ...payment, month_paid: e.target.value })
                      }
                    >
                      <option value="">select month</option>
                      {months?.map((month: string, index: number) => {
                        return (
                          <option value={month} key={index}>
                            {month}
                          </option>
                        );
                      })}
                    </select>
                    {!payment?.month_paid && (
                      <p className="text-red-600 text-sm">
                        month is required field!!
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
                Take a fee payment
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
                  <label htmlFor="name">Due_Amount</label>
                  <div className="">
                    <input
                      type="number"
                      className="px-2 py-1 border-b border-black outline-none w-full"
                      value={dueAmount}
                      disabled
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="name">Pay_Amount</label>
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
                  <label htmlFor="name">Discount</label>
                  <div className="">
                    <input
                      type="number"
                      className="px-2 py-1 border-b border-black outline-none w-full"
                      placeholder="discount"
                      {...register("discount")}
                    />
                    {errors.discount && (
                      <p className="text-red-600 text-sm">
                        {errors.discount.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label>Month</label>
                  <div className="mt-2">
                    <select
                      className="w-full border px-2 py-1 border-black outline-none"
                      placeholder="month"
                      {...register("month")}
                    >
                      <option value="">select month</option>
                      {months?.map((month: string, index: number) => {
                        return (
                          <option value={month} key={index}>
                            {month}
                          </option>
                        );
                      })}
                    </select>
                    {errors.month && (
                      <p className="text-red-600 text-sm">
                        {errors.month.message}
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
