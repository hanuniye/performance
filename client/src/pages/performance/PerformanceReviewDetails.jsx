import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePrivateAxios } from "../../HOOKS/usePrivateAxios";
import Spinner from "../../components/Spinner";
import { toast } from "sonner";
import { useGlobalProvider } from "../../HOOKS/useGlobalProvider";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Swal from "sweetalert2";
import { useReactToPrint } from "react-to-print";
import "../../index.css";

const PerformanceReviewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const axios = usePrivateAxios();
  const { auth } = useGlobalProvider();
  const componentRef = useRef();

  const startYear = 2024;
  const endYear = 2050;

  const [isMidYearCollapsed, setIsMidYearCollapsed] = useState(true);
  const [isYearEndCollapsed, setIsYearEndCollapsed] = useState(true);

  useEffect(() => {
    const fetchReview = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/performance_review/${id}`);
        setFormData(response.data?.msg);
        console.log(response.data?.msg);
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.error);
        } else {
          console.log(error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchReview();
  }, [id]);

  const handleInputChange = (e, section, index, subIndex, field) => {
    const { name, value } = e.target;
    const updatedReview = { ...formData };

    if (section === "goals") {
      if (subIndex !== undefined) {
        updatedReview.goals[index].quarterlyUpdates[subIndex][field][name] =
          value;
      } else {
        updatedReview.goals[index][name] = value;
      }
    } else {
      updatedReview[name] = value;
    }

    setFormData(updatedReview);
  };

  const handleApprove = async () => {
    try {
      const response = await axios.post(`/performance_review/${id}/approve`);
      toast.success("Performance review approved successfully");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error);
      } else {
        console.log(error);
      }
    }
  };

  const handleReview = async () => {
    try {
      const response = await axios.post(`/performance_review/${id}/in-review`);
      toast.success("Performance is In-Review");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error);
      } else {
        console.log(error);
      }
    }
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Performance Review Details",
    onAfterPrint: () => toast.success("Printed successfully!"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `/performance_review/${id}/`,
        JSON.stringify(formData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Performance_review updated successfully!");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error);
      } else {
        console.log(error.message);
      }
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  const isSupervisor = auth?.role === "SUPERVISOR";
  const isHR = auth?.role === "HR";
  const isEmployee = auth?.role === "EMPLOYEE";

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto mt-5 pb-6 bg-white shadow-md rounded-lg print-container"
      >
        <div ref={componentRef}>
          <div className="w-full h-[130px]">
            <img src="/care5.png" alt="hero" className="w-full h-full" />
          </div>
          <div className="mb-16 mx-6 mt-10">
            <h2 className="text-2xl font-bold mb-2">Performance Review Form</h2>
            <div className="flex items-start gap-2 mb-1">
              <strong className="text-lg">FY:</strong>
              <select
                name="fy"
                value={formData?.fy}
                onChange={handleInputChange}
                className="border rounded p-1"
                disabled={isSupervisor || isHR}
                required
              >
                <option value="">Select FY</option>
                {Array.from({ length: endYear - startYear + 1 }, (_, index) => {
                  const year = startYear + index;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
            <p className="font-medium text-[15px] mb-4">
              Use the worksheet to help you set goals and scale your personal
              and global impact. <span className="text-red-600">Note:</span>{" "}
              Please enter 3-5 goals, with one being a development goal You must
              select one of the four global impact areas shown in the drop-down
              list and at least one core competency for each of your goals.
            </p>
            <div className="flex items-start gap-5 mb-4">
              <div className="left w-1/2">
                <div className="flex items-center gap-2 mb-1">
                  <strong className="text-base">Name:</strong>
                  <input
                    type="text"
                    name="name"
                    value={formData?.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    className="p-1  border rounded w-full  ml-[22px]"
                    disabled={isSupervisor || isHR}
                    required
                  />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <strong className="text-base">Manager:</strong>
                  <input
                    type="text"
                    name="manager"
                    value={formData?.manager}
                    onChange={handleInputChange}
                    placeholder="Manager"
                    className="p-1  border rounded w-full"
                    disabled={isSupervisor || isHR}
                    required
                  />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <strong className="text-base">Location:</strong>
                  <input
                    type="text"
                    name="location"
                    value={formData?.location}
                    onChange={handleInputChange}
                    placeholder="Location"
                    className="p-1 border rounded w-full ml-[2px]"
                    disabled={isSupervisor || isHR}
                    required
                  />
                </div>
              </div>
              <div className="right w-1/2">
                <div className="flex items-center gap-2 mb-1">
                  <strong className="text-base">Title:</strong>
                  <input
                    type="text"
                    name="title"
                    value={formData?.title}
                    onChange={handleInputChange}
                    placeholder="Title"
                    className="p-1 w-full  ml-[59px] border rounded"
                    disabled={isSupervisor || isHR}
                    required
                  />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <strong className="text-base">Department:</strong>
                  <input
                    type="text"
                    name="department"
                    value={formData?.department}
                    onChange={handleInputChange}
                    placeholder="Department"
                    className="p-1 w-full  border rounded"
                    disabled={isSupervisor || isHR}
                    required
                  />
                </div>
              </div>
            </div>

            {formData?.goals?.map((goal, index) => (
              <div key={index} className="mb-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-[#e36f25]">
                    #{index + 1} Goal{" "}
                  </h3>
                  {/* {formData?.goals?.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveGoal(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )} */}
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <strong className="text-base w-[250px]">
                    Global Impact Area:
                  </strong>
                  <select
                    name="globalImpactArea"
                    value={goal?.globalImpactArea || ""}
                    onChange={(e) => handleInputChange(e, "goals", index)}
                    className="p-2 mb-1 border rounded w-full"
                    disabled={isSupervisor || isHR}
                    required
                  >
                    <option value="">Select Global Impact Area</option>
                    <option value="Locally Led">Locally Led</option>
                    <option value="Globally Scaled">Globally Scaled</option>
                    <option value="Foundational">Foundational</option>
                    <option value="Gender Equal">Gender Equal</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <strong className="text-base w-[250px]">
                    Core Competency:
                  </strong>
                  <select
                    name="coreCompetency"
                    value={goal?.coreCompetency || ""}
                    onChange={(e) => handleInputChange(e, "goals", index)}
                    className="w-full p-2 border rounded"
                    disabled={isSupervisor || isHR}
                    required
                  >
                    <option value="">Select Core Competency</option>
                    <option value="Communication">Communication</option>
                    <option value="Delivering Results">
                      Delivering Results
                    </option>
                    <option value="Dynamic Learning Mindset">
                      Dynamic Learning Mindset
                    </option>
                    <option value="Strategic Leadership & Execution">
                      Strategic Leadership & Execution
                    </option>
                    <option value="People Leadership">People Leadership</option>
                    <option value="Relationship Building">
                      Relationship Building
                    </option>
                    <option value="nclusion">nclusion</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <strong className="text-base  w-[250px]">
                    Functional Competency:
                  </strong>
                  <textarea
                    name="functionalCompetency"
                    value={goal?.functionalCompetency || ""}
                    onChange={(e) => handleInputChange(e, "goals", index)}
                    placeholder="Functional Competency"
                    className="w-full p-2 border rounded resize-none"
                    disabled={isSupervisor || isHR}
                    rows="1"
                    style={{ minHeight: "100px" }}
                    required
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                  />
                </div>

                <div className="flex items-start border-[2px] border-black mb-4">
                  <div className="w-1/3 py-1 border-r-[2px] border-blackLight">
                    <label className="block border-b-[2px] border-black px-1 text-xs font-bold">
                      List Key Tasks To Accomplish The Goal
                    </label>
                    <textarea
                      name="keyTasks"
                      value={goal?.keyTasks || ""}
                      onChange={(e) => handleInputChange(e, "goals", index)}
                      className="w-full resize-none pt-1 outline-none px-1"
                      disabled={isSupervisor || isHR}
                      rows="1"
                      style={{ minHeight: "200px" }}
                      required
                      onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = `${e.target.scrollHeight}px`;
                      }}
                    />
                  </div>
                  <div className="w-1/3 py-1 border-x-[2px] border-blackLight">
                    <label className="block border-b-[2px] capitalize border-black px-1 text-xs font-bold">
                      Why is this important to you and your team?
                    </label>
                    <textarea
                      name="whyImportant"
                      value={goal?.whyImportant || ""}
                      onChange={(e) => handleInputChange(e, "goals", index)}
                      className="w-full resize-none pt-1 outline-none px-1"
                      disabled={isSupervisor || isHR}
                      rows="1"
                      style={{ minHeight: "200px" }}
                      required
                      onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = `${e.target.scrollHeight}px`;
                      }}
                    />
                  </div>
                  <div className="w-1/3 py-1 border-l-[2px] border-blackLight">
                    <label className="block border-b-[2px] capitalize border-black px-1 text-xs font-bold">
                      When will you accomplish it?
                    </label>
                    <textarea
                      name="whenAccomplish"
                      value={goal?.whenAccomplish || ""}
                      onChange={(e) => handleInputChange(e, "goals", index)}
                      className="w-full resize-none pt-1 outline-none px-1"
                      disabled={isSupervisor || isHR}
                      rows="1"
                      style={{ minHeight: "200px" }}
                      required
                      onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = `${e.target.scrollHeight}px`;
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-start border-[2px] border-black mb-4 test">
                  <div className="border-r-[2px] border-black">
                    <h5 className="font-bold p-2 bg-gray-400 border-b-[2px] border-black">
                      Employee Updates(Optional)
                    </h5>
                    <textarea
                      name="employeeQ1"
                      value={goal?.employeeQ1 || ""}
                      onChange={(e) => handleInputChange(e, "goals", index)}
                      placeholder="Employee Q1"
                      disabled={isSupervisor || isHR}
                      className="w-full p-2 border-b-[2px] border-black resize-none outline-none"
                      rows="1"
                      style={{ minHeight: "50px" }}
                      required
                      onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = `${e.target.scrollHeight}px`;
                      }}
                    />
                    <textarea
                      name="employeeQ2"
                      value={goal?.employeeQ2 || ""}
                      onChange={(e) => handleInputChange(e, "goals", index)}
                      placeholder="Employee Q2"
                      disabled={isSupervisor || isHR}
                      className="w-full p-2 border-b-[2px] border-black resize-none outline-none"
                      rows="1"
                      style={{ minHeight: "50px" }}
                      required
                      onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = `${e.target.scrollHeight}px`;
                      }}
                    />
                    <textarea
                      name="employeeQ3"
                      value={goal?.employeeQ3 || ""}
                      onChange={(e) => handleInputChange(e, "goals", index)}
                      placeholder="Employee Q3"
                      disabled={isSupervisor || isHR}
                      className="w-full p-2 border-b-[2px] border-black resize-none outline-none"
                      rows="1"
                      style={{ minHeight: "50px" }}
                      required
                      onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = `${e.target.scrollHeight}px`;
                      }}
                    />
                    <textarea
                      name="employeeQ4"
                      value={goal?.employeeQ4 || ""}
                      onChange={(e) => handleInputChange(e, "goals", index)}
                      placeholder="Employee Q4"
                      disabled={isSupervisor || isHR}
                      className="w-full p-2 border resize-none outline-none"
                      rows="1"
                      style={{ minHeight: "50px" }}
                      required
                      onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = `${e.target.scrollHeight}px`;
                      }}
                    />
                  </div>
                  <div>
                    <h5 className="font-bold p-2 bg-gray-400 border-b-[2px] border-black">
                      Manager Updates(Optional)
                    </h5>
                    <textarea
                      name="managerQ1"
                      value={goal?.managerQ1 || ""}
                      onChange={(e) => handleInputChange(e, "goals", index)}
                      placeholder="Manager Q1"
                      disabled={isEmployee || isHR}
                      className="w-full p-2 border-b-[2px] border-black resize-none outline-none"
                      rows="1"
                      style={{ minHeight: "50px" }}
                      required
                      onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = `${e.target.scrollHeight}px`;
                      }}
                    />
                    <textarea
                      name="managerQ2"
                      value={goal?.managerQ2 || ""}
                      onChange={(e) => handleInputChange(e, "goals", index)}
                      placeholder="Manager Q2"
                      disabled={isEmployee || isHR}
                      className="w-full p-2 border-b-[2px] border-black resize-none outline-none"
                      rows="1"
                      style={{ minHeight: "50px" }}
                      required
                      onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = `${e.target.scrollHeight}px`;
                      }}
                    />
                    <textarea
                      name="managerQ3"
                      value={goal?.managerQ3 || ""}
                      onChange={(e) => handleInputChange(e, "goals", index)}
                      placeholder="Manager Q3"
                      disabled={isEmployee || isHR}
                      className="w-full p-2 border-b-[2px] border-black resize-none outline-none"
                      rows="1"
                      style={{ minHeight: "50px" }}
                      required
                      onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = `${e.target.scrollHeight}px`;
                      }}
                    />
                    <textarea
                      name="managerQ4"
                      value={goal?.managerQ4 || ""}
                      onChange={(e) => handleInputChange(e, "goals", index)}
                      placeholder="Manager Q4"
                      disabled={isEmployee || isHR}
                      className="w-full p-2 border rounded resize-none outline-none"
                      rows="1"
                      style={{ minHeight: "50px" }}
                      required
                      onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = `${e.target.scrollHeight}px`;
                      }}
                    />
                  </div>
                </div>
                <p className="font-medium text-[17px] mb-1 mt-8">
                  Use this section to provide feedback and rating for the
                  outcome of the goal.
                </p>
                <div className="flex items-start border-[2px] border-black mb-1">
                  <div className="w-1/2 py-1 border-r-[2px] border-blackLight">
                    <label className="block border-b-[2px] border-black px-1 text-base font-medium">
                      Employee Feedback
                    </label>
                    <textarea
                      name="employeeFeedback"
                      value={goal?.employeeFeedback || ""}
                      onChange={(e) => handleInputChange(e, "goals", index)}
                      className="w-full resize-none pt-1 outline-none px-1"
                      disabled={isSupervisor || isHR}
                      rows="1"
                      style={{ minHeight: "150px" }}
                      onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = `${e.target.scrollHeight}px`;
                      }}
                    />
                  </div>
                  <div className="w-1/2 py-1 border-l-[2px] border-blackLight">
                    <label className="block border-b-[2px] border-black px-1 text-base font-medium">
                      Manager Feedback
                    </label>
                    <textarea
                      name="managerFeedback"
                      value={goal?.managerFeedback || ""}
                      onChange={(e) => handleInputChange(e, "goals", index)}
                      disabled={isEmployee || isHR}
                      className="w-full resize-none pt-1 outline-none px-1"
                      rows="1"
                      style={{ minHeight: "150px" }}
                      onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = `${e.target.scrollHeight}px`;
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-[2px]">
                  <select
                    name="selfRating"
                    value={goal?.selfRating || ""}
                    onChange={(e) => handleInputChange(e, "goals", index)}
                    className="w-full p-2 py-3 mb-4 border-[2px] border-black rounded"
                    disabled={isSupervisor || isHR}
                  >
                    <option value="">Select Self-Rating</option>
                    <option value="Significantly Exceeds Requirements (SER)">
                      Significantly Exceeds Requirements (SER)
                    </option>
                    <option value="Exceeds Requirements (ER)">
                      Exceeds Requirements (ER)
                    </option>
                    <option value="Meets All Requirements (MA)">
                      Meets All Requirements (MA)
                    </option>
                    <option value="Meets Most Requirements (M)">
                      Meets Most Requirements (M)
                    </option>
                    <option value="Below Requirements (BR)">
                      Below Requirements (BR)
                    </option>
                  </select>

                  <div>
                    <select
                      name="managerRating"
                      value={goal?.managerRating || ""}
                      onChange={(e) => handleInputChange(e, "goals", index)}
                      className="w-full p-2 py-3  mb-4 border-[2px] border-black rounded"
                      disabled={isEmployee || isHR}
                    >
                      <option value="">Select Manager Rating</option>
                      <option value="Significantly Exceeds Requirements (SER)">
                        Significantly Exceeds Requirements (SER)
                      </option>
                      <option value="Exceeds Requirements (ER)">
                        Exceeds Requirements (ER)
                      </option>
                      <option value="Meets All Requirements (MA)">
                        Meets All Requirements (MA)
                      </option>
                      <option value="Meets Most Requirements (M)">
                        Meets Most Requirements (M)
                      </option>
                      <option value="Below Requirements (BR)">
                        Below Requirements (BR)
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-10  mx-6">
            <h2
              className="text-xl font-bold mb-4 cursor-pointer text-red-600"
              onClick={() => setIsMidYearCollapsed(!isMidYearCollapsed)}
            >
              Mid-Year Review {isMidYearCollapsed ? "+" : "-"}
            </h2>
            {!isMidYearCollapsed && (
              <div className="flex items-start border-[2px] border-black mb-4">
                <div className="w-1/2 py-1 border-r-[2px] border-blackLight">
                  <label className="block border-b-[2px] border-black px-1 text-base font-medium">
                    Employee Comment
                  </label>
                  <textarea
                    name="mid_employeeComment"
                    disabled={isSupervisor || isHR}
                    value={formData?.mid_employeeComment || ""}
                    onChange={handleInputChange}
                    className="w-full resize-none pt-1 outline-none px-1"
                    rows="1"
                    style={{ minHeight: "200px" }}
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                  />
                </div>
                <div className="w-1/2 py-1 border-l-[2px] border-blackLight">
                  <label className="block border-b-[2px] border-black px-1 text-base font-medium">
                    Manager Comment
                  </label>
                  <textarea
                    name="managerComment"
                    disabled={isEmployee || isHR}
                    value={formData?.managerComment || ""}
                    onChange={handleInputChange}
                    className="w-full resize-none pt-1 outline-none px-1"
                    rows="1"
                    style={{ minHeight: "200px" }}
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mb-6  mx-6 year-end">
            <h2
              className="text-xl font-bold mb-1 cursor-pointer text-red-600"
              onClick={() => setIsYearEndCollapsed(!isYearEndCollapsed)}
            >
              Year-End Assessment {isYearEndCollapsed ? "+" : "-"}
            </h2>

            {!isYearEndCollapsed && (
              <>
                <label className="block text-sm font-bold mb-6">
                  Looking back at this fiscal year, capture the highlights here.
                </label>
                <h2 className="text-xl font-bold mb-4  text-red-600">
                  Self-Assessment
                </h2>
                <div className="flex items-start border-[2px] border-black mb-4">
                  <div className="w-1/2 py-1 border-r-[2px] border-blackLight">
                    <label className="block border-b-[2px] border-black px-1 text-base font-medium">
                      Strengths/Major Accomplishments
                    </label>
                    <textarea
                      name="self_majorAccomplishments"
                      value={formData?.self_majorAccomplishments || ""}
                      onChange={handleInputChange}
                      className="w-full resize-none pt-1 outline-none px-1"
                      rows="1"
                      disabled={isSupervisor || isHR}
                      style={{ minHeight: "200px" }}
                      onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = `${e.target.scrollHeight}px`;
                      }}
                    />
                  </div>
                  <div className="w-1/2 py-1 border-l-[2px] border-blackLight">
                    <label className="block border-b-[2px] border-black px-1 text-base font-medium">
                      Areas for Improvement
                    </label>
                    <textarea
                      name="self_areasForImprovement"
                      value={formData?.self_areasForImprovement || ""}
                      onChange={handleInputChange}
                      className="w-full resize-none pt-1 outline-none px-1"
                      rows="1"
                      style={{ minHeight: "200px" }}
                      disabled={isSupervisor || isHR}
                      onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = `${e.target.scrollHeight}px`;
                      }}
                    />
                  </div>
                </div>

                <h2 className="text-xl font-bold mb-4 text-red-600">
                  Manager Assessment
                </h2>
                <div className="flex items-start border-[2px] border-black mb-4">
                  <div className="w-1/2 py-1 border-r-[2px] border-blackLight">
                    <label className="block border-b-[2px] border-black px-1 text-base font-medium">
                      Strengths/Major Accomplishments
                    </label>
                    <textarea
                      name="manag_majorAccomplishments"
                      value={formData?.manag_majorAccomplishments || ""}
                      onChange={handleInputChange}
                      className="w-full resize-none pt-1 outline-none px-1"
                      rows="1"
                      disabled={isEmployee || isHR}
                      style={{ minHeight: "200px" }}
                      onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = `${e.target.scrollHeight}px`;
                      }}
                    />
                  </div>
                  <div className="w-1/2 py-1 border-l-[2px] border-blackLight">
                    <label className="block border-b-[2px] border-black px-1 text-base font-medium">
                      Areas for Improvement
                    </label>
                    <textarea
                      name="manag_areasForImprovement"
                      value={formData?.manag_areasForImprovement || ""}
                      onChange={handleInputChange}
                      className="w-full resize-none pt-1 outline-none px-1"
                      rows="1"
                      style={{ minHeight: "200px" }}
                      disabled={isEmployee || isHR}
                      onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = `${e.target.scrollHeight}px`;
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <strong className="text-base w-[140px]">
                    Overall Rating:
                  </strong>
                  <select
                    name="overallRating"
                    value={formData?.overallRating || ""}
                    disabled
                    onChange={handleInputChange}
                    className="p-2 mb-1 border rounded w-full"
                  >
                    <option value="">Select Overall Rating</option>
                    <option value="Significantly Exceeds Requirements (SER)">
                      Significantly Exceeds Requirements (SER)
                    </option>
                    <option value="Exceeds Requirements (ER)">
                      Exceeds Requirements (ER)
                    </option>
                    <option value="Meets All Requirements (MA)">
                      Meets All Requirements (MA)
                    </option>
                    <option value="Meets Most Requirements (M)">
                      Meets Most Requirements (M)
                    </option>
                    <option value="Below Requirements (BR)">
                      Below Requirements (BR)
                    </option>
                  </select>
                </div>

                <h2 className="text-xl font-bold mb-4 text-red-600">
                  Sign Off
                </h2>
                <div className="flex items-start gap-5 mb-4">
                  <div className="left w-1/2">
                    <div className="flex items-center gap-2 mb-1">
                      <strong className="text-base">Manager:</strong>
                      <input
                        type="text"
                        name="managerSignature"
                        value={formData?.managerSignature || ""}
                        onChange={handleInputChange}
                        placeholder="Manager Signature"
                        className="p-1  border ml-[6px] rounded w-full "
                        disabled={isEmployee || isHR}
                      />
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <strong className="text-base">Employee:</strong>
                      <input
                        type="text"
                        name="employeeSignature"
                        value={formData?.employeeSignature || ""}
                        onChange={handleInputChange}
                        placeholder="Employee Signature"
                        className="p-1  border rounded w-full"
                        disabled={isSupervisor || isHR}
                      />
                    </div>
                  </div>
                  <div className="right w-1/2">
                    <div className="flex items-center gap-2 mb-1">
                      <strong className="text-base">Date:</strong>
                      <input
                        type="date"
                        name="managerDate"
                        value={
                          formData?.managerDate
                            ? new Date(formData?.managerDate)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        onChange={handleInputChange}
                        placeholder="Date"
                        className="p-1 w-full border rounded"
                        disabled={isEmployee || isHR}
                      />
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <strong className="text-base">Date:</strong>
                      <input
                        type="date"
                        name="employeeDate"
                        value={
                          formData?.employeeDate
                            ? new Date(formData?.employeeDate)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        onChange={handleInputChange}
                        placeholder="Date"
                        className="p-1 w-full  border rounded"
                        disabled={isSupervisor || isHR}
                      />
                    </div>
                  </div>
                </div>
                <label className="block text-base font-medium">
                  Employee Comment
                </label>
                <textarea
                  name="end_employeeComment"
                  value={formData?.end_employeeComment || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 mb-4 border-[2px] border-black rounded resize-none"
                  disabled={isSupervisor || isHR}
                  rows="1"
                  style={{ minHeight: "100px" }}
                  onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                />
              </>
            )}
          </div>
        </div>

        {isHR && formData?.status !== "SUBMITTED" && (
          <div>
            <div className="mt-8 px-6">
              <label className="block text-base font-medium">HR Comment</label>
              <textarea
                name="hrComment"
                value={formData?.hrComment || ""}
                onChange={handleInputChange}
                className="w-full p-2 mb-4 border-[2px] border-black rounded resize-none"
                rows="1"
                style={{ minHeight: "100px" }}
                disabled={isEmployee || isSupervisor}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
              />
            </div>
            <button
              type="submit"
              className="w-[95%] py-2  mx-6 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition duration-300"
            >
              Update
            </button>
          </div>
        )}
        {isSupervisor &&
          formData?.status !== "SUBMITTED" &&
          formData?.hrComment && (
            <div>
              <div className="mt-8 px-6">
                <label className="block text-base font-medium">
                  HR Comment
                </label>
                <textarea
                  name="hrComment"
                  value={formData?.hrComment || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 mb-4 border-[2px] border-black rounded resize-none"
                  rows="1"
                  style={{ minHeight: "100px" }}
                  disabled={isEmployee || isSupervisor}
                  onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                />
              </div>
              <button
                type="submit"
                className="w-[95%] py-2  mx-6 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition duration-300"
              >
                Update
              </button>
            </div>
          )}
        {isSupervisor && formData?.status === "SUBMITTED" && (
          <button
            type="submit"
            className="w-[95%] py-2  mx-6 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition duration-300"
          >
            Update
          </button>
        )}
        {isEmployee && (
          <button
            type="submit"
            className="w-[95%] py-2  mx-6 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition duration-300"
          >
            Update
          </button>
        )}
      </form>

      <div className="flex justify-end mt-8 max-w-4xl mx-auto mb-10">
        {isSupervisor && (
          <button
            onClick={handleApprove}
            className="py-2 px-6 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition duration-300"
          >
            Approve
          </button>
        )}

        {isHR && formData?.status === "APPROVED" && (
          <button
            onClick={handleReview}
            className="ml-4 py-2 px-6 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-300"
          >
            In-Review
          </button>
        )}

        {isHR && (
          <button
            onClick={handlePrint}
            className="ml-4 py-2 px-6 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition duration-300"
          >
            Print
          </button>
        )}
      </div>
    </>
    // <div className="container mx-auto p-6">
    //   <div className="bg-white p-8 rounded-lg shadow-md">
    //     <div ref={componentRef} className="bg-white p-8 rounded-lg shadow-md print-container">
    //       <h2 className="text-2xl font-semibold mb-6 text-center">
    //         Performance Review Details
    //       </h2>
    //       <div className="mb-4 flex items-start justify-between">
    //         <div className="right">
    //           <p className="text-lg mb-2">
    //             <strong>Name:</strong> {review?.employee?.name}
    //           </p>
    //           <p className="text-lg mb-2">
    //             <strong>Title:</strong> {review?.title}
    //           </p>
    //           <p className="text-lg mb-2">
    //             <strong>Manager:</strong> {review?.manager}
    //           </p>
    //           <p className="text-lg mb-2">
    //             <strong>Location:</strong> {review?.location}
    //           </p>
    //         </div>
    //         <div className="left overflow-hidden">
    //           <img src="/care.png" alt="" className="w-[150px] h-[150px]" />
    //         </div>
    //       </div>

    //       <h2 className="text-2xl font-semibold mt-8 mb-6">Goals</h2>
    //       {review?.goals?.map((goal, index) => (
    //         <div key={index} className="mb-20 p-6 border rounded-lg bg-gray-50">
    //           <h3 className="text-xl font-semibold mb-4">Goal {index + 1}</h3>
    //           <p className="text-lg mb-4">
    //             <strong>Global Impact Area:</strong> {goal?.globalImpactArea}
    //           </p>
    //           <p className="text-lg mb-4">
    //             <strong>Core Competency:</strong> {goal?.coreCompetency}
    //           </p>
    //           <p className="text-lg mb-4 whitespace-pre-wrap break-words">
    //             <strong>Functional Competency:</strong>{" "}
    //             {goal?.functionalCompetency}
    //           </p>
    //           <p className="text-lg mb-4 whitespace-pre-wrap break-words">
    //             <strong>Key Tasks:</strong> {goal?.keyTasks}
    //           </p>
    //           <p className="text-lg mb-4 whitespace-pre-wrap break-words">
    //             <strong>Why Important:</strong> {goal?.whyImportant}
    //           </p>
    //           <p className="text-l mb-4">
    //             <strong>When Accomplish:</strong>{" "}
    //             {goal?.whenAccomplish
    //               ? new Date(goal?.whenAccomplish).toLocaleDateString()
    //               : ""}
    //           </p>
    //           <div className="mb-4">
    //             <p className="text-lg mb-2">
    //               <strong>Quarterly Updates:</strong>
    //             </p>
    //             <div className="grid grid-cols-2 gap-4">
    //               <div>
    //                 <h5 className="font-semibold mb-2">Employee Updates</h5>
    //                 <p className="text-lg mb-2">
    //                   <strong>Q1:</strong> {goal.employeeQ1}
    //                 </p>
    //                 <p className="text-lg mb-2">
    //                   <strong>Q2:</strong> {goal.employeeQ2}
    //                 </p>
    //                 <p className="text-lg mb-2">
    //                   <strong>Q3:</strong> {goal.employeeQ3}
    //                 </p>
    //                 <p className="text-lg mb-2">
    //                   <strong>Q4:</strong> {goal.employeeQ4}
    //                 </p>
    //               </div>
    //               <div>
    //                 <h5 className="font-semibold mb-2">Manager Updates</h5>
    //                 <p className="text-lg mb-2">
    //                   <strong>Q1:</strong> {goal.managerQ1}
    //                 </p>
    //                 <p className="text-lg mb-2">
    //                   <strong>Q2:</strong> {goal.managerQ2}
    //                 </p>
    //                 <p className="text-lg mb-2">
    //                   <strong>Q3:</strong> {goal.managerQ3}
    //                 </p>
    //                 <p className="text-lg mb-2">
    //                   <strong>Q4:</strong> {goal.managerQ4}
    //                 </p>
    //               </div>
    //             </div>
    //           </div>
    //           <p className="text-lg mb-4">
    //             <strong>Employee Feedback:</strong> {goal?.employeeFeedback}
    //           </p>
    //           <p className="text-lg mb-4">
    //             <strong>Manager Feedback:</strong> {goal?.managerFeedback}
    //           </p>
    //           <p className="text-lg mb-4">
    //             <strong>Self Rating:</strong> {goal?.selfRating}
    //           </p>
    //           <p className="text-lg mb-4">
    //             <strong>Manager Rating:</strong> {goal?.managerRating}
    //           </p>
    //         </div>
    //       ))}

    //       <h2 className="text-2xl font-semibold mt-8 mb-6">Mid-Year Review</h2>
    //       <div className="mb-4">
    //         <p className="text-lg mb-4">
    //           <strong>Employee Comment:</strong> {review?.employeeComment}
    //         </p>
    //         <p className="text-lg mb-4">
    //           <strong>Manager Comment:</strong> {review?.managerComment}
    //         </p>
    //       </div>

    //       <h2 className="text-2xl font-semibold mt-10 mb-6">
    //         Year-End Assessment
    //       </h2>
    //       <div className="mb-4">
    //         <h2 className="text-xl mb-2 ">
    //           <strong>Self Assessment</strong> {review?.majorAccomplishments}
    //         </h2>
    //         <p className="text-lg mb-4">
    //           <strong>Major Accomplishments:</strong>{" "}
    //           {review?.self_majorAccomplishments}
    //         </p>
    //         <p className="text-lg mb-7">
    //           <strong>Areas for Improvement:</strong>{" "}
    //           {review?.self_areasForImprovement}
    //         </p>
    //         <h2 className="text-xl mb-2 ">
    //           <strong>Manager Assessment</strong> {review?.majorAccomplishments}
    //         </h2>
    //         <p className="text-lg mb-4">
    //           <strong>Major Accomplishments:</strong>{" "}
    //           {review?.manag_majorAccomplishments}
    //         </p>
    //         <p className="text-lg mb-4">
    //           <strong>Areas for Improvement:</strong>{" "}
    //           {review?.manag_areasForImprovement}
    //         </p>
    //         <p className="text-lg mb-4">
    //           <strong>Overall Rating:</strong> {review?.overallRating}
    //         </p>
    //         <p className="text-lg mb-4">
    //           <strong>Manager Signature:</strong> {review?.managerSignature}
    //         </p>
    //         <p className="text-lg mb-4">
    //           <strong>Date:</strong>{" "}
    //           {review?.managerDate
    //             ? new Date(review?.managerDate).toLocaleDateString()
    //             : ""}
    //         </p>
    //         <p className="text-lg mb-4">
    //           <strong>Employee Signature:</strong> {review?.employeeSignature}
    //         </p>
    //         <p className="text-lg mb-4">
    //           <strong>Date:</strong>{" "}
    //           {review?.employeeDate
    //             ? new Date(review?.employeeDate).toLocaleDateString()
    //             : ""}
    //         </p>
    //         <p className="text-lg mb-4">
    //           <strong>Employee Comments:</strong> {review?.employeeComments}
    //         </p>
    //         <p className="text-lg mb-4">
    //           <strong>Status:</strong> {review?.status}
    //         </p>
    //       </div>
    //     </div>

    //     <div className="flex justify-end mt-8">
    //       {isSupervisor && (
    //         <button
    //           onClick={handleApprove}
    //           className="py-2 px-6 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition duration-300"
    //         >
    //           Approve
    //         </button>
    //       )}
    //       {auth?.role !== "HR" && (
    //         <button
    //           onClick={handleUpdate}
    //           className="ml-4 py-2 px-6 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-300"
    //         >
    //           Update
    //         </button>
    //       )}

    //       {auth?.role === "HR" && review?.status === "APPROVED" && (
    //         <button
    //           onClick={handleReview}
    //           className="ml-4 py-2 px-6 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-300"
    //         >
    //           In-Review
    //         </button>
    //       )}

    //       {auth?.role === "HR" && (
    //         <button
    //           onClick={handlePrint}
    //           className="ml-4 py-2 px-6 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition duration-300"
    //         >
    //           Print
    //         </button>
    //       )}
    //     </div>
    //   </div>
    // </div>
  );
};

export default PerformanceReviewDetails;
