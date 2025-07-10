import { Link } from "react-router"
import { getKakaoLink } from "../../api/kakaoApi"

const KakaoLoginComponent = () => {

  const link = getKakaoLink()

  return (
    <div className="flex items-stretch h-full">
      <Link to={link} className="flex justify-center items-center w-full h-full bg-yellow-400 rounded">
        <div className="px-2 py-2 text-center font-medium text-white">
          KAKAO
        </div>
      </Link>
    </div>
  )
}

export default KakaoLoginComponent