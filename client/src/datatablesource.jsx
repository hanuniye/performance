export const userColumns = [
  { field: "id", headerName: "ID", width: 60 },
  {
    field: "user",
    headerName: "User",
    width: 170,
    renderCell: (params) => {
      return (
        <div className="flex items-center space-x-4">
          <img
            className="w-10 h-10 rounded-full"
            src={params.row.img}
            alt="avatar"
          />
          <p>{params.row.username}</p>
        </div>
      );
    },
  },
  { field: "email", headerName: "Email", width: 160 },
  { field: "phone", headerName: "Phone", width: 100 },
  { field: "address", headerName: "Address", width: 120 },
  { field: "country", headerName: "Country", width: 100 },
  {
    field: "status",
    headerName: "Status",
    width: 100,
    renderCell: (params) => {
      return (
        <div className={`${params.row.status} px-2 py-0 rounded-full text-white`}>
          {params.row.status}
        </div>
      );
    },
  },
];

export const productColumns = [
  { field: "id", headerName: "ID", width: 60 },
  {
    field: "name",
    headerName: "ProductName",
    width: 170,
  },
  {
    field: "image",
    headerName: "Image",
    width: 170,
    renderCell: (params) => {
      return (
        <div>
          <img
            className="w-10 h-10 rounded-full"
            src={params.row.img}
            alt="avatar"
          />
        </div>
      );
    },
  },
  { field: "price", headerName: "Price", width: 100 },
  {
    field: "status",
    headerName: "Status",
    width: 100,
    renderCell: (params) => {
      return (
        <div className={`${params.row.status} px-2 py-0 rounded-full text-white`}>
          {params.row.status}
        </div>
      );
    },
  },
];

export const userRows = [
  {
    id: 1,
    username: "Snow",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    status: "active",
    email: "1snow@gmail.com",
    phone: 907878787,
    country: "somalia",
    address: "mogadishu, killometer 4"
  },
  {
    id: 2,
    username: "Jamie Lannister",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "2snow@gmail.com",
    status: "passive",
    phone: 907878787,
    country: "somalia",
    address: "mogadishu, killometer 4"
  },
  {
    id: 3,
    username: "Lannister",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "3snow@gmail.com",
    status: "pending",
    phone: 907878787,
    country: "somalia",
    address: "mogadishu, killometer 4"
  },
  {
    id: 4,
    username: "Stark",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "4snow@gmail.com",
    status: "active",
    phone: 907878787,
    country: "somalia",
    address: "mogadishu, killometer 4"
  },
  {
    id: 5,
    username: "Targaryen",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "5snow@gmail.com",
    status: "passive",
    phone: 907878787,
    country: "somalia",
    address: "mogadishu, killometer 4"
  },
  {
    id: 6,
    username: "Melisandre",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "6snow@gmail.com",
    status: "active",
    phone: 907878787,
    country: "somalia",
    address: "mogadishu, killometer 4"
  },
  {
    id: 7,
    username: "Clifford",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "7snow@gmail.com",
    status: "passive",
    phone: 907878787,
    country: "somalia",
    address: "mogadishu, killometer 4"
  },
  {
    id: 8,
    username: "Frances",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "8snow@gmail.com",
    status: "active",
    phone: 907878787,
    country: "somalia",
    address: "mogadishu, killometer 4"
  },
  {
    id: 9,
    username: "Roxie",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "snow@gmail.com",
    status: "pending",
    phone: 907878787,
    country: "somalia",
    address: "mogadishu, killometer 4"
  },
  {
    id: 10,
    username: "Roxie",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "snow@gmail.com",
    status: "active",
    phone: 907878787,
    country: "somalia",
    address: "mogadishu, killometer 4"
  },
];
