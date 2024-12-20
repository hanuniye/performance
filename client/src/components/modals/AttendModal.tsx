import { useMutation } from "@tanstack/react-query";
import {
  getStdAttendancesByAttendId,
  updateAttendance,
} from "../../api/attendanceApi";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import Spinner from "../UI/Spinner";

interface AttendProps {
  visible: boolean;
  onClose: () => void;
  id: string;
  fetchStdAttendReport: () => void;
}

const AttendModal = ({
  visible,
  onClose,
  id,
  fetchStdAttendReport,
}: AttendProps) => {
  const [attendance, setAttendance] = useState({
    status: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (visible) {
      const fetchAttendance = async () => {
        setIsLoading(true);
        const attendance = await getStdAttendancesByAttendId(id);

        if (attendance?.msg) {
          setAttendance({
            status: attendance?.msg.status ? "1" : "0",
          });
          setIsLoading(false);
        } else {
          setIsLoading(false);
          onClose();
          toast.error(attendance?.message);
        }
      };
      fetchAttendance();
    }
  }, [visible]);

  const { mutate } = useMutation({
    mutationFn: updateAttendance,
    onSuccess: (data) => {
      if (data.message) {
        onClose();
        toast.error(data.message);
      } else if (data.msg) {
        fetchStdAttendReport();
        onClose();
        setTimeout(() => {
          toast.success("successfuly updated!");
        }, 5);
      } else {
        console.log(data);
      }
    },
  });

  const onSubmit = () => {
    const { status } = attendance;
    const currentStatus = status === "1" ? true : false;
    if (status) {
      mutate({
        id: id,
        postData: {
          status: currentStatus,
        },
      });
    }
  };

  if (!visible) return null;

  return (
    <>
      {isLoading ? (
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
                  Update student attendance
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
                    onSubmit();
                  }}
                >
                  <div>
                    <label>Status</label>
                    <div className="mt-2">
                      <select
                        value={attendance.status}
                        className="w-full border px-2 py-1 border-black outline-none"
                        onChange={(e) =>
                          setAttendance({ status: e.target.value })
                        }
                      >
                        <option value="">select</option>
                        <option value="0">absent</option>
                        <option value="1">present</option>
                      </select>
                      {!attendance.status && (
                        <p className="text-red-600 text-sm">
                          status is required field!!
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
      )}
    </>
  );
};

export default AttendModal;
