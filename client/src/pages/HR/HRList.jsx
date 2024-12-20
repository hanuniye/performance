import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { customStyle } from "../../utils/costumStyle";
import Spinner from "../../components/Spinner";
import { Add, Delete, Edit } from "@mui/icons-material";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { usePrivateAxios } from "../../HOOKS/usePrivateAxios";
import CustomButton from "../../components/Buttons/CustomButton";
import { useNavigate } from "react-router-dom";

const HRList = () => {
  const [HRS, setHRS] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const Axios = usePrivateAxios();
  const navigate = useNavigate();

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
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
              onClick={() => navigate(`/HR/${row?.id}`)}
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
    const getHRs = async () => {
      setIsLoading(true);
      try {
        const { data } = await Axios.get("/HR");
        setHRS(data.msg);
      } catch (error) {
        if (error.response) {
          console.log(error.response)
          toast.error(error.response.data.error);
        } else {
          console.log(error);
        }
      } finally {
        setIsLoading(false);
      }
    };
    getHRs();
  }, []);

  const deleteHR = async (id) => {
    try {
      const { data } = await Axios.delete(`/HR/${id}`);
      if (data?.msg) {
        setHRS((prev) => prev.filter((item) => item.id !== id));
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
      title: "Delete HR",
      text: "Are you sure you want to delete this?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteHR(id);
      }
    });
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div>
        <div className="mx-5 mt-7 space-y-2">
          <h1 className="text-lg text-bold font-medium mb-3">Manage HR</h1>
          <CustomButton
            url="/HR/new"
            text="Add new"
            icon={
              <Add
                className="text-white icon font-semibold"
                style={{ fontSize: "18px" }}
              />
            }
          />
          {HRS && (
            <DataTable
              className="border"
              columns={columns}
              data={HRS}
              selectableRows
              pagination
              fixedHeader
              customStyles={customStyle}
            />
          )}
        </div>

        {/* <HRModal onClose={onClose} visible={visible} id={id} /> */}
      </div>
    </>
  );
};

export default HRList;
