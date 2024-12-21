import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { customStyle } from "../../utils/costumStyle";
import Spinner from "../../components/Spinner";
import { Add, Delete, Edit, Search } from "@mui/icons-material";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { usePrivateAxios } from "../../HOOKS/usePrivateAxios";
import CustomButton from "../../components/Buttons/CustomButton";
import { useNavigate } from "react-router-dom";

const ListEmployee = () => {
  const [employees, setEmployees] = useState();
  const [filterEmployees, setFilterEmployees] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const Axios = usePrivateAxios();
  const navigate = useNavigate();

  const columns = [
    {
      name: "Name",
      selector: (row) => row?.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row?.email,
      sortable: true,
    },
    {
      name: "Title",
      selector: (row) => row?.title,
      sortable: true,
    },
    {
      name: "Location",
      selector: (row) => row?.location,
      sortable: true,
    },
    {
      name: "Assigned supervisor",
      selector: (row) => row?.supervisor?.name,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => {
        return (
          <div className="flex items-center space-x-5">
            <Edit
              className="hover:cursor-pointer text-blue-400"
              style={{ fontSize: "18px" }}
              onClick={() => navigate(`/employees/${row?.id}`)}
            />
            <Delete
              className="hover:cursor-pointer text-red-600"
              style={{ fontSize: "18px" }}
              onClick={() => handleDelete(row.id)}
            />
          </div>
        );
      },
      sortable: true,
    },
  ];

  useEffect(() => {
    const getEmployees = async () => {
      setIsLoading(true);
      try {
        const { data } = await Axios.get("/employee");
        console.log(data?.msg)
        setEmployees(data?.msg);
        setFilterEmployees(data?.msg);
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
    getEmployees();
  }, []);

  const deleteEmployee = async (id) => {
    try {
      const { data } = await Axios.delete(`/employee/${id}`);
      if (data?.msg) {
        setEmployees((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error);
      } else {
        console.log(error);
      }
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Employee",
      text: "Are you sure you want to delete this?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteEmployee(id);
      }
    });
  };

  const handleSearch = (e) => {
    const searchData = filterEmployees?.filter((employee) => {
      return e.target.value.toLowerCase() === ""
        ? employee
        : employee.name.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setEmployees(searchData);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div>
        <div className="mx-5 mt-7 space-y-2">
          <h1 className="text-lg text-bold font-medium mb-3">
            Manage Employees
          </h1>
          <div className="flex items-start justify-between">
            <CustomButton
              url="/employees/new"
              text="Add new"
              icon={
                <Add
                  className="text-white icon font-semibold"
                  style={{ fontSize: "18px" }}
                />
              }
            />
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
          {employees && (
            <DataTable
              className="border"
              columns={columns}
              data={employees}
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

export default ListEmployee;
