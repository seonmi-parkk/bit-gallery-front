import AddComponent from "../../components/products/addComponent";
import useCustomLogin from "../../hooks/useCustomLogin";
import { useEffect } from "react";

const AddPage = () => {
  const {loginStatus, moveToLogin} = useCustomLogin()

  useEffect(() => {
    if (loginStatus !== "fulfilled") {
      alert("로그인이 필요합니다.");
      moveToLogin();
    }
  }, [loginStatus]);

  return (
    <div className="p-4 w-full bg-white">
      <div className="text-3xl font-extrabold">
        Products Add Page
      </div>
      <AddComponent/>
    </div>
  );
}

export default AddPage;