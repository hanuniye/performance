import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usePrivateAxios } from "../../HOOKS/usePrivateAxios";
import { toast } from "sonner";
import CustomButton from "../../components/Buttons/CustomButton";
import { Search, Add } from "@mui/icons-material";
import Spinner from "../../components/Spinner";
import DataTable from "react-data-table-component";
import { customStyle } from "../../utils/costumStyle";
import { useGlobalProvider } from "../../HOOKS/useGlobalProvider";

const PerformanceReviewsList = () => {
  const [performanceReviews, setPerformanceReviews] = useState();
  const [filterPerformanceReviews, setFilterPerformanceReviews] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const Axios = usePrivateAxios();
  const { auth } = useGlobalProvider();

  const columns = [
    {
      name: "Employee name",
      selector: (row) => row?.employee?.name,
      sortable: true,
    },
    {
      name: "Supervisor",
      selector: (row) => row?.employee?.supervisor?.name,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => {
       return  <div className={`${row?.status} rounded-full px-2`}>{row?.status}</div>;
      },
      sortable: true,
    },
    {
      name: "Created Date",
      selector: (row) => new Date(row?.createdAt).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => {
        return (
          <Link
            to={`/performance_reviews/${row?.id}/details`}
            className="text-blue-500 hover:underline"
          >
            View Details
          </Link>
        );
      },
      sortable: true,
    },
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const response = await Axios.get("/performance_review");
        setPerformanceReviews(response.data?.msg);
        setFilterPerformanceReviews(response.data?.msg);
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

    fetchReviews();
  }, []);

  const handleSearch = (e) => {
    const searchData = filterPerformanceReviews?.filter((performance) => {
      return e.target.value.toLowerCase() === ""
        ? performance
        : performance?.employee?.name
            .toLowerCase()
            .includes(e.target.value.toLowerCase());
    });
    setPerformanceReviews(searchData);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div>
        <div className="mx-5 mt-7 space-y-2">
          <h1 className="text-lg text-bold font-medium mb-3">
            Manage Performance Review
          </h1>
          <div className="flex items-start justify-between">
            {auth?.role === "EMPLOYEE" && (
              <CustomButton
                url="/performance_reviews/new"
                text="Add new"
                icon={
                  <Add
                    className="text-white icon font-semibold"
                    style={{ fontSize: "18px" }}
                  />
                }
              />
            )}
            <div className="border-2 px-2 md:block">
              <input
                type="text"
                className="search outline-none"
                placeholder="search by name"
                onChange={handleSearch}
              />
              <Search style={{ fontSize: "18px" }} />
            </div>
          </div>
          {performanceReviews && (
            <DataTable
              className="border"
              columns={columns}
              data={performanceReviews}
              selectableRows
              pagination
              fixedHeader
              customStyles={customStyle}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default PerformanceReviewsList;
