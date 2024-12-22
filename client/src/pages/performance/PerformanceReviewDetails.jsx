import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePrivateAxios } from "../../HOOKS/usePrivateAxios";
import Spinner from "../../components/Spinner";
import { toast } from "sonner";
import { useGlobalProvider } from "../../HOOKS/useGlobalProvider";
import jsPDF from "jspdf";
import "jspdf-autotable";

const PerformanceReviewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const axios = usePrivateAxios();
  const { auth } = useGlobalProvider();

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
      await axios.post(`/api/performanceReview/${id}/approve`);
      alert("Performance review approved successfully");
      //   navigate.push("/");
    } catch (error) {
      console.error("Error approving performance review:", error);
      alert("Error approving performance review");
    }
  };

  const handleUpdate = () => {
    navigate(`/performance_reviews/${id}/update`);
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Performance Review Details", 14, 22);
    doc.setFontSize(12);
    doc.text(`Employee Name: ${review.employee.name}`, 14, 32);
    doc.text(`Title: ${review.title || "Title"}`, 14, 42);
    doc.text(`Manager: ${review.manager || "Manager"}`, 14, 52);

    review.goals.forEach((goal, index) => {
      doc.text(`Goal ${index + 1}`, 14, 62 + index * 10);
      doc.text(
        `Global Impact Area: ${goal.globalImpactArea || "Global Impact Area"}`,
        14,
        72 + index * 10
      );
      doc.text(
        `Core Competency: ${goal.coreCompetency || "Core Competency"}`,
        14,
        82 + index * 10
      );
      doc.text(
        `Functional Competency: ${
          goal.functionalCompetency || "Functional Competency"
        }`,
        14,
        92 + index * 10
      );
      doc.text(
        `Key Tasks: ${goal.keyTasks || "Key Tasks"}`,
        14,
        102 + index * 10
      );
      doc.text(
        `Why Important: ${goal.whyImportant || "Why Important"}`,
        14,
        112 + index * 10
      );
      doc.text(
        `When Accomplish: ${
          goal.whenAccomplish
            ? new Date(goal.whenAccomplish).toLocaleDateString()
            : "When Accomplish"
        }`,
        14,
        122 + index * 10
      );
      doc.text(
        `Employee Feedback: ${goal.employeeFeedback || "Employee Feedback"}`,
        14,
        132 + index * 10
      );
      doc.text(
        `Manager Feedback: ${goal.managerFeedback || "Manager Feedback"}`,
        14,
        142 + index * 10
      );
      doc.text(
        `Self Rating: ${goal.selfRating || "Self Rating"}`,
        14,
        152 + index * 10
      );
      doc.text(
        `Manager Rating: ${goal.managerRating || "Manager Rating"}`,
        14,
        162 + index * 10
      );
    });

    doc.text(
      `Employee Comment: ${review.employeeComment || "Employee Comment"}`,
      14,
      172
    );
    doc.text(
      `Manager Comment: ${review.managerComment || "Manager Comment"}`,
      14,
      182
    );
    doc.text(
      `Major Accomplishments: ${
        review.majorAccomplishments || "Major Accomplishments"
      }`,
      14,
      192
    );
    doc.text(
      `Areas for Improvement: ${
        review.areasForImprovement || "Areas for Improvement"
      }`,
      14,
      202
    );
    doc.text(
      `Overall Rating: ${review.overallRating || "Overall Rating"}`,
      14,
      212
    );
    doc.text(
      `Manager Signature: ${review.managerSignature || "Manager Signature"}`,
      14,
      222
    );
    doc.text(
      `Date: ${
        review.date ? new Date(review.date).toLocaleDateString() : "Date"
      }`,
      14,
      232
    );
    doc.text(
      `Employee Signature: ${review.employeeSignature || "Employee Signature"}`,
      14,
      242
    );
    doc.text(
      `Employee Comments: ${review.employeeComments || "Employee Comments"}`,
      14,
      252
    );

    doc.save("performance_review.pdf");
  };

  if (isLoading) {
    return <Spinner />;
  }

  const isSupervisor = auth?.role === "SUPERVISOR";

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Performance Review Details</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Employee Information</h2>
        <div className="mb-4">
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

        <h2 className="text-2xl font-semibold mt-8 mb-6">Goals</h2>
        {review?.goals?.map((goal, index) => (
          <div key={index} className="mb-6 p-6 border rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold mb-4">Goal {index + 1}</h3>
            <p className="text-lg mb-4">
              <strong>Global Impact Area:</strong> {goal?.globalImpactArea}
            </p>
            <p className="text-lg mb-4">
              <strong>Core Competency:</strong> {goal?.coreCompetency}
            </p>
            <p className="text-lg mb-4">
              <strong>Functional Competency:</strong>{" "}
              {goal?.functionalCompetency}
            </p>
            <p className="text-lg mb-4">
              <strong>Key Tasks:</strong> {goal?.keyTasks}
            </p>
            <p className="text-lg mb-4">
              <strong>Why Important:</strong> {goal?.whyImportant}
            </p>
            <p className="text-l mb-4">
              <strong>When Accomplish:</strong>{" "}
              {goal?.whenAccomplish
                ? new Date(goal?.whenAccomplish).toLocaleDateString()
                : ""}
            </p>
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

        <h2 className="text-2xl font-semibold mt-8 mb-6">
          Year-End Assessment
        </h2>
        <div className="mb-4">
          <h2 className="text-xl mb-2 ">
            <strong>Self Assessment</strong> {review?.majorAccomplishments}
          </h2>
          <p className="text-lg mb-4">
            <strong>Major Accomplishments:</strong>{" "}
            {review?.majorAccomplishments}
          </p>
          <p className="text-lg mb-7">
            <strong>Areas for Improvement:</strong>{" "}
            {review?.areasForImprovement}
          </p>
          <h2 className="text-xl mb-2 ">
            <strong>Manager Assessment</strong> {review?.majorAccomplishments}
          </h2>
          <p className="text-lg mb-4">
            <strong>Major Accomplishments:</strong>{" "}
            {review?.majorAccomplishments}
          </p>
          <p className="text-lg mb-4">
            <strong>Areas for Improvement:</strong>{" "}
            {review?.areasForImprovement}
          </p>
          <p className="text-lg mb-4">
            <strong>Overall Rating:</strong> {review?.overallRating}
          </p>
          <p className="text-lg mb-4">
            <strong>Manager Signature:</strong> {review?.managerSignature}
          </p>
          <p className="text-lg mb-4">
            <strong>Date:</strong>{" "}
            {review?.date ? new Date(review?.date).toLocaleDateString() : ""}
          </p>
          <p className="text-lg mb-4">
            <strong>Employee Signature:</strong> {review?.employeeSignature}
          </p>
          <p className="text-lg mb-4">
            <strong>Date:</strong>{" "}
            {review?.date ? new Date(review?.date).toLocaleDateString() : ""}
          </p>
          <p className="text-lg mb-4">
            <strong>Employee Comments:</strong> {review?.employeeComments}
          </p>
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

          {auth?.role === "HR" && (
            <button
              onClick={handleGeneratePDF}
              className="ml-4 py-2 px-6 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition duration-300"
            >
              Generate PDF
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceReviewDetails;
