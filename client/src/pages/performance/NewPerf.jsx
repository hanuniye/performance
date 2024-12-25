import React, { useState } from "react";
import { useGlobalProvider } from "../../HOOKS/useGlobalProvider";
import { usePrivateAxios } from "../../HOOKS/usePrivateAxios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const PerformanceReviewForm = ({}) => {
  const { auth } = useGlobalProvider();
  const [formData, setFormData] = useState({
    employeeId: auth?.userData?.id,
    name: "",
    title: "",
    manager: "",
    location: "",
    department: "",
    fy: "",
    goals: [
      {
        globalImpactArea: "",
        coreCompetency: "",
        functionalCompetency: "",
        keyTasks: "",
        whyImportant: "",
        whenAccomplish: "",
        quarterlyUpdates: [
          {
            employeeUpdates: { q1: "", q2: "", q3: "", q4: "" },
            // managerUpdates: { q1: "", q2: "", q3: "", q4: "" },
          },
        ],
        employeeFeedback: "",
        managerFeedback: "",
        selfRating: "",
        managerRating: "",
      },
    ],

    // employeeComment: "",
    // managerComment: "",
    // self_majorAccomplishments: "",
    // self_areasForImprovement: "",
    // maneg_majorAccomplishments: "",
    // maneg_areasForImprovement: "",
    // overallRating: "",
    // managerSignature: "",
    // managerDate: "",
    // employeeDate: "",
    // employeeSignature: "",
    // employeeComments: "",
  });
  const Axios = usePrivateAxios();
  const navigate = useNavigate();

  const [isMidYearCollapsed, setIsMidYearCollapsed] = useState(true);
  const [isYearEndCollapsed, setIsYearEndCollapsed] = useState(true);

  const startYear = 2024;
  const endYear = 2050;

  const handleAddGoal = () => {
    setFormData({
      ...formData,
      goals: [
        ...formData.goals,
        {
          globalImpactArea: "",
          coreCompetency: "",
          functionalCompetency: "",
          keyTasks: "",
          whyImportant: "",
          whenAccomplish: "",
          quarterlyUpdates: [
            {
              employeeUpdates: { q1: "", q2: "", q3: "", q4: "" },
              managerUpdates: { q1: "", q2: "", q3: "", q4: "" },
            },
          ],
          employeeFeedback: "",
          managerFeedback: "",
          selfRating: "",
          managerRating: "",
        },
      ],
    });
  };

  const handleRemoveGoal = (index) => {
    const updatedGoals = formData.goals.filter((_, i) => i !== index);
    setFormData({ ...formData, goals: updatedGoals });
  };

  const handleInputChange = (e, section, index, subIndex, field) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData };

    if (section === "goals") {
      if (subIndex !== undefined) {
        updatedFormData.goals[index].quarterlyUpdates[subIndex][field][name] =
          value;
      } else {
        updatedFormData.goals[index][name] = value;
      }
    } else {
      updatedFormData[name] = value;
    }

    setFormData(updatedFormData);
  };

  const onSubmit = async (e) => {
    console.log(formData);
    e.preventDefault();
    try {
      await Axios.post("/performance_review", JSON.stringify(formData), {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success("Performance_review created successfully!");
      navigate("/performance_reviews");
    } catch (error) {
      if (error.response) {
        // console.log(error.response.data.error);
        toast.error(error.response.data.error);
      } else {
        console.log(error.message);
      }
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-4xl mx-auto mt-5 pb-6 bg-white shadow-md rounded-lg"
    >
      <div className="w-full h-[130px]">
        <img src="/care5.png" alt="hero" className="w-full h-full" />
      </div>
      <div className="mb-16 mx-6 mt-10">
        <h2 className="text-2xl font-bold mb-2">Performance Review Form</h2>
        <div className="flex items-start gap-2 mb-1">
          <strong className="text-lg">FY:</strong>
          <select
            name="fy"
            value={formData.fy}
            onChange={handleInputChange}
            className="border rounded p-1"
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
          Use the worksheet to help you set goals and scale your personal and
          global impact. <span className="text-red-600">Note:</span> Please
          enter 3-5 goals, with one being a development goal You must select one
          of the four global impact areas shown in the drop-down list and at
          least one core competency for each of your goals.
        </p>
        <div className="flex items-start gap-5 mb-4">
          <div className="left w-1/2">
            <div className="flex items-center gap-2 mb-1">
              <strong className="text-base">Name:</strong>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
                className="p-1  border rounded w-full  ml-[22px]"
                required
              />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <strong className="text-base">Manager:</strong>
              <input
                type="text"
                name="manager"
                value={formData.manager}
                onChange={handleInputChange}
                placeholder="Manager"
                className="p-1  border rounded w-full"
                required
              />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <strong className="text-base">Location:</strong>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Location"
                className="p-1 border rounded w-full ml-[2px]"
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
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Title"
                className="p-1 w-full  ml-[59px] border rounded"
                required
              />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <strong className="text-base">Department:</strong>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="Department"
                className="p-1 w-full  border rounded"
                required
              />
            </div>
          </div>
        </div>

        {formData.goals.map((goal, index) => (
          <div key={index} className="mb-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-[#e36f25]">
                #{index + 1} Goal{" "}
              </h3>
              {formData?.goals?.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveGoal(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 mb-1">
              <strong className="text-base w-[250px]">
                Global Impact Area:
              </strong>
              <select
                name="globalImpactArea"
                value={goal.globalImpactArea}
                onChange={(e) => handleInputChange(e, "goals", index)}
                className="p-2 mb-1 border rounded w-full"
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
              <strong className="text-base w-[250px]">Core Competency:</strong>
              <select
                name="coreCompetency"
                value={goal.coreCompetency}
                onChange={(e) => handleInputChange(e, "goals", index)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Core Competency</option>
                <option value="Communication">Communication</option>
                <option value="Delivering Results">Delivering Results</option>
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
                value={goal.functionalCompetency}
                onChange={(e) => handleInputChange(e, "goals", index)}
                placeholder="Functional Competency"
                className="w-full p-2 border rounded resize-none"
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
                  value={goal.keyTasks}
                  onChange={(e) => handleInputChange(e, "goals", index)}
                  className="w-full resize-none pt-1 outline-none px-1"
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
                  value={goal.whyImportant}
                  onChange={(e) => handleInputChange(e, "goals", index)}
                  className="w-full resize-none pt-1 outline-none px-1"
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
                  value={goal.whenAccomplish}
                  onChange={(e) => handleInputChange(e, "goals", index)}
                  className="w-full resize-none pt-1 outline-none px-1"
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

            {goal.quarterlyUpdates.map((update, subIndex) => (
              <div
                key={subIndex}
                className="flex items-start border-[2px] border-black mb-4"
              >
                <div className="border-r-[2px] border-black">
                  <h5 className="font-bold p-2 bg-gray-400 border-b-[2px] border-black">
                    Employee Updates(Optional)
                  </h5>
                  <textarea
                    name="q1"
                    value={update.employeeUpdates.q1}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        "goals",
                        index,
                        subIndex,
                        "employeeUpdates"
                      )
                    }
                    placeholder="Employee Q1"
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
                    name="q2"
                    value={update.employeeUpdates.q2}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        "goals",
                        index,
                        subIndex,
                        "employeeUpdates"
                      )
                    }
                    placeholder="Employee Q2"
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
                    name="q3"
                    value={update.employeeUpdates.q3}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        "goals",
                        index,
                        subIndex,
                        "employeeUpdates"
                      )
                    }
                    placeholder="Employee Q3"
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
                    name="q4"
                    value={update.employeeUpdates.q4}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        "goals",
                        index,
                        subIndex,
                        "employeeUpdates"
                      )
                    }
                    placeholder="Employee Q4"
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
                    name="q1"
                    // value={update.managerUpdates.q1}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        "goals",
                        index,
                        subIndex,
                        "managerUpdates"
                      )
                    }
                    placeholder="Manager Q1"
                    disabled
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
                    name="q2"
                    // value={update.managerUpdates.q2}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        "goals",
                        index,
                        subIndex,
                        "managerUpdates"
                      )
                    }
                    placeholder="Manager Q2"
                    disabled
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
                    name="q3"
                    // value={update.managerUpdates.q3}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        "goals",
                        index,
                        subIndex,
                        "managerUpdates"
                      )
                    }
                    placeholder="Manager Q3"
                    disabled
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
                    name="q4"
                    // value={update.managerUpdates.q4}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        "goals",
                        index,
                        subIndex,
                        "managerUpdates"
                      )
                    }
                    placeholder="Manager Q4"
                    disabled
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
            ))}
            <p className="font-medium text-[17px] mb-1 mt-8">
              Use this section to provide feedback and rating for the outcome of
              the goal.
            </p>
            <div className="flex items-start border-[2px] border-black mb-1">
              <div className="w-1/2 py-1 border-r-[2px] border-blackLight">
                <label className="block border-b-[2px] border-black px-1 text-base font-medium">
                  Manager Feedback
                </label>
                <textarea
                  name="employeeFeedback"
                  value={goal.employeeFeedback}
                  onChange={(e) => handleInputChange(e, "goals", index)}
                  className="w-full resize-none pt-1 outline-none px-1"
                  rows="1"
                  style={{ minHeight: "150px" }}
                  required
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
                  // value={goal.managerFeedback}
                  onChange={(e) => handleInputChange(e, "goals", index)}
                  disabled
                  className="w-full resize-none pt-1 outline-none px-1"
                  rows="1"
                  style={{ minHeight: "150px" }}
                  required
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
                value={goal.selfRating}
                onChange={(e) => handleInputChange(e, "goals", index)}
                className="w-full p-2 py-3 mb-4 border-[2px] border-black rounded"
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
                  // value={goal.managerRating}
                  onChange={(e) => handleInputChange(e, "goals", index)}
                  className="w-full p-2 py-3  mb-4 border-[2px] border-black rounded"
                  disabled
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
        <button
          type="button"
          onClick={handleAddGoal}
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-300"
        >
          Add Goal
        </button>
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
                name="employeeComment"
                disabled
                // value={formData.employeeComment}
                onChange={handleInputChange}
                className="w-full resize-none pt-1 outline-none px-1"
                rows="1"
                style={{ minHeight: "200px" }}
                required
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
                disabled
                // value={formData.managerComment}
                onChange={handleInputChange}
                className="w-full resize-none pt-1 outline-none px-1"
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
        )}
      </div>

      <div className="mb-6  mx-6">
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
                  name="majorAccomplishments"
                  // value={formData.majorAccomplishments}
                  onChange={handleInputChange}
                  className="w-full resize-none pt-1 outline-none px-1"
                  rows="1"
                  disabled
                  style={{ minHeight: "200px" }}
                  required
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
                  name="areasForImprovement"
                  // value={formData.areasForImprovement}
                  onChange={handleInputChange}
                  className="w-full resize-none pt-1 outline-none px-1"
                  rows="1"
                  style={{ minHeight: "200px" }}
                  required
                  disabled
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
                  name="majorAccomplishments"
                  // value={formData.majorAccomplishments}
                  onChange={handleInputChange}
                  className="w-full resize-none pt-1 outline-none px-1"
                  rows="1"
                  disabled
                  style={{ minHeight: "200px" }}
                  required
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
                  name="areasForImprovement"
                  // value={formData.areasForImprovement}
                  onChange={handleInputChange}
                  className="w-full resize-none pt-1 outline-none px-1"
                  rows="1"
                  style={{ minHeight: "200px" }}
                  required
                  disabled
                  onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <strong className="text-base w-[140px]">Overall Rating:</strong>
              <select
                name="overallRating"
                // value={formData.overallRating}
                disabled
                onChange={handleInputChange}
                className="p-2 mb-1 border rounded w-full"
                required
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

            <h2 className="text-xl font-bold mb-4 text-red-600">Sign Off</h2>
            <div className="flex items-start gap-5 mb-4">
              <div className="left w-1/2">
                <div className="flex items-center gap-2 mb-1">
                  <strong className="text-base">Manager:</strong>
                  <input
                    type="text"
                    name="managerSignature"
                    // value={formData.managerSignature}
                    onChange={handleInputChange}
                    placeholder="Manager Signature"
                    className="p-1  border ml-[6px] rounded w-full "
                    required
                    disabled
                  />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <strong className="text-base">Employee:</strong>
                  <input
                    type="text"
                    name="employeeSignature"
                    // value={formData.employeeSignature}
                    onChange={handleInputChange}
                    placeholder="Employee Signature"
                    className="p-1  border rounded w-full"
                    required
                    disabled
                  />
                </div>
              </div>
              <div className="right w-1/2">
                <div className="flex items-center gap-2 mb-1">
                  <strong className="text-base">Date:</strong>
                  <input
                    type="date"
                    name="date"
                    // value={formData.date}
                    onChange={handleInputChange}
                    placeholder="Date"
                    className="p-1 w-full border rounded"
                    disabled
                    required
                  />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <strong className="text-base">Date:</strong>
                  <input
                    type="date"
                    name="date"
                    // value={formData.date}
                    onChange={handleInputChange}
                    placeholder="Date"
                    className="p-1 w-full  border rounded"
                    disabled
                    required
                  />
                </div>
              </div>
            </div>
            <label className="block text-base font-medium">
              Employee Comment
            </label>
            <textarea
              name="employeeComments"
              // value={formData.employeeComments}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 border rounded resize-none"
              disabled
              rows="1"
              style={{ minHeight: "100px" }}
              required
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
            />
          </>
        )}
      </div>

      <button
        type="submit"
        className=" w-[95%] py-2  mx-6 mr6 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition duration-300"
      >
        Submit
      </button>
    </form>
  );
};

export default PerformanceReviewForm;
