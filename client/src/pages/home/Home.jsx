import {
  AccountBalanceWalletOutlined,
  MonetizationOnOutlined,
  Person,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import Widget from "../../components/Widget";
// import Featured from "../../components/ucharts/Featured";
// import Charts from "../../components/ui/charts/Charts";

const Home = () => {
  return (
    <>
      <div className="widgets flex flex-col space-y-5 px-3 mt-6 md:space-y-0 md:space-x-5 md:flex-row">
        <Widget
          title="users"
          isMoney={false}
          link="see all users"
          icon={<Person style={{ fontSize: "18px" }} />}
        />
        <Widget
          title="order"
          isMoney={false}
          link="view all orders"
          icon={<ShoppingCartOutlined style={{ fontSize: "18px" }} />}
        />
        <Widget
          title="earning"
          isMoney={true}
          link="view net earning"
          icon={<MonetizationOnOutlined style={{ fontSize: "18px" }} />}
        />
        <Widget
          title="balance"
          isMoney={false}
          link="see all details"
          icon={<AccountBalanceWalletOutlined style={{ fontSize: "18px" }} />}
        />
      </div>
      {/* <div className="charts flex flex-col space-y-5 px-3 pb-8 mt-6 md:space-x-5 md:space-y-0 md:flex-row">
        <Featured />
        <Charts />
      </div> */}
    </>
  );
};

export default Home;