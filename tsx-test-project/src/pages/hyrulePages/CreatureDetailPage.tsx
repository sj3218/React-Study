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
            
            {/* category */}
            <div></div>
            {/* image */}
            <div></div>
            {/* description */}
            <div></div>
            {/* common_location */}
            <div></div>
            <div key={creature.id} className="grid grid-cols-2 bg-[#12161D] border rounded-2xl overflow-hidden border-[#00C3FF]/50 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.4)]">
                <div className="aspect-square bg-[#0A0C10] relative flex items-center justify-center p-8">
                    <div className="w-full h-full border border-[#1E2530] rounded-lg flex items-center justify-center bg-[#0d1117] group-hover:scale-105 transition-transform">
                        <span className="text-4xl  transition-all">
                            <img src={creature.image} alt={creature.name}/>
                        </span>
                    </div>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold">{creature.name.toUpperCase()}</h3>
                    <button className="text-gray-600">
                        {/* <Info size={18} /> */}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {creature.description}
                  </p>
                  <div className="pt-3 border-t border-[#1E2530] flex items-center text-[11px] text-gray-400">
                    {/* <Map size={12} className="mr-2" /> */}
                    <span className="truncate">
                        주요 서식지: {creature.common_locations?.join(', ') || '알 수 없음'}
                    </span>
                    <span className="truncate">
                        Drops: {creature.drops.join(', ')}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-[#1E2530] flex items-center text-[11px] text-gray-400">
                    {/* <Map size={12} className="mr-2" /> */}
                    <span className="truncate">
                        Drops: {creature.drops.join(', ')}
                    </span>
                  </div>
                </div>
            </div>
        </div>
    )
}

