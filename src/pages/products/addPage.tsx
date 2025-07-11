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
    <div className="max-w-[900px] m-auto w-full">
      <div className="text-3xl text-center font-bold">
        상품 등록
      </div>
      <AddComponent/>
    </div>
  );
}

export default AddPage;