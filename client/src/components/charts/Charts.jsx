import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Charts = () => {
  const data = [
    {
      name: "Jan",
      total: 1200,
    },
    {
      name: "Feb",
      total: 2100,
    },
    {
      name: "March",
      total: 800,
    },
    {
      name: "April",
      total: 1600,
    },
    {
      name: "May",
      total: 900,
    },
    {
      name: "Jun",
      total: 1700,
    },
  ];

  return (
    <div className="shadow-lg md:w-2/3 px-4 py-3">
      <p className="text-lg text-blackLight capitalize">last six months (revanue)</p>
      <ResponsiveContainer width="100%" height="92%">
        <AreaChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#8884d8"
            fill="#8884d8"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Charts;
