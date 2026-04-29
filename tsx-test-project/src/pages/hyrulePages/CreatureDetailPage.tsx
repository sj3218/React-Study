import { useParams } from "react-router-dom"
import { type Creature } from "../../types/hyrule/types";
import { transformCreaturesData } from "../../utils/hyrule/HyruleTransform";

export const CreatureDetailPage = () =>{
    const {id} = useParams();
    const storedData = sessionStorage.getItem("creaturesData");

    if(!storedData)
    {
        return <div>데이터가 없다</div>;
    }

    const rawData = JSON.parse(storedData);
    const transformedData = transformCreaturesData(rawData);
    console.log(id);
    const creature = transformedData.find((item: Creature) => String(item.id) === String(id));

    if (!creature) return <div>데이터 로드 중... ({id})</div>;

    return(
        <div className="px-10 py-8 flex-1 bg-[#0F172A] text-white">

        </div>
    )
}