import { Navigate } from "react-router-dom";

// protecting all the pages
const ProtectedPage = ({ children }) => {
  const auth = localStorage.getItem("jwt-auth");
  // if loged in then return the children or navigte to login page
  if (auth) {
    return <>{children}</>;
  }
  return <Navigate to="/auth/login" />;
};

export default ProtectedPage;
