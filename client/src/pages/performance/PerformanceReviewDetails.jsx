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
import "../../index.css"

const PerformanceReviewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const axios = usePrivateAxios();
  const { auth } = useGlobalProvider();
  const componentRef = useRef();

  useEffect(() => {
    const fetchReview = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/performance_review/${id}`);
        setReview(response.data?.msg);
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

  const handleApprove = async () => {
    try {
      const response = await axios.post(`/performance_review/${id}/approve`);
      setReview(response.data?.msg);
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
      setReview(response.data?.msg);
      toast.success("Performance is In-Review");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error);
      } else {
        console.log(error);
      }
    }
  };

  const handleUpdate = () => {
    navigate(`/performance_reviews/${id}/update`);
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Performance Review Details",
    onAfterPrint: () => toast.success("Printed successfully!"),
  });

  if (isLoading) {
    return <Spinner />;
  }

  const isSupervisor = auth?.role === "SUPERVISOR";

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div ref={componentRef} className="bg-white p-8 rounded-lg shadow-md print-container">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Performance Review Details
          </h2>
          <div className="mb-4 flex items-start justify-between">
            <div className="right">
              <p className="text-lg mb-2">
                <strong>Name:</strong> {review?.employee?.name}
              </p>
              <p className="text-lg mb-2">
                <strong>Title:</strong> {review?.title}
              </p>
              <p className="text-lg mb-2">
                <strong>Manager:</strong> {review?.manager}
              </p>
              <p className="text-lg mb-2">
                <strong>Location:</strong> {review?.location}
              </p>
            </div>
            <div className="left overflow-hidden">
              <img src="/care.png" alt="" className="w-[150px] h-[150px]" />
            </div>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-6">Goals</h2>
          {review?.goals?.map((goal, index) => (
            <div key={index} className="mb-20 p-6 border rounded-lg bg-gray-50">
              <h3 className="text-xl font-semibold mb-4">Goal {index + 1}</h3>
              <p className="text-lg mb-4">
                <strong>Global Impact Area:</strong> {goal?.globalImpactArea}
              </p>
              <p className="text-lg mb-4">
                <strong>Core Competency:</strong> {goal?.coreCompetency}
              </p>
              <p className="text-lg mb-4 whitespace-pre-wrap break-words">
                <strong>Functional Competency:</strong>{" "}
                {goal?.functionalCompetency}
              </p>
              <p className="text-lg mb-4 whitespace-pre-wrap break-words">
                <strong>Key Tasks:</strong> {goal?.keyTasks}
              </p>
              <p className="text-lg mb-4 whitespace-pre-wrap break-words">
                <strong>Why Important:</strong> {goal?.whyImportant}
              </p>
              <p className="text-l mb-4">
                <strong>When Accomplish:</strong>{" "}
                {goal?.whenAccomplish
                  ? new Date(goal?.whenAccomplish).toLocaleDateString()
                  : ""}
              </p>
              <div className="mb-4">
                <p className="text-lg mb-2">
                  <strong>Quarterly Updates:</strong>
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold mb-2">Employee Updates</h5>
                    <p className="text-lg mb-2">
                      <strong>Q1:</strong> {goal.employeeQ1}
                    </p>
                    <p className="text-lg mb-2">
                      <strong>Q2:</strong> {goal.employeeQ2}
                    </p>
                    <p className="text-lg mb-2">
                      <strong>Q3:</strong> {goal.employeeQ3}
                    </p>
                    <p className="text-lg mb-2">
                      <strong>Q4:</strong> {goal.employeeQ4}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2">Manager Updates</h5>
                    <p className="text-lg mb-2">
                      <strong>Q1:</strong> {goal.managerQ1}
                    </p>
                    <p className="text-lg mb-2">
                      <strong>Q2:</strong> {goal.managerQ2}
                    </p>
                    <p className="text-lg mb-2">
                      <strong>Q3:</strong> {goal.managerQ3}
                    </p>
                    <p className="text-lg mb-2">
                      <strong>Q4:</strong> {goal.managerQ4}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-lg mb-4">
                <strong>Employee Feedback:</strong> {goal?.employeeFeedback}
              </p>
              <p className="text-lg mb-4">
                <strong>Manager Feedback:</strong> {goal?.managerFeedback}
              </p>
              <p className="text-lg mb-4">
                <strong>Self Rating:</strong> {goal?.selfRating}
              </p>
              <p className="text-lg mb-4">
                <strong>Manager Rating:</strong> {goal?.managerRating}
              </p>
            </div>
          ))}

          <h2 className="text-2xl font-semibold mt-8 mb-6">Mid-Year Review</h2>
          <div className="mb-4">
            <p className="text-lg mb-4">
              <strong>Employee Comment:</strong> {review?.employeeComment}
            </p>
            <p className="text-lg mb-4">
              <strong>Manager Comment:</strong> {review?.managerComment}
            </p>
          </div>

          <h2 className="text-2xl font-semibold mt-10 mb-6">
            Year-End Assessment
          </h2>
          <div className="mb-4">
            <h2 className="text-xl mb-2 ">
              <strong>Self Assessment</strong> {review?.majorAccomplishments}
            </h2>
            <p className="text-lg mb-4">
              <strong>Major Accomplishments:</strong>{" "}
              {review?.self_majorAccomplishments}
            </p>
            <p className="text-lg mb-7">
              <strong>Areas for Improvement:</strong>{" "}
              {review?.self_areasForImprovement}
            </p>
            <h2 className="text-xl mb-2 ">
              <strong>Manager Assessment</strong> {review?.majorAccomplishments}
            </h2>
            <p className="text-lg mb-4">
              <strong>Major Accomplishments:</strong>{" "}
              {review?.manag_majorAccomplishments}
            </p>
            <p className="text-lg mb-4">
              <strong>Areas for Improvement:</strong>{" "}
              {review?.manag_areasForImprovement}
            </p>
            <p className="text-lg mb-4">
              <strong>Overall Rating:</strong> {review?.overallRating}
            </p>
            <p className="text-lg mb-4">
              <strong>Manager Signature:</strong> {review?.managerSignature}
            </p>
            <p className="text-lg mb-4">
              <strong>Date:</strong>{" "}
              {review?.managerDate
                ? new Date(review?.managerDate).toLocaleDateString()
                : ""}
            </p>
            <p className="text-lg mb-4">
              <strong>Employee Signature:</strong> {review?.employeeSignature}
            </p>
            <p className="text-lg mb-4">
              <strong>Date:</strong>{" "}
              {review?.employeeDate
                ? new Date(review?.employeeDate).toLocaleDateString()
                : ""}
            </p>
            <p className="text-lg mb-4">
              <strong>Employee Comments:</strong> {review?.employeeComments}
            </p>
            <p className="text-lg mb-4">
              <strong>Status:</strong> {review?.status}
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          {auth?.role === "SUPERVISOR" && (
            <button
              onClick={handleApprove}
              className="py-2 px-6 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition duration-300"
            >
              Approve
            </button>
          )}
          {auth?.role !== "HR" && (
            <button
              onClick={handleUpdate}
              className="ml-4 py-2 px-6 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-300"
            >
              Update
            </button>
          )}

          {auth?.role === "HR" && review?.status === "APPROVED" && (
            <button
              onClick={handleReview}
              className="ml-4 py-2 px-6 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-300"
            >
              In-Review
            </button>
          )}

          {auth?.role === "HR" && (
            <button
              onClick={handlePrint}
              className="ml-4 py-2 px-6 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition duration-300"
            >
              Print
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceReviewDetails;
