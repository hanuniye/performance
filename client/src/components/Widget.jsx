import { KeyboardArrowUp } from "@mui/icons-material"

const Widget = ({title, isCount , link , icon}) => {
  let bottomStyle = '';

  switch(title) {
    case "All performances":
      bottomStyle = "bottom self-end flex justify-center items-center p-1 text-userColor bg-userBg rounded-md";
      break;
    case "submitted performances":
      bottomStyle = "bottom self-end flex justify-center items-center p-1  text-balanceColor bg-balanceBg rounded-md";
      break;
    case "in-review performances":
      bottomStyle = "bottom self-end flex justify-center items-center p-1 text-orderColor bg-orderBg rounded-md";
      break;
    case "approved performances":
      bottomStyle = "bottom self-end flex justify-center items-center p-1 text-earningColor bg-earningBg  rounded-md";
      break;
    default :
      break;
    
  }
  
  return (
    <div className="widget flex justify-between w-full p-3 h-32 rounded-md shadow-lg md:w-1/4">
      <div className="left flex flex-col justify-between">
        <p className="text-sm font-semibold capitalize text-blackLight">{title}</p>
        <h6 className="text-3xl font-normal">{isCount ? isCount : 0}</h6>
        <p className="text-sm capitalize cursor-pointer">{link}</p>
      </div>
      <div className="right flex flex-col justify-between"> 
      <div className={bottomStyle}>
        {icon}
      </div>
      </div>
    </div>
  )
}

export default Widget
