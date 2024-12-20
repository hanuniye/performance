import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from "../datatablesource";
import { Link } from "react-router-dom";
import { memo } from "react";

const DataTable = () => {
  const actionBtns = 
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="flex items-center space-x-2">
            <Link to={`/users/${params.row.id}`}>
            <div className="text-blue px-2 py-1 border border-dotted border-blue-300 rounded-sm cursor-pointer">Update</div>
            </Link>
            <div className="text-crimson px-2 py-1 border border-dotted border-red-300 rounded-sm cursor-pointer">Delete</div>
          </div>
        );
      },
    };
  
  
  return (
    <div className="px-5 mt-10" style={{ width: "100%" }}>
      <DataGrid
      
        rows={userRows}
        columns={[...userColumns, actionBtns]}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10, 15, 20]}
        checkboxSelection
      />
    </div>
  );
};
export default memo(DataTable) ;
