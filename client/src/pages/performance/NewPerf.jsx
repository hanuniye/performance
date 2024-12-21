import React, { useState } from "react";

const PerformanceReviewForm = ({ auth }) => {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    manager: "",
    location: "",
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
            managerUpdates: { q1: "", q2: "", q3: "", q4: "" },
          },
        ],
        employeeFeedback: "",
        managerFeedback: "",
        selfRating: "",
        managerRating: "",
      },
    ],
    employeeComment: "",
    managerComment: "",
    majorAccomplishments: "",
    areasForImprovement: "",
    overallRating: "",
    managerSignature: "",
    date: "",
    employeeSignature: "",
    employeeComments: "",
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send formData to the API
    console.log("Form submitted:", formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg"
    >
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-4">Performance Review Form</h2>
        <label className="block mb-2">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Name"
          className="w-full p-2 mb-4 border rounded"
        />
        <label className="block mb-2">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Title"
          className="w-full p-2 mb-4 border rounded"
        />
        <label className="block mb-2">Manager</label>
        <input
          type="text"
          name="manager"
          value={formData.manager}
          onChange={handleInputChange}
          placeholder="Manager"
          className="w-full p-2 mb-4 border rounded"
        />

        {formData.goals.map((goal, index) => (
          <div key={index} className="mb-6 p-4 border rounded-lg bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Goal {index + 1}</h3>
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
            <label className="block mb-2">Global Impact Area</label>
            <select
              name="globalImpactArea"
              value={goal.globalImpactArea}
              onChange={(e) => handleInputChange(e, "goals", index)}
              className="w-full p-2 mb-4 border rounded"
            >
              <option value="">Select Global Impact Area</option>
              <option value="Impact Area 1">Impact Area 1</option>
              <option value="Impact Area 2">Impact Area 2</option>
            </select>
            <label className="block mb-2">Core Competency</label>
            <select
              name="coreCompetency"
              value={goal.coreCompetency}
              onChange={(e) => handleInputChange(e, "goals", index)}
              className="w-full p-2 mb-4 border rounded"
            >
              <option value="">Select Core Competency</option>
              <option value="Competency 1">Competency 1</option>
              <option value="Competency 2">Competency 2</option>
            </select>
            <label className="block mb-2">Functional Competency</label>
            <input
              type="text"
              name="functionalCompetency"
              value={goal.functionalCompetency}
              onChange={(e) => handleInputChange(e, "goals", index)}
              placeholder="Functional Competency"
              className="w-full p-2 mb-4 border rounded"
            />
            <label className="block mb-2">Key Tasks</label>
            <input
              type="text"
              name="keyTasks"
              value={goal.keyTasks}
              onChange={(e) => handleInputChange(e, "goals", index)}
              placeholder="Key Tasks"
              className="w-full p-2 mb-4 border rounded"
            />
            <label className="block mb-2">Why is this important?</label>
            <input
              type="text"
              name="whyImportant"
              value={goal.whyImportant}
              onChange={(e) => handleInputChange(e, "goals", index)}
              placeholder="Why is this important?"
              className="w-full p-2 mb-4 border rounded"
            />
            <label className="block mb-2">When will you accomplish it?</label>
            <input
              type="date"
              name="whenAccomplish"
              value={goal.whenAccomplish}
              onChange={(e) => handleInputChange(e, "goals", index)}
              className="w-full p-2 mb-4 border rounded"
            />

            {goal.quarterlyUpdates.map((update, subIndex) => (
              <div
                key={subIndex}
                className="mb-4 p-4 border rounded-lg bg-white"
              >
                <h4 className="text-lg font-medium mb-2">
                  Quarterly Updates {subIndex + 1}
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold mb-2">Employee Updates</h5>
                    <input
                      type="text"
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
                      className="w-full p-2 mb-2 border rounded"
                    />
                    <input
                      type="text"
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
                      className="w-full p-2 mb-2 border rounded"
                    />
                    <input
                      type="text"
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
                      className="w-full p-2 mb-2 border rounded"
                    />
                    <input
                      type="text"
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
                      className="w-full p-2 mb-2 border rounded"
                    />
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2">Manager Updates</h5>
                    <input
                      type="text"
                      name="q1"
                      value={update.managerUpdates.q1}
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
                      className="w-full p-2 mb-2 border rounded"
                    />
                    <input
                      type="text"
                      name="q2"
                      value={update.managerUpdates.q2}
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
                      className="w-full p-2 mb-2 border rounded"
                    />
                    <input
                      type="text"
                      name="q3"
                      value={update.managerUpdates.q3}
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
                      className="w-full p-2 mb-2 border rounded"
                    />
                    <input
                      type="text"
                      name="q4"
                      value={update.managerUpdates.q4}
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
                      className="w-full p-2 mb-2 border rounded"
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Employee Feedback</label>
                <input
                  type="text"
                  name="employeeFeedback"
                  value={goal.employeeFeedback}
                  onChange={(e) => handleInputChange(e, "goals", index)}
                  placeholder="Employee Feedback"
                  className="w-full p-2 mb-4 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Manager Feedback</label>
                <input
                  type="text"
                  name="managerFeedback"
                  value={goal.managerFeedback}
                  onChange={(e) => handleInputChange(e, "goals", index)}
                  placeholder="Manager Feedback"
                  className="w-full p-2 mb-4 border rounded"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Self-Rating</label>
                <select
                  name="selfRating"
                  value={goal.selfRating}
                  onChange={(e) => handleInputChange(e, "goals", index)}
                  className="w-full p-2 mb-4 border rounded"
                >
                  <option value="">Select Self-Rating</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Manager Rating</label>
                <select
                  name="managerRating"
                  value={goal.managerRating}
                  onChange={(e) => handleInputChange(e, "goals", index)}
                  className="w-full p-2 mb-4 border rounded"
                >
                  <option value="">Select Manager Rating</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
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

      <div className="mb-10" disabled={auth?.role !== "HR"}>
        <h2 className="text-2xl font-bold mb-4">Mid-Year Review</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Employee Comment</label>
            <input
              type="text"
              name="employeeComment"
              value={formData.employeeComment}
              onChange={handleInputChange}
              placeholder="Employee Comment"
              className="w-full p-2 mb-4 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Manager Comment</label>
            <input
              type="text"
              name="managerComment"
              value={formData.managerComment}
              onChange={handleInputChange}
              placeholder="Manager Comment"
              className="w-full p-2 mb-4 border rounded"
            />
          </div>
        </div>
      </div>

      <div className="mb-6" disabled={auth?.role !== "HR"}>
        <h2 className="text-2xl font-bold mb-4">Year-End Assessment</h2>
        <h2 className="text-xl font-bold mb-4">Self-Assessment</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Major Accomplishments</label>
            <input
              type="text"
              name="majorAccomplishments"
              value={formData.majorAccomplishments}
              onChange={handleInputChange}
              placeholder="Major Accomplishments"
              className="w-full p-2 mb-4 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Areas for Improvement</label>
            <input
              type="text"
              name="areasForImprovement"
              value={formData.areasForImprovement}
              onChange={handleInputChange}
              placeholder="Areas for Improvement"
              className="w-full p-2 mb-8 border rounded"
            />
          </div>
        </div>
        <h2 className="text-xl font-bold mb-4">Manager Assessment</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Major Accomplishments</label>
            <input
              type="text"
              name="majorAccomplishments"
              value={formData.majorAccomplishments}
              onChange={handleInputChange}
              placeholder="Major Accomplishments"
              className="w-full p-2 mb-4 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Areas for Improvement</label>
            <input
              type="text"
              name="areasForImprovement"
              value={formData.areasForImprovement}
              onChange={handleInputChange}
              placeholder="Areas for Improvement"
              className="w-full p-2 mb-4 border rounded"
            />
          </div>
        </div>
        <label className="block mb-2">Overall Rating</label>
        <input
          type="text"
          name="overallRating"
          value={formData.overallRating}
          onChange={handleInputChange}
          placeholder="Overall Rating"
          className="w-full p-2 mb-4 border rounded"
        />
        <h2 className="text-xl font-bold mb-4">Sign Off</h2>
        <label className="block mb-2">Manager Signature</label>
        <input
          type="text"
          name="managerSignature"
          value={formData.managerSignature}
          onChange={handleInputChange}
          placeholder="Manager Signature"
          className="w-full p-2 mb-4 border rounded"
        />
        <label className="block mb-2">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          placeholder="Date"
          className="w-full p-2 mb-4 border rounded"
        />
        <label className="block mb-2">Employee Signature</label>
        <input
          type="text"
          name="employeeSignature"
          value={formData.employeeSignature}
          onChange={handleInputChange}
          placeholder="Employee Signature"
          className="w-full p-2 mb-4 border rounded"
        />
        <label className="block mb-2">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          placeholder="Date"
          className="w-full p-2 mb-4 border rounded"
        />
        <label className="block mb-2">Employee Comments</label>
        <input
          type="text"
          name="employeeComments"
          value={formData.employeeComments}
          onChange={handleInputChange}
          placeholder="Employee Comments"
          className="w-full p-2 mb-4 border rounded"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition duration-300"
      >
        Submit
      </button>
    </form>
  );
};

export default PerformanceReviewForm;
