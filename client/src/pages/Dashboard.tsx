import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { getUsersThunk } from "@features/user";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getUsersThunk());
  }, []);
  return <div>Dashboard</div>;
};

export default Dashboard;
