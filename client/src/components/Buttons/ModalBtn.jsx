import { Add } from "@mui/icons-material";

const ModalBtn = ({ setVisible, title, setId, bg, color  }) => {
  return (
    <div
      className={`flex items-center justify-center space-x-1 ${
        bg ? bg : "bg-blue-400"
      } w-fit py-1 px-2 rounded-sm hover:cursor-pointer`}
      onClick={() => {
        setVisible(true);
        setId("");
      }}
    >
      <h5 className={`text-sm ${color ? color : "text-white"} font-medium`}>
        {title}
      </h5>
      <Add
        className="hover:cursor-pointer text-white"
        style={{ fontSize: "20px" }}
      />
    </div>
  );
};

export default ModalBtn;
