import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePrivateAxios } from "../../HOOKS/usePrivateAxios";
import { useGlobalProvider } from "../../HOOKS/useGlobalProvider";
import { toast } from "sonner";
import Spinner from "../../components/Spinner";

const UpdatePerformanceReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const axios = usePrivateAxios();
  const { auth } = useGlobalProvider();
  const [isLoading, setIsLoading] = useState(false);

  const startYear = 2024;
  const endYear = 2050;

  const [isMidYearCollapsed, setIsMidYearCollapsed] = useState(true);
  const [isYearEndCollapsed, setIsYearEndCollapsed] = useState(true);

  useEffect(() => {
    const fetchReview = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/performance_review/${id}`);
        setReview(response.data?.msg);
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
    const updatedReview = { ...review };

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

    setReview(updatedReview);
  };

  const handleRemoveGoal = (index) => {
    const updatedGoals = review.goals.filter((_, i) => i !== index);
    setReview({ ...review, goals: updatedGoals });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(review)
    // try {
    //   await axios.put(`/performance_review/${id}`, review);
    //   alert("Performance review updated successfully");
    //   //   navigate.push(`/performanceReview/${id}`);
    // } catch (error) {
    //   console.error(error);
    //   alert("Error updating performance review");
    // }
  };

  if (isLoading) {
    return <Spinner />;
  }

  const isSupervisor = auth?.role === "SUPERVISOR";
  const isEmployee = auth?.role === "EMPLOYEE";

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 mt-5 bg-white shadow-md rounded-lg"
    >
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-4">Performance Review Form</h2>
        <label className="block mb-2">(FY)</label>
        <select
          name="fy"
          value={review?.fy}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
          required
          disabled={isSupervisor}
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
        <label className="block mb-2">Name</label>
        <input
          type="text"
          name="name"
          value={review?.name}
          onChange={handleInputChange}
          placeholder="Name"
          className="w-full p-2 mb-4 border rounded"
          required
          disabled={isSupervisor}
        />
        <label className="block mb-2">Title</label>
        <input
          type="text"
          name="title"
          value={review?.title}
          onChange={handleInputChange}
          placeholder="Title"
          className="w-full p-2 mb-4 border rounded"
          required
          disabled={isSupervisor}
        />
        <label className="block mb-2">Manager</label>
        <input
          type="text"
          name="manager"
          value={review?.manager}
          onChange={handleInputChange}
          placeholder="Manager"
          className="w-full p-2 mb-4 border rounded"
          required
          disabled={isSupervisor}
        />
        <label className="block mb-2">Location</label>
        <input
          type="text"
          name="location"
          value={review?.location}
          onChange={handleInputChange}
          placeholder="Location"
          className="w-full p-2 mb-10 border rounded"
          required
          disabled={isSupervisor}
        />

        {review?.goals?.map((goal, index) => (
          <div key={index} className="mb-6 p-4 border rounded-lg bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Goal {index + 1}</h3>
              {/* {review?.goals?.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveGoal(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )} */}
            </div>
            <label className="block mb-2">Global Impact Area</label>
            <select
              name="globalImpactArea"
              value={goal?.globalImpactArea}
              onChange={(e) => handleInputChange(e, "goals", index)}
              className="w-full p-2 mb-4 border rounded"
              required
              disabled={isSupervisor}
            >
              <option value="">Select Global Impact Area</option>
              <option value="Locally Led">Locally Led</option>
              <option value="Globally Scaled">Globally Scaled</option>
              <option value="Foundational">Foundational</option>
              <option value="Gender Equal">Gender Equal</option>
            </select>
            <label className="block mb-2">Core Competency</label>
            <select
              name="coreCompetency"
              value={goal?.coreCompetency}
              onChange={(e) => handleInputChange(e, "goals", index)}
              className="w-full p-2 mb-4 border rounded"
              required
              disabled={isSupervisor}
            >
              <option value="">Select Core Competency</option>
              <option value="Communication">Communication</option>
              <option value="Delivering Results">Delivering Results</option>
            </select>
            <label className="block mb-2">Functional Competency</label>
            <input
              type="text"
              name="functionalCompetency"
              value={goal?.functionalCompetency}
              onChange={(e) => handleInputChange(e, "goals", index)}
              placeholder="Functional Competency"
              className="w-full p-2 mb-4 border rounded"
              required
              disabled={isSupervisor}
            />
            <label className="block mb-2">Key Tasks</label>
            <input
              type="text"
              name="keyTasks"
              value={goal?.keyTasks}
              onChange={(e) => handleInputChange(e, "goals", index)}
              placeholder="Key Tasks"
              className="w-full p-2 mb-4 border rounded"
              required
              disabled={isSupervisor}
            />
            <label className="block mb-2">Why is this important?</label>
            <input
              type="text"
              name="whyImportant"
              value={goal?.whyImportant}
              onChange={(e) => handleInputChange(e, "goals", index)}
              placeholder="Why is this important?"
              className="w-full p-2 mb-4 border rounded"
              required
              disabled={isSupervisor}
            />
            <label className="block mb-2">When will you accomplish it?</label>
            <input
              type="date"
              name="whenAccomplish"
              value={goal?.whenAccomplish}
              onChange={(e) => handleInputChange(e, "goals", index)}
              className="w-full p-2 mb-4 border rounded"
              required
              disabled={isSupervisor}
            />

            {goal?.quarterlyUpdates?.map((update, subIndex) => (
              <div
                key={subIndex}
                className="mb-4 p-4 border rounded-lg bg-white"
              >
                <h4 className="text-lg font-medium mb-2">Quarterly Updates</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold mb-2">Employee Updates</h5>
                    <input
                      type="text"
                      name="q1"
                      value={update?.employeeUpdates?.q1}
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
                      required
                      disabled={isSupervisor}
                    />
                    <input
                      type="text"
                      name="q2"
                      value={update?.employeeUpdates?.q2}
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
                      required
                      disabled={isSupervisor}
                    />
                    <input
                      type="text"
                      name="q3"
                      value={update?.employeeUpdates?.q3}
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
                      required
                      disabled={isSupervisor}
                    />
                    <input
                      type="text"
                      name="q4"
                      value={update?.employeeUpdates?.q4}
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
                      required
                      disabled={isSupervisor}
                    />
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2">Manager Updates</h5>
                    <input
                      type="text"
                      name="q1"
                      value={update?.managerUpdates?.q1}
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
                      disabled
                    />
                    <input
                      type="text"
                      name="q2"
                      value={update?.managerUpdates?.q2}
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
                      disabled={isEmployee}
                    />
                    <input
                      type="text"
                      name="q3"
                      value={update?.managerUpdates?.q3}
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
                      disabled={isEmployee}
                    />
                    <input
                      type="text"
                      name="q4"
                      value={update?.managerUpdates?.q4}
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
                      disabled={isEmployee}
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
                  value={goal?.employeeFeedback}
                  onChange={(e) => handleInputChange(e, "goals", index)}
                  placeholder="Employee Feedback"
                  className="w-full p-2 mb-4 border rounded"
                  disabled={isSupervisor}
                />
              </div>
              <div>
                <label className="block mb-2">Manager Feedback</label>
                <input
                  type="text"
                  name="managerFeedback"
                  value={goal?.managerFeedback}
                  onChange={(e) => handleInputChange(e, "goals", index)}
                  placeholder="Manager Feedback"
                  className="w-full p-2 mb-4 border rounded"
                  disabled={isEmployee}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Self-Rating</label>
                <select
                  name="selfRating"
                  value={goal?.selfRating}
                  onChange={(e) => handleInputChange(e, "goals", index)}
                  className="w-full p-2 mb-4 border rounded"
                  disabled={isSupervisor}
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
              </div>
              <div>
                <label className="block mb-2">Manager Rating</label>
                <select
                  name="managerRating"
                  value={goal?.managerRating}
                  onChange={(e) => handleInputChange(e, "goals", index)}
                  className="w-full p-2 mb-4 border rounded"
                  disabled={isEmployee}
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
        {/* <button
          type="button"
          onClick={handleAddGoal}
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-300"
        >
          Add Goal
        </button> */}
      </div>

      <div className="mb-10">
        <h2
          className="text-2xl font-bold mb-4 cursor-pointer"
          onClick={() => setIsMidYearCollapsed(!isMidYearCollapsed)}
        >
          Mid-Year Review? {isMidYearCollapsed ? "+" : "-"}
        </h2>
        {!isMidYearCollapsed && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Employee Comment</label>
              <input
                type="text"
                name="employeeComment"
                value={review?.employeeComment}
                onChange={handleInputChange}
                placeholder="Employee Comment"
                className="w-full p-2 mb-4 border rounded"
                disabled={isSupervisor}
              />
            </div>
            <div>
              <label className="block mb-2">Manager Comment</label>
              <input
                type="text"
                name="managerComment"
                disabled={isEmployee}
                value={review?.managerComment}
                onChange={handleInputChange}
                placeholder="Manager Comment"
                className="w-full p-2 mb-4 border rounded"
              />
            </div>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h2
          className="text-2xl font-bold mb-4 cursor-pointer"
          onClick={() => setIsYearEndCollapsed(!isYearEndCollapsed)}
        >
          Year-End Assessment {isYearEndCollapsed ? "+" : "-"}
        </h2>
        {!isYearEndCollapsed && (
          <>
            <h2 className="text-xl font-bold mb-4">Self-Assessment</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Major Accomplishments</label>
                <input
                  type="text"
                  name="self_majorAccomplishments"
                  value={review?.self_majorAccomplishments}
                  onChange={handleInputChange}
                  placeholder="Major Accomplishments"
                  className="w-full p-2 mb-4 border rounded"
                  disabled={isSupervisor}
                />
              </div>
              <div>
                <label className="block mb-2">Areas for Improvement</label>
                <input
                  type="text"
                  name="self_areasForImprovement"
                  value={review?.self_areasForImprovement}
                  onChange={handleInputChange}
                  placeholder="Areas for Improvement"
                  className="w-full p-2 mb-8 border rounded"
                  disabled={isSupervisor}
                />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-4">Manager Assessment</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Major Accomplishments</label>
                <input
                  type="text"
                  name="manag_majorAccomplishments"
                  value={review?.manag_majorAccomplishments}
                  onChange={handleInputChange}
                  placeholder="Major Accomplishments"
                  disabled={isEmployee}
                  className="w-full p-2 mb-4 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Areas for Improvement</label>
                <input
                  type="text"
                  name="manag_areasForImprovement"
                  value={review?.manag_areasForImprovement}
                  onChange={handleInputChange}
                  placeholder="Areas for Improvement"
                  className="w-full p-2 mb-4 border rounded"
                  disabled={isEmployee}
                />
              </div>
            </div>
            <label className="block mb-2">Overall Rating</label>
            <select
              name="overallRating"
              value={review?.overallRating}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 border rounded"
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

            <h2 className="text-xl font-bold mb-4">Sign Off</h2>
            <label className="block mb-2">Manager Signature</label>
            <input
              type="text"
              name="managerSignature"
              value={review?.managerSignature}
              onChange={handleInputChange}
              placeholder="Manager Signature"
              className="w-full p-2 mb-4 border rounded"
              disabled={isEmployee}
            />
            <label className="block mb-2">Date</label>
            <input
              type="date"
              name="managerDate"
              value={review?.managerDate}
              onChange={handleInputChange}
              placeholder="Date"
              className="w-full p-2 mb-4 border rounded"
              disabled={isEmployee}
            />
            <label className="block mb-2">Employee Signature</label>
            <input
              type="text"
              name="employeeSignature"
              value={review?.employeeSignature}
              onChange={handleInputChange}
              placeholder="Employee Signature"
              className="w-full p-2 mb-4 border rounded"
              disabled={isSupervisor}
            />
            <label className="block mb-2">Date</label>
            <input
              type="date"
              name="employeeDate"
              value={review?.employeeDate}
              onChange={handleInputChange}
              placeholder="Date"
              className="w-full p-2 mb-4 border rounded"
              disabled={isSupervisor}
            />
            <label className="block mb-2">Employee Comments</label>
            <input
              type="text"
              name="employeeComments"
              value={review?.employeeComments}
              onChange={handleInputChange}
              placeholder="Employee Comments"
              className="w-full p-2 mb-4 border rounded"
              disabled={isSupervisor}
            />
          </>
        )}
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition duration-300"
      >
        Update
      </button>
    </form>
  );
};

export default UpdatePerformanceReview;
