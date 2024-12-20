import { KeyboardArrowDown, MoreVert } from "@mui/icons-material";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Featured = () => {
  return (
    <div className="shadow-lg p-3 space-y-6 md:w-1/3">

      <div className="top flex justify-between items-center">
        <h1 className="text-lg capitalize text-blackLight">total revenue</h1>
        <MoreVert className="text-blackLight text-lg" />
      </div>

      <div className="middle flex flex-col items-center text-center space-y-3">
        <div className="w-28">
          <CircularProgressbar value={60} text="60%" strokeWidth={5} />
        </div>
        <h6 className="text-sm capitalize text-blackLight">
          total sales made today
        </h6>
        <h1 className="text-3xl">$200</h1>
        <p className="text-blackLight text-sm capitalize">
          previouse transactions processing last payments may not be included.
        </p>
      </div>

      <div className="bottom flex justify-between">
        {/* left  */}
        <div className="left flex flex-col items-start space-y-3">
          <h6 className="text-blackLight font-medium">Target</h6>
          <div className="flex items-center">
            <KeyboardArrowDown style={{ fontSize: "18px", color: "red" }} />
            <p className="text-sm text-red-600">$12.4k</p>
          </div>
        </div>
        
        {/* middle  */}
        <div className="middle flex flex-col items-start space-y-3">
          <h6 className="text-blackLight font-medium">last week</h6>
          <div className="flex items-center">
            <KeyboardArrowDown
              className="text-green-500"
              style={{ fontSize: "18px" }}
            />
            <p className="text-sm text-green-500">$12.4k</p>
          </div>
        </div>

        {/* right  */}
        <div className="right flex flex-col items-start space-y-3">
          <h6 className="text-blackLight font-medium">last month</h6>
          <div className="flex items-center">
            <KeyboardArrowDown
              className="text-green-500"
              style={{ fontSize: "18px" }}
            />
            <p className="text-sm text-green-500">$12.4k</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
