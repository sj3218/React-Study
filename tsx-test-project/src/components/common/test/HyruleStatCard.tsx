import { Link, useNavigate } from "react-router-dom";
import type { BaseItem } from "../../../types/hyrule/types"
import { Map, Info} from 'lucide-react';

export const HyruleStatCard = ({item} : {item:BaseItem}) => {
  // const navigate = useNavigate();
  // const handleCardClick = () =>
  // {
  //   navigate('/creatures/${item.id}');
  // };

    return (
      <Link to={`/creatures/${item.id}`}>
          <div key={item.id} className="group bg-[#12161D] border border-[#1E2530] rounded-2xl overflow-hidden hover:border-[#00C3FF]/50 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)]">
                <div className="aspect-square bg-[#0A0C10] relative flex items-center justify-center p-8">
                  <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_#00C3FF_0%,_transparent_70%)]"></div>
                  <div className="w-full h-full border border-[#1E2530] rounded-lg flex items-center justify-center bg-[#0d1117] group-hover:scale-105 transition-transform">
                    {/* Placeholder for Zelda Image */}
                    <span className="text-4xl grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                      {/* {item.category === 'monsters' ? '👹' : item.category === 'equipments' ? '⚔️' : '🍎'} */}
                      <img src={item.image} alt={item.name}/>
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded text-[10px] font-mono text-[#00C3FF]">
                    #{item.id.toString().padStart(3, '0')}
                  </div>
                </div>
                
                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold group-hover:text-[#00C3FF] transition-colors">{item.name}</h3>
                    <button className="text-gray-600 hover:text-white"><Info size={18} /></button>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="pt-3 border-t border-[#1E2530] flex items-center text-[11px] text-gray-400">
                    <Map size={12} className="mr-2" />
                    <span className="truncate">
            주요 서식지: {item.common_locations?.join(', ') || '알 수 없음'}
          </span>
                  </div>
                </div>
          </div>
      </Link>
    )
}