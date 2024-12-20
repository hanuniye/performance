import { KeyboardArrowUp } from "@mui/icons-material"

const Widget = ({title, isMoney , link , icon}) => {
  let bottomStyle = '';

  switch(title) {
    case "users":
      bottomStyle = "bottom self-end flex justify-center items-center p-1 text-userColor bg-userBg rounded-md";
      break;
    case "earning":
      bottomStyle = "bottom self-end flex justify-center items-center p-1 text-earningColor bg-earningBg rounded-md";
      break;
    case "order":
      bottomStyle = "bottom self-end flex justify-center items-center p-1 text-orderColor bg-orderBg rounded-md";
      break;
    case "balance":
      bottomStyle = "bottom self-end flex justify-center items-center p-1 text-balanceColor bg-balanceBg rounded-md";
      break;
    default :
      break;
    
  }
  
  return (
    <div className="widget flex justify-between w-full p-3 h-32 rounded-md shadow-lg md:w-1/4">
      <div className="left flex flex-col justify-between">
        <p className="text-sm font-semibold uppercase text-blackLight">{title}</p>
        <h6 className="text-3xl font-normal">{isMoney ? `$ 100` : 100}</h6>
        <p className="text-sm capitalize cursor-pointer">{link}</p>
      </div>
      <div className="right flex flex-col justify-between"> 
      <div className="top flex space-x-1 text-green-700">
        <KeyboardArrowUp />
        <h6>20</h6>
        <h6>%</h6>
      </div>
      <div className={bottomStyle}>
        {icon}
      </div>
      </div>
    </div>
  )
}

export default Widget
