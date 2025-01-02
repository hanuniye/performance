import React, { useRef, useState } from "react";
import { useGlobalProvider } from "../../HOOKS/useGlobalProvider";
import { usePrivateAxios } from "../../HOOKS/usePrivateAxios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

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
    defaultGoal: {
      globalImpactArea: "",
      coreCompetency: "",
      coreCompetency1: "",
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
    goals: [],
  });
  const Axios = usePrivateAxios();
  const navigate = useNavigate();
  const componentRef = useRef();

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
          coreCompetency1: "",
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
    } else if (section === "defaultGoal") {
      if (index !== undefined) {
        updatedFormData.defaultGoal.quarterlyUpdates[index][field][name] =
          value;
      } else {
        updatedFormData.defaultGoal[name] = value;
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
        console.log(error.response);
        toast.error(error.response.data.error);
      } else {
        console.log(error.message);
      }
    }
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "appraisal form",
  });

  function handleTextResize(event) {
    const textarea = event.target;
    const maxFontSize = 16; // initial font size in px
    const minFontSize = 10; // minimum font size in px

    // Reset font size when the text is cleared
    if (textarea.value.trim() === "") {
      textarea.style.fontSize = `${maxFontSize}px`;
      return;
    }

    // Adjust font size based on content height
    let currentFontSize = parseFloat(
      window.getComputedStyle(textarea).fontSize
    );

    // Check if content overflows
    const scrollHeight = textarea.scrollHeight;
    const clientHeight = textarea.clientHeight;

    if (scrollHeight > clientHeight && currentFontSize > minFontSize) {
      // Shrink font size
      textarea.style.fontSize = `${currentFontSize - 1}px`;
    } else if (scrollHeight <= clientHeight && currentFontSize < maxFontSize) {
      // Increase font size if there's extra space
      textarea.style.fontSize = `${currentFontSize + 1}px`;
    }
  }

  return (
    <form onSubmit={onSubmit} className="my-5 max-w-4xl mx-auto">
      {/* employeeDetails and first Goal secion  */}
      <div className="mb-8 bg-white shadow-md pb-2">
        <div className="mb-4 bg-white" ref={componentRef}>
          <div className="w-full h-[100px]">
            <img src="/care5.png" alt="hero" className="w-full h-full" />
          </div>
          <div className="mx-6 mt-[12px]">
            <h2 className="text-2xl font-bold mb-2">Performance Review Form</h2>
            <div className="flex items-start gap-2 mb-1">
              <strong className="text-base">FY:</strong>
              <select
                name="fy"
                value={formData.fy}
                onChange={handleInputChange}
                className="border border-blackLightLight rounded "
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
            <p className="font-medium text-[13px] mb-2">
              Use the worksheet to help you set goals and scale your personal
              and global impact. <span className="text-red-600">Note:</span>{" "}
              Please enter 3-5 goals, with one being a development goal You must
              select one of the four global impact areas shown in the drop-down
              list and at least one core competency for each of your goals.
            </p>
            <div className="flex items-start gap-5 mb-1">
              <div className="left w-1/2">
                <div className="flex items-center gap-2 mb-1">
                  <strong className="text-sm">Name:</strong>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    className="p-[3px] border rounded w-full  ml-[19px]"
                    required
                  />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <strong className="text-sm">Manager:</strong>
                  <input
                    type="text"
                    name="manager"
                    value={formData.manager}
                    onChange={handleInputChange}
                    placeholder="Manager"
                    className="p-[3px] border rounded w-full"
                    required
                  />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <strong className="text-sm">Location:</strong>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Location"
                    className="p-[3px] border rounded w-full ml-[3px]"
                    required
                  />
                </div>
              </div>
              <div className="right w-1/2">
                <div className="flex items-center gap-2 mb-1">
                  <strong className="text-sm">Title:</strong>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Title"
                    className="p-[3px] w-full  ml-[51px] border rounded"
                    required
                  />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <strong className="text-sm">Department:</strong>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="Department"
                    className="p-[3px] w-full  border rounded"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-xl font-semibold text-[#e36f25]">
                  #1 Goal
                </h3>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <strong className="text-base w-[250px]">
                  Global Impact Area:
                </strong>
                <select
                  name="globalImpactArea"
                  value={formData.defaultGoal.globalImpactArea}
                  onChange={(e) => handleInputChange(e, "defaultGoal")}
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
                <strong className="text-base w-[250px]">
                  Core Competency:
                </strong>
                <select
                  name="coreCompetency"
                  value={formData.defaultGoal.coreCompetency}
                  onChange={(e) => handleInputChange(e, "defaultGoal")}
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
              <div className="flex items-center gap-2 mb-2">
                <strong className="text-base w-[250px]">
                  Core Competency:
                </strong>
                <select
                  name="coreCompetency1"
                  value={formData.defaultGoal.coreCompetency1}
                  onChange={(e) => handleInputChange(e, "defaultGoal")}
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

              <div className="flex items-center gap-2 mb-3">
                <strong className="text-base  w-[250px]">
                  Functional Competency:
                </strong>
                <textarea
                  name="functionalCompetency"
                  value={formData.defaultGoal.functionalCompetency}
                  onChange={(e) => {
                    handleInputChange(e, "defaultGoal");
                    handleTextResize(e); // Resize on text change
                  }}
                  placeholder="Functional Competency"
                  className="w-full p-2 border-[2px] border-blackLight rounded resize-none"
                  rows="1"
                  style={{
                    height: "60px",
                    fontSize: "16px",
                    overflow: "hidden",
                  }}
                  required
                  onInput={handleTextResize} // Resize on input
                  onPaste={handleTextResize} //
                />
              </div>

              <div className="flex items-start border-[2px] border-blackLight mb-2">
                <div className="w-1/3 py-1 border-r-[2px] border-blackLight">
                  <label
                    className="block border-b-[2px] border-blackLight
                     px-1 text-xs font-bold"
                  >
                    List Key Tasks To Accomplish The Goal
                  </label>
                  <textarea
                    name="keyTasks"
                    value={formData.defaultGoal.keyTasks}
                    onChange={(e) => {
                      handleInputChange(e, "defaultGoal");
                      handleTextResize(e); // Resize on text change
                    }}
                    className="w-full resize-none pt-1 outline-none px-1"
                    rows="1"
                    style={{
                      minHeight: "100px",
                      fontSize: "16px",
                      overflow: "hidden",
                    }}
                    required
                    onInput={handleTextResize} // Resize on input
                    onPaste={handleTextResize} //
                  />
                </div>
                <div className="w-1/3 py-1 border-x-[2px] border-blackLight">
                  <label className="block border-b-[2px] capitalize border-blackLight px-1 text-xs font-bold">
                    Why is this important to you and your team?
                  </label>
                  <textarea
                    name="whyImportant"
                    value={formData.defaultGoal.whyImportant}
                    onChange={(e) => {
                      handleInputChange(e, "defaultGoal");
                      handleTextResize(e); // Resize on text change
                    }}
                    className="w-full resize-none pt-1 outline-none px-1"
                    rows="1"
                    style={{
                      minHeight: "100px",
                      fontSize: "16px",
                      overflow: "hidden",
                    }}
                    required
                    onInput={handleTextResize} // Resize on input
                    onPaste={handleTextResize} //
                  />
                </div>
                <div className="w-1/3 py-1 border-l-[2px] border-blackLight">
                  <label className="block border-b-[2px] capitalize border-blackLight px-1 text-xs font-bold">
                    When will you accomplish it?
                  </label>
                  <textarea
                    name="whenAccomplish"
                    value={formData.defaultGoal.whenAccomplish}
                    onChange={(e) => {
                      handleInputChange(e, "defaultGoal");
                      handleTextResize(e); // Resize on text change
                    }}
                    className="w-full resize-none pt-1 outline-none px-1"
                    rows="1"
                    style={{
                      minHeight: "100px",
                      fontSize: "16px",
                      overflow: "hidden",
                    }}
                    required
                    onInput={handleTextResize} // Resize on input
                    onPaste={handleTextResize} //
                  />
                </div>
              </div>

              {formData.defaultGoal.quarterlyUpdates.map((update, index) => (
                <div
                  key={index}
                  className="flex items-start border-[2px] border-blackLight mb-2"
                >
                  <div className="border-r-[2px] border-blackLight">
                    <h5 className="font-bold p-2 bg-gray-400 border-b-[2px] border-blackLight">
                      Employee Updates(Optional)
                    </h5>
                    <textarea
                      name="q1"
                      value={update.employeeUpdates.q1}
                      onChange={(e) => {
                        handleInputChange(
                          e,
                          "defaultGoal",
                          index,
                          "",
                          "employeeUpdates"
                        );
                        handleTextResize(e); // Resize on text change
                      }}
                      placeholder="Employee Q1"
                      className="w-full p-2 border-b-[2px] border-blackLight resize-none outline-none"
                      rows="1"
                      style={{
                        fontSize: "16px",
                        overflow: "hidden",
                      }}
                      required
                      onInput={handleTextResize} // Resize on input
                      onPaste={handleTextResize} //
                    />
                    <textarea
                      name="q2"
                      value={update.employeeUpdates.q2}
                      onChange={(e) => {
                        handleInputChange(
                          e,
                          "defaultGoal",
                          index,
                          "",
                          "employeeUpdates"
                        );
                        handleTextResize(e); // Resize on text change
                      }}
                      placeholder="Employee Q2"
                      className="w-full p-2 border-b-[2px] border-blackLight resize-none outline-none"
                      rows="1"
                      style={{
                        fontSize: "16px",
                        overflow: "hidden",
                      }}
                      required
                      onInput={handleTextResize} // Resize on input
                      onPaste={handleTextResize} //
                    />
                    <textarea
                      name="q3"
                      value={update.employeeUpdates.q3}
                      onChange={(e) => {
                        handleInputChange(
                          e,
                          "defaultGoal",
                          index,
                          "",
                          "employeeUpdates"
                        );
                        handleTextResize(e); // Resize on text change
                      }}
                      placeholder="Employee Q3"
                      className="w-full p-2 border-b-[2px] border-blackLight resize-none outline-none"
                      rows="1"
                      style={{
                        fontSize: "16px",
                        overflow: "hidden",
                      }}
                      required
                      onInput={handleTextResize} // Resize on input
                      onPaste={handleTextResize} //
                    />
                    <textarea
                      name="q4"
                      value={update.employeeUpdates.q4}
                      onChange={(e) => {
                        handleInputChange(
                          e,
                          "defaultGoal",
                          index,
                          "",
                          "employeeUpdates"
                        );
                        handleTextResize(e); // Resize on text change
                      }}
                      placeholder="Employee Q4"
                      className="w-full p-2 border resize-none outline-none"
                      rows="1"
                      style={{
                        fontSize: "16px",
                        overflow: "hidden",
                      }}
                      required
                      onInput={handleTextResize} // Resize on input
                      onPaste={handleTextResize} //
                    />
                  </div>
                  <div>
                    <h5 className="font-bold p-2 bg-gray-400 border-b-[2px] border-blackLight">
                      Manager Updates(Optional)
                    </h5>
                    <textarea
                      name="q1"
                      // value={update.managerUpdates.q1}
                      onChange={(e) => {
                        handleInputChange(
                          e,
                          "goals",
                          index,
                          subIndex,
                          "managerUpdates"
                        );
                        handleTextResize(e); // Resize on text change
                      }}
                      placeholder="Manager Q1"
                      disabled
                      className="w-full p-2 border-b-[2px] border-blackLight resize-none outline-none"
                      rows="1"
                      style={{
                        fontSize: "16px",
                        overflow: "hidden",
                      }}
                      required
                      onInput={handleTextResize} // Resize on input
                      onPaste={handleTextResize} //
                    />
                    <textarea
                      name="q2"
                      // value={update.managerUpdates.q2}
                      onChange={(e) => {
                        handleInputChange(
                          e,
                          "goals",
                          index,
                          subIndex,
                          "managerUpdates"
                        );
                        handleTextResize(e); // Resize on text change
                      }}
                      placeholder="Manager Q2"
                      disabled
                      className="w-full p-2 border-b-[2px] border-blackLight resize-none outline-none"
                      rows="1"
                      style={{
                        fontSize: "16px",
                        overflow: "hidden",
                      }}
                      required
                      onInput={handleTextResize} // Resize on input
                      onPaste={handleTextResize} //
                    />
                    <textarea
                      name="q3"
                      // value={update.managerUpdates.q3}
                      onChange={(e) => {
                        handleInputChange(
                          e,
                          "goals",
                          index,
                          subIndex,
                          "managerUpdates"
                        );
                        handleTextResize(e); // Resize on text change
                      }}
                      placeholder="Manager Q3"
                      disabled
                      className="w-full p-2 border-b-[2px] border-blackLight resize-none outline-none"
                      rows="1"
                      style={{
                        fontSize: "16px",
                        overflow: "hidden",
                      }}
                      required
                      onInput={handleTextResize} // Resize on input
                      onPaste={handleTextResize} //
                    />
                    <textarea
                      name="q4"
                      // value={update.managerUpdates.q4}
                      onChange={(e) => {
                        handleInputChange(
                          e,
                          "goals",
                          index,
                          subIndex,
                          "managerUpdates"
                        );
                        handleTextResize(e); // Resize on text change
                      }}
                      placeholder="Manager Q4"
                      disabled
                      className="w-full p-2 border rounded resize-none outline-none"
                      rows="1"
                      style={{
                        fontSize: "16px",
                        overflow: "hidden",
                      }}
                      required
                      onInput={handleTextResize} // Resize on input
                      onPaste={handleTextResize} //
                    />
                  </div>
                </div>
              ))}
              <p className="font-medium text-[17px] mb-1 ">
                Use this section to provide feedback and rating for the outcome
                of the goal.
              </p>
              <div className="flex items-start gap-2 mb-2">
                <div className="w-1/2  border-[2px] border-blackLight">
                  <label className="block border-b-[2px] border-blackLight px-1 text-[14px] font-medium">
                    Employee Feedback
                  </label>
                  <textarea
                    name="employeeFeedback"
                    value={formData.defaultGoal.employeeFeedback}
                    onChange={(e) => {
                      handleInputChange(e, "defaultGoal");
                      handleTextResize(e); // Resize on text change
                    }}
                    className="w-full resize-none pt-1 outline-none px-1"
                    rows="1"
                    style={{
                      height: "60px",
                      fontSize: "16px",
                      overflow: "hidden",
                    }}
                    required
                    onInput={handleTextResize} // Resize on input
                    onPaste={handleTextResize} //
                  />
                </div>
                <select
                  name="selfRating"
                  value={formData.defaultGoal.selfRating}
                  onChange={(e) => handleInputChange(e, "defaultGoal")}
                  className="w-1/2 p-2 py-3 border-[2px] border-blackLight rounded"
                >
                  <option value="" className="text-[14px]">
                    Select Self-Rating
                  </option>
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
              <div className="flex items-start gap-2">
                <div className="w-1/2 p border-[2px] border-blackLight">
                  <label className="block border-b-[2px] border-blackLight px-1 text-[14px] font-medium">
                    Manager Feedback
                  </label>
                  <textarea
                    name="managerFeedback"
                    value={formData.defaultGoal.managerFeedback}
                    onChange={(e) => {
                      handleInputChange(e, "defaultGoal");
                      handleTextResize(e); // Resize on text change
                    }}
                    className="w-full resize-none pt-1 outline-none px-1"
                    rows="1"
                    style={{
                      height: "60px",
                      fontSize: "16px",
                      overflow: "hidden",
                    }}
                    required
                    disabled
                    onInput={handleTextResize} // Resize on input
                    onPaste={handleTextResize} //
                  />
                </div>
                <select
                  name="managerRating"
                  // value={goal.managerRating}
                  onChange={(e) => handleInputChange(e, "defaultGoal")}
                  className="w-1/2 p-2 py-3 border-[2px] border-blackLight rounded"
                  disabled
                >
                  <option value="" className="text-[14px]">
                    Select Manager Rating
                  </option>
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
        </div>
      </div>

      {/* goals section  */}
      {formData.goals.map((goal, index) => (
        <div key={index} className="pb-2 mb-8 bg-white shadow-md">
          <div className="mb-4 bg-white" ref={componentRef}>
            <div className="w-full h-[110px]">
              <img src="/care5.png" alt="hero" className="w-full h-full" />
            </div>

            <div className="mx-6 mt-5">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-xl font-semibold text-[#e36f25]">
                  #{index + 2} Goal
                </h3>
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
                <strong className="text-base w-[250px]">
                  Core Competency:
                </strong>
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
              <div className="flex items-center gap-2 mb-2">
                <strong className="text-base w-[250px]">
                  Core Competency:
                </strong>
                <select
                  name="coreCompetency1"
                  value={goal.coreCompetency1}
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

              <div className="flex items-center gap-2 mb-3">
                <strong className="text-base  w-[250px]">
                  Functional Competency:
                </strong>
                <textarea
                  name="functionalCompetency"
                  value={goal.functionalCompetency}
                  onChange={(e) => {
                    handleInputChange(e, "goals", index);
                    handleTextResize(e); // Resize on text change
                  }}
                  placeholder="Functional Competency"
                  className="w-full p-2 border-[2px] border-blackLight rounded resize-none"
                  rows="1"
                  style={{
                    height: "60px",
                    fontSize: "16px",
                    overflow: "hidden",
                  }}
                  required
                  onInput={handleTextResize} // Resize on input
                  onPaste={handleTextResize} //
                />
              </div>

              <div className="flex items-start border-[2px] border-blackLight mb-2">
                <div className="w-1/3 py-1 border-r-[2px] border-blackLight">
                  <label
                    className="block border-b-[2px] border-blackLight
                     px-1 text-xs font-bold"
                  >
                    List Key Tasks To Accomplish The Goal
                  </label>
                  <textarea
                    name="keyTasks"
                    value={goal.keyTasks}
                    onChange={(e) => {
                      handleInputChange(e, "goals", index);
                      handleTextResize(e); // Resize on text change
                    }}
                    className="w-full resize-none pt-1 outline-none px-1"
                    rows="1"
                    style={{
                      minHeight: "100px",
                      fontSize: "16px",
                      overflow: "hidden",
                    }}
                    required
                    onInput={handleTextResize} // Resize on input
                    onPaste={handleTextResize} //
                  />
                </div>
                <div className="w-1/3 py-1 border-x-[2px] border-blackLight">
                  <label className="block border-b-[2px] capitalize border-blackLight px-1 text-xs font-bold">
                    Why is this important to you and your team?
                  </label>
                  <textarea
                    name="whyImportant"
                    value={goal.whyImportant}
                    onChange={(e) => {
                      handleInputChange(e, "goals", index);
                      handleTextResize(e); // Resize on text change
                    }}
                    className="w-full resize-none pt-1 outline-none px-1"
                    rows="1"
                    style={{
                      minHeight: "100px",
                      fontSize: "16px",
                      overflow: "hidden",
                    }}
                    required
                    onInput={handleTextResize} // Resize on input
                    onPaste={handleTextResize} //
                  />
                </div>
                <div className="w-1/3 py-1 border-l-[2px] border-blackLight">
                  <label className="block border-b-[2px] capitalize border-blackLight px-1 text-xs font-bold">
                    When will you accomplish it?
                  </label>
                  <textarea
                    name="whenAccomplish"
                    value={goal.whenAccomplish}
                    onChange={(e) => {
                      handleInputChange(e, "goals", index);
                      handleTextResize(e); // Resize on text change
                    }}
                    className="w-full resize-none pt-1 outline-none px-1"
                    rows="1"
                    style={{
                      minHeight: "100px",
                      fontSize: "16px",
                      overflow: "hidden",
                    }}
                    required
                    onInput={handleTextResize} // Resize on input
                    onPaste={handleTextResize} //
                  />
                </div>
              </div>

              {goal.quarterlyUpdates.map((update, subIndex) => (
                <div
                  key={subIndex}
                  className="flex items-start border-[2px] border-blackLight mb-2"
                >
                  <div className="border-r-[2px] border-blackLight">
                    <h5 className="font-bold p-2 bg-gray-400 border-b-[2px] border-blackLight">
                      Employee Updates(Optional)
                    </h5>
                    <textarea
                      name="q1"
                      value={update.employeeUpdates.q1}
                      onChange={(e) => {
                        handleInputChange(
                          e,
                          "goals",
                          index,
                          subIndex,
                          "employeeUpdates"
                        );
                        handleTextResize(e); // Resize on text change
                      }}
                      placeholder="Employee Q1"
                      className="w-full p-2 border-b-[2px] border-blackLight resize-none outline-none"
                      rows="1"
                      style={{
                        fontSize: "16px",
                        overflow: "hidden",
                      }}
                      required
                      onInput={handleTextResize} // Resize on input
                      onPaste={handleTextResize} //
                    />
                    <textarea
                      name="q2"
                      value={update.employeeUpdates.q2}
                      onChange={(e) => {
                        handleInputChange(
                          e,
                          "goals",
                          index,
                          subIndex,
                          "employeeUpdates"
                        );
                        handleTextResize(e); // Resize on text change
                      }}
                      placeholder="Employee Q2"
                      className="w-full p-2 border-b-[2px] border-blackLight resize-none outline-none"
                      rows="1"
                      style={{
                        fontSize: "16px",
                        overflow: "hidden",
                      }}
                      required
                      onInput={handleTextResize} // Resize on input
                      onPaste={handleTextResize} //
                    />
                    <textarea
                      name="q3"
                      value={update.employeeUpdates.q3}
                      onChange={(e) => {
                        handleInputChange(
                          e,
                          "goals",
                          index,
                          subIndex,
                          "employeeUpdates"
                        );
                        handleTextResize(e); // Resize on text change
                      }}
                      placeholder="Employee Q3"
                      className="w-full p-2 border-b-[2px] border-blackLight resize-none outline-none"
                      rows="1"
                      style={{
                        fontSize: "16px",
                        overflow: "hidden",
                      }}
                      required
                      onInput={handleTextResize} // Resize on input
                      onPaste={handleTextResize} //
                    />
                    <textarea
                      name="q4"
                      value={update.employeeUpdates.q4}
                      onChange={(e) => {
                        handleInputChange(
                          e,
                          "goals",
                          index,
                          subIndex,
                          "employeeUpdates"
                        );
                        handleTextResize(e); // Resize on text change
                      }}
                      placeholder="Employee Q4"
                      className="w-full p-2 border resize-none outline-none"
                      rows="1"
                      style={{
                        fontSize: "16px",
                        overflow: "hidden",
                      }}
                      required
                      onInput={handleTextResize} // Resize on input
                      onPaste={handleTextResize} //
                    />
                  </div>
                  <div>
                    <h5 className="font-bold p-2 bg-gray-400 border-b-[2px] border-blackLight">
                      Manager Updates(Optional)
                    </h5>
                    <textarea
                      name="q1"
                      // value={update.managerUpdates.q1}
                      onChange={(e) => {
                        handleInputChange(
                          e,
                          "goals",
                          index,
                          subIndex,
                          "managerUpdates"
                        );
                        handleTextResize(e); // Resize on text change
                      }}
                      placeholder="Manager Q1"
                      disabled
                      className="w-full p-2 border-b-[2px] border-blackLight resize-none outline-none"
                      rows="1"
                      style={{
                        fontSize: "16px",
                        overflow: "hidden",
                      }}
                      required
                      onInput={handleTextResize} // Resize on input
                      onPaste={handleTextResize} //
                    />
                    <textarea
                      name="q2"
                      // value={update.managerUpdates.q2}
                      onChange={(e) => {
                        handleInputChange(
                          e,
                          "goals",
                          index,
                          subIndex,
                          "managerUpdates"
                        );
                        handleTextResize(e); // Resize on text change
                      }}
                      placeholder="Manager Q2"
                      disabled
                      className="w-full p-2 border-b-[2px] border-blackLight resize-none outline-none"
                      rows="1"
                      style={{
                        fontSize: "16px",
                        overflow: "hidden",
                      }}
                      required
                      onInput={handleTextResize} // Resize on input
                      onPaste={handleTextResize} //
                    />
                    <textarea
                      name="q3"
                      // value={update.managerUpdates.q3}
                      onChange={(e) => {
                        handleInputChange(
                          e,
                          "goals",
                          index,
                          subIndex,
                          "managerUpdates"
                        );
                        handleTextResize(e); // Resize on text change
                      }}
                      placeholder="Manager Q3"
                      disabled
                      className="w-full p-2 border-b-[2px] border-blackLight resize-none outline-none"
                      rows="1"
                      style={{
                        fontSize: "16px",
                        overflow: "hidden",
                      }}
                      required
                      onInput={handleTextResize} // Resize on input
                      onPaste={handleTextResize} //
                    />
                    <textarea
                      name="q4"
                      // value={update.managerUpdates.q4}
                      onChange={(e) => {
                        handleInputChange(
                          e,
                          "goals",
                          index,
                          subIndex,
                          "managerUpdates"
                        );
                        handleTextResize(e); // Resize on text change
                      }}
                      placeholder="Manager Q4"
                      disabled
                      className="w-full p-2 border rounded resize-none outline-none"
                      rows="1"
                      style={{
                        fontSize: "16px",
                        overflow: "hidden",
                      }}
                      required
                      onInput={handleTextResize} // Resize on input
                      onPaste={handleTextResize} //
                    />
                  </div>
                </div>
              ))}
              <p className="font-medium text-[17px] mb-1 ">
                Use this section to provide feedback and rating for the outcome
                of the goal.
              </p>
              <div className="flex items-start gap-2 mb-2">
                <div className="w-1/2  border-[2px] border-blackLight">
                  <label className="block border-b-[2px] border-blackLight px-1 text-[14px] font-medium">
                    Employee Feedback
                  </label>
                  <textarea
                    name="employeeFeedback"
                    value={goal.employeeFeedback}
                    onChange={(e) => {
                      handleInputChange(e, "goals", index);
                      handleTextResize(e); // Resize on text change
                    }}
                    className="w-full resize-none pt-1 outline-none px-1"
                    rows="1"
                    style={{
                      height: "60px",
                      fontSize: "16px",
                      overflow: "hidden",
                    }}
                    required
                    onInput={handleTextResize} // Resize on input
                    onPaste={handleTextResize} //
                  />
                </div>
                <select
                  name="selfRating"
                  value={goal.selfRating}
                  onChange={(e) => handleInputChange(e, "goals", index)}
                  className="w-1/2 p-2 py-3 border-[2px] border-blackLight rounded"
                >
                  <option value="" className="text-[14px]">
                    Select Self-Rating
                  </option>
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
              <div className="flex items-start gap-2">
                <div className="w-1/2 p border-[2px] border-blackLight">
                  <label className="block border-b-[2px] border-blackLight px-1 text-[14px] font-medium">
                    Manager Feedback
                  </label>
                  <textarea
                    name="managerFeedback"
                    value={goal.managerFeedback}
                    onChange={(e) => {
                      handleInputChange(e, "goals", index);
                      handleTextResize(e); // Resize on text change
                    }}
                    className="w-full resize-none pt-1 outline-none px-1"
                    rows="1"
                    style={{
                      height: "60px",
                      fontSize: "16px",
                      overflow: "hidden",
                    }}
                    required
                    disabled
                    onInput={handleTextResize} // Resize on input
                    onPaste={handleTextResize} //
                  />
                </div>
                <select
                  name="managerRating"
                  // value={goal.managerRating}
                  onChange={(e) => handleInputChange(e, "goals", index)}
                  className="w-1/2 p-2 py-3 border-[2px] border-blackLight rounded"
                  disabled
                >
                  <option value="" className="text-[14px]">
                    Select Manager Rating
                  </option>
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
          <div className="flex justify-end items-start gap-3 mx-6">
            <button
              type="button"
              onClick={() => handleRemoveGoal(index)}
              className="py-2 px-6 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition duration-300"
            >
              Remove
            </button>

            {/* <button
              onClick={handlePrint}
              className="py-2 px-6 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-300"
            >
              Print
            </button> */}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddGoal}
        className="w-full py-2 mb-8 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-300"
      >
        Add Goal
      </button>

      <div className="mb-8 bg-white shadow-md pb-2">
        <div className="mb-4 bg-white" ref={componentRef}>
          <div className="w-full h-[100px]">
            <img src="/care5.png" alt="hero" className="w-full h-full" />
          </div>

          <div className="mx-6 mt-[12px]">
            <h2 className="text-2xl font-bold mb-2">Performance Review</h2>
            <div className="flex items-start gap-5 mb-2">
              <div className="left w-1/2">
                <div className="flex items-center gap-2 mb-1">
                  <strong className="text-sm">Name:</strong>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    className="p-[3px] border rounded w-full  ml-[19px]"
                    required
                    disabled
                  />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <strong className="text-sm">Manager:</strong>
                  <input
                    type="text"
                    name="manager"
                    value={formData.manager}
                    onChange={handleInputChange}
                    placeholder="Manager"
                    className="p-[3px] border rounded w-full"
                    required
                    disabled
                  />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <strong className="text-sm">Location:</strong>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Location"
                    className="p-[3px] border rounded w-full ml-[3px]"
                    required
                    disabled
                  />
                </div>
              </div>
              <div className="right w-1/2">
                <div className="flex items-center gap-2 mb-1">
                  <strong className="text-sm">Title:</strong>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Title"
                    className="p-[3px] w-full  ml-[51px] border rounded"
                    required
                    disabled
                  />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <strong className="text-sm">Department:</strong>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="Department"
                    className="p-[3px] w-full  border rounded"
                    required
                    disabled
                  />
                </div>
              </div>
            </div>
            <h2
              className="text-xl font-bold mb-2 cursor-pointer text-red-600"
              // onClick={() => setIsMidYearCollapsed(!isMidYearCollapsed)}
            >
              Mid-Year Review
              {/* {isMidYearCollapsed ? "+" : "-"} */}
            </h2>
            {/* {!isMidYearCollapsed && ( */}
            <div className="flex items-start border-[2px] border-blackLight mb-4">
              <div className="w-1/2 py-1 border-r-[2px] border-blackLightLight">
                <label className="block border-b-[2px] border-blackLight px-1 text-base font-medium">
                  Employee Comment
                </label>
                <textarea
                  name="employeeComment"
                  disabled
                  // value={formData.employeeComment}
                  onChange={(e) => {
                    handleInputChange;
                    handleTextResize(e); // Resize on text change
                  }}
                  className="w-full resize-none pt-1 outline-none px-1"
                  rows="1"
                  style={{
                    minHeight: "100px",
                    fontSize: "16px",
                    overflow: "hidden",
                  }}
                  required
                  onInput={handleTextResize} // Resize on input
                  onPaste={handleTextResize} //
                />
              </div>
              <div className="w-1/2 py-1 border-l-[2px] border-blackLightLight">
                <label className="block border-b-[2px] border-blackLight px-1 text-base font-medium">
                  Manager Comment
                </label>
                <textarea
                  name="managerComment"
                  disabled
                  // value={formData.managerComment}
                  onChange={(e) => {
                    handleInputChange;
                    handleTextResize(e); // Resize on text change
                  }}
                  className="w-full resize-none pt-1 outline-none px-1"
                  rows="1"
                  style={{
                    minHeight: "100px",
                    fontSize: "16px",
                    overflow: "hidden",
                  }}
                  required
                  onInput={handleTextResize} // Resize on input
                  onPaste={handleTextResize} //
                />
              </div>
            </div>
            {/* )} */}
            <h2
              className="text-xl font-bold mb-1 cursor-pointer text-red-600"
              // onClick={() => setIsYearEndCollapsed(!isYearEndCollapsed)}
            >
              Year-End Assessment
              {/* {isYearEndCollapsed ? "+" : "-"} */}
            </h2>

            {/* {!isYearEndCollapsed && ( */}
            <>
              <label className="block text-sm font-bold mb-2">
                Looking back at this fiscal year, capture the highlights here.
              </label>
              <h2 className="text-xl font-bold mb-2  text-red-600">
                Self-Assessment
              </h2>
              <div className="flex items-start border-[2px] border-blackLight mb-4">
                <div className="w-1/2 py-1 border-r-[2px] border-blackLightLight">
                  <label className="block border-b-[2px] border-blackLight px-1 text-base font-medium">
                    Strengths/Major Accomplishments
                  </label>
                  <textarea
                    name="majorAccomplishments"
                    // value={formData.majorAccomplishments}
                    onChange={(e) => {
                      handleInputChange;
                      handleTextResize(e); // Resize on text change
                    }}
                    className="w-full resize-none pt-1 outline-none px-1"
                    rows="1"
                    disabled
                    style={{
                      minHeight: "100px",
                      fontSize: "16px",
                      overflow: "hidden",
                    }}
                    required
                    onInput={handleTextResize} // Resize on input
                    onPaste={handleTextResize} //
                  />
                </div>
                <div className="w-1/2 py-1 border-l-[2px] border-blackLightLight">
                  <label className="block border-b-[2px] border-blackLight px-1 text-base font-medium">
                    Areas for Improvement
                  </label>
                  <textarea
                    name="areasForImprovement"
                    // value={formData.areasForImprovement}
                    onChange={(e) => {
                      handleInputChange;
                      handleTextResize(e); // Resize on text change
                    }}
                    className="w-full resize-none pt-1 outline-none px-1"
                    rows="1"
                    style={{
                      minHeight: "100px",
                      fontSize: "16px",
                      overflow: "hidden",
                    }}
                    required
                    disabled
                    onInput={handleTextResize} // Resize on input
                    onPaste={handleTextResize} //
                  />
                </div>
              </div>

              <h2 className="text-xl font-bold mb-2 text-red-600">
                Manager Assessment
              </h2>
              <div className="flex items-start border-[2px] border-blackLight mb-4">
                <div className="w-1/2 py-1 border-r-[2px] border-blackLightLight">
                  <label className="block border-b-[2px] border-blackLight px-1 text-base font-medium">
                    Strengths/Major Accomplishments
                  </label>
                  <textarea
                    name="majorAccomplishments"
                    // value={formData.majorAccomplishments}
                    onChange={(e) => {
                      handleInputChange;
                      handleTextResize(e); // Resize on text change
                    }}
                    className="w-full resize-none pt-1 outline-none px-1"
                    rows="1"
                    disabled
                    style={{
                      minHeight: "100px",
                      fontSize: "16px",
                      overflow: "hidden",
                    }}
                    required
                    onInput={handleTextResize} // Resize on input
                    onPaste={handleTextResize} //
                  />
                </div>
                <div className="w-1/2 py-1 border-l-[2px] border-blackLightLight">
                  <label className="block border-b-[2px] border-blackLight px-1 text-base font-medium">
                    Areas for Improvement
                  </label>
                  <textarea
                    name="areasForImprovement"
                    // value={formData.areasForImprovement}
                    onChange={(e) => {
                      handleInputChange;
                      handleTextResize(e); // Resize on text change
                    }}
                    className="w-full resize-none pt-1 outline-none px-1"
                    rows="1"
                    style={{
                      minHeight: "100px",
                      fontSize: "16px",
                      overflow: "hidden",
                    }}
                    required
                    disabled
                    onInput={handleTextResize} // Resize on input
                    onPaste={handleTextResize} //
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

              <h2 className="text-xl font-bold mb-2 text-red-600">Sign Off</h2>
              <div className="flex items-start gap-5 mb-2">
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
              <label className="block mb-1 text-base font-medium">
                Employee Comment
              </label>
              <textarea
                name="employeeComments"
                // value={formData.employeeComments}
                onChange={(e) => {
                  handleInputChange;
                  handleTextResize(e); // Resize on text change
                }}
                className="w-full p-2 mb-4 border rounded resize-none"
                disabled
                rows="1"
                style={{
                  minHeight: "80px",
                  fontSize: "16px",
                  overflow: "hidden",
                }}
                required
                onInput={handleTextResize} // Resize on input
                onPaste={handleTextResize} //
              />
            </>
            {/* )} */}
          </div>
        </div>
        <div className="flex justify-end items-start gap-3 mx-6">
          {/* <button
            onClick={handlePrint}
            className="py-2 px-6 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-300"
          >
            Print
          </button> */}
        </div>
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
