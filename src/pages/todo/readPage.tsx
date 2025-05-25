import { useParams } from "react-router";
import ReadComponent from "../../components/\btodo/readComponent";

function ReadPage() {

  // 구조분해할당을 이용해서 tno변수 가져옴.
  const {tno} = useParams()

  console.log(tno);

  return (
    <div className="bg-white w-full">
      <div className="text-4xl">Todo Read Page {tno}</div>
      <ReadComponent tno={Number(tno)}/> {/*tno={3}*/}
    </div>
  );
}

export default ReadPage;