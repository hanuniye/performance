import {
  AccountBalanceWalletOutlined,
  BookTwoTone,
  ChatRounded,
  MonetizationOnOutlined,
  People,
  Person,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import Widget from "../../components/Widget";
import { useGlobalProvider } from "../../HOOKS/useGlobalProvider";
import { usePrivateAxios } from "../../HOOKS/usePrivateAxios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Home = () => {
  const [performanceReview, setPerformanceReviews] = useState();
  const { auth } = useGlobalProvider();
  const Axios = usePrivateAxios();
  console.log(performanceReview);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await Axios.get("/performance_review");
        setPerformanceReviews(response.data?.msg);
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.error);
        } else {
          console.log(error);
        }
      }
    };

    fetchReviews();
  }, []);

  const isHr = auth?.role === "HR";

  return (
    <>
      {isHr ? (
        // for HR
        <div className="widgets flex flex-col space-y-5 px-3 mt-6 md:space-y-0 md:space-x-5 md:flex-row">
          <Widget
            title="All performances"
            isCount={performanceReview?.length}
            link="All performances"
            icon={<People style={{ fontSize: "18px" }} />}
          />
          <Widget
            title="submitted performances"
            isCount={
              performanceReview?.filter(
                (performanceReview) => performanceReview.status === "SUBMITTED"
              ).length
            }
            link="submitted performances"
            icon={<ChatRounded style={{ fontSize: "18px" }} />}
          />
          <Widget
            title="in-review performances"
            isCount={
              performanceReview?.filter(
                (performanceReview) => performanceReview.status === "IN_REVIEW"
              ).length
            }
            link="in-review performances"
            icon={<BookTwoTone style={{ fontSize: "18px" }} />}
          />
          <Widget
            title="approved performances"
            isCount={
              performanceReview?.filter(
                (performanceReview) => performanceReview.status === "APPROVED"
              ).length
            }
            link="approved performances"
            icon={<AccountBalanceWalletOutlined style={{ fontSize: "18px" }} />}
          />
        </div>
      ) : (
        // for Others
        <div className="px-3 mt-6">
          <h1 className="text-3xl font-semibold">
            Welcome, <span className="text-lg"> {auth?.userData?.name}</span>{" "}
          </h1>
        </div>
      )}

      {/* <div className="charts flex flex-col space-y-5 px-3 pb-8 mt-6 md:space-x-5 md:space-y-0 md:flex-row">
        <Featured />
        <Charts />
      </div> */}
    </>
  );
};

export default Home;
