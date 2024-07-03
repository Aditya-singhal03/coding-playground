import { useAuth } from "../provider/auth";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { user ,loading} = useAuth();
  console.log(user , loading);

  if(loading){
    return (
      <div className="flex justify-center items-center">
        <p>loading</p>
      </div>
    )
  }
  if (!user) return <Navigate to="/auth" />;
  return <Outlet/>;

}

export default ProtectedRoute;
