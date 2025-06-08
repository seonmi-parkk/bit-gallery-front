import { Link } from "react-router"
import { getKakaoLink } from "../../api/kakaoApi"

const KakaoLoginComponent = () => {

  const link = getKakaoLink()

  return (
    <div className="flex flex-col">
      <div className="flex justify-center w-full">
        <Link to={link}>
          <div className="px-2 py-4 text-lg text-center font-medium w-34 text-white bg-yellow-400 rounded">
            KAKAO LOGIN
          </div>
        </Link>
      </div>
    </div>
  )
}

export default KakaoLoginComponent