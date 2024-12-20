import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import {
  IClassesData,
  ITeachersData,
  SectionFormValue,
} from "../../types/types";
import { sectionSchema } from "../../schema/yupSchema";
import { useEffect, useState } from "react";
import { getClasses } from "../../api/classRoomApi";
import Spinner from "../UI/Spinner";
import { addSection, getSection, updateSection } from "../../api/sectionsApi";
import { getTeachers } from "../../api/teachersApi";

interface SectionProps {
  visible: boolean;
  onClose: () => void;
  id: string;
}

interface ISection {
  name: string;
  classId: string;
  teacherId: string;
}

export const SectionModal = ({ visible, onClose, id }: SectionProps) => {
  const [section, setSection] = useState<ISection>({
    name: "",
    classId: "",
    teacherId: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();
  let classContent;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<SectionFormValue>({
    resolver: yupResolver(sectionSchema),
    defaultValues: {
      section: "",
      teacher: "",
    },
  });

  // fetching class from server
  const { data: _classes, isSuccess: classIsSuccess } = useQuery({
    queryKey: ["classes"],
    queryFn: getClasses,
  });
  // console.log(_classes);

  // fetching teachers from server
  const { data: teachers, isSuccess: teachersIsSuccess } = useQuery({
    queryKey: ["teachers"],
    queryFn: getTeachers,
  });

  useEffect(() => {
    if (id && visible) {
      const fetchSection = async () => {
        setIsLoading(true);
        const section = await getSection(id);

        if (section?.msg) {
          setSection(section?.msg);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          onClose();
          toast.error(section?.message);
        }
      };
      fetchSection();
    }
  }, [visible]);

  // mar walba oo aan kiciyo modalka visible true aya laso pass gareynyaa sidas drted ayan visible u galy useefect si uu u kiciyo useeffct una reset greyo data dii kujdihy formka
  useEffect(() => {
    reset();
  }, [isSubmitSuccessful, reset]);

  const { mutate } = useMutation({
    mutationFn: addSection,
    onSuccess: (data) => {
      if (data.message) {
        onClose();
        setTimeout(() => {
          toast.error(data.message);
        }, 5);
      } else if (data.msg) {
        queryClient.invalidateQueries(["sections"]);
        onClose();
        setTimeout(() => {
          toast.success("successfuly added!!");
        }, 5);
      } else {
        console.log(data);
      }
    },
  });

  const onSubmit = (data: SectionFormValue) => {
    mutate({
      classId: data.class,
      name: data.section,
      teacherId: data.teacher,
    });
  };

  const { mutate: UpdateMutate } = useMutation({
    mutationFn: updateSection,
    onSuccess: (data) => {
      if (data.message) {
        onClose();
        toast.error(data.message);
      } else if (data.msg) {
        queryClient.invalidateQueries(["sections"]);
        onClose();
        toast.success("successfuly updated!");
      } else {
        console.log(data);
      }
    },
  });

  const onSubmitUpdate = () => {
    const { name, classId, teacherId } = section;
    if (classId && name && teacherId) {
      UpdateMutate({ id, updateData: { name, classId, teacherId } });
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
                Update Section
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
                  <label>Class</label>
                  <div className="mt-2">
                    <select
                      className="w-full border px-2 py-1 border-black outline-none"
                      value={section.classId}
                      onChange={(e) => {
                        setSection({ ...section, classId: e.target.value });
                      }}
                    >
                      <option value="">select</option>
                      {classIsSuccess &&
                        _classes.msg.map(
                          (_class: IClassesData, index: number) => {
                            return (
                              <option key={index} value={_class.id}>
                                {_class.name}
                              </option>
                            );
                          }
                        )}
                    </select>
                    {!section.classId && (
                      <p className="text-red-600 text-sm">
                        class is required field!!
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label>Teacher</label>
                  <div className="mt-2">
                    <select
                      className="w-full border px-2 py-1 border-black outline-none"
                      value={section.teacherId}
                      onChange={(e) =>
                        setSection({ ...section, teacherId: e.target.value })
                      }
                    >
                      <option value="">select</option>
                      {teachersIsSuccess &&
                        teachers.msg.map(
                          (teacher: ITeachersData, index: number) => {
                            return (
                              <option key={index} value={teacher.id}>
                                {teacher.fullname}
                              </option>
                            );
                          }
                        )}
                    </select>
                    {!section.teacherId && (
                      <p className="text-red-600 text-sm">
                        teacher is required field!!
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label>Section</label>
                  <div>
                    <input
                      type="text"
                      className="px-2 py-1 border-b border-black outline-none w-full"
                      placeholder="section name"
                      value={section.name}
                      onChange={(e) =>
                        setSection({ ...section, name: e.target.value })
                      }
                    />
                    {!section.name && (
                      <p className="text-red-600 text-sm">
                        section name is required field!!
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
                Add new Section
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
                  <label>Class</label>
                  <div className="mt-2">
                    <select
                      className="w-full border px-2 py-1 border-black outline-none"
                      {...register("class")}
                    >
                      <option value="">select</option>
                      {!classContent &&
                        _classes.msg.map(
                          (_class: IClassesData, index: number) => {
                            return (
                              <option key={index} value={_class.id}>
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
                  <label>Teacher</label>
                  <div className="mt-2">
                    <select
                      className="w-full border px-2 py-1 border-black outline-none"
                      {...register("teacher")}
                    >
                      <option value="">select</option>
                      {teachersIsSuccess &&
                        teachers.msg.map(
                          (teacher: ITeachersData, index: number) => {
                            return (
                              <option key={index} value={teacher.id}>
                                {teacher.fullname}
                              </option>
                            );
                          }
                        )}
                    </select>
                    {errors.teacher && (
                      <p className="text-red-600 text-sm">
                        {errors.teacher.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label>Section</label>
                  <div>
                    <input
                      type="text"
                      className="px-2 py-1 border-b border-black outline-none w-full"
                      placeholder="section name"
                      {...register("section")}
                    />
                    {errors.section && (
                      <p className="text-red-600 text-sm">
                        {errors.section.message}
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
