import { useState } from 'react';
import {
    searchVWorld,
    type PlaceItem,
    type AddressItem,
    type DistrictItem,
    type RoadItem,
} from '../api/search';

type SearchType = 'PLACE' | 'ADDRESS' | 'DISTRICT' | 'ROAD';
type ResultItem = PlaceItem | AddressItem | DistrictItem | RoadItem;

const TYPE_LABELS: Record<SearchType, string> = {
    PLACE: '장소',
    ADDRESS: '주소',
    DISTRICT: '행정구역',
    ROAD: '도로명',
};

interface Props
{
    onSelect: (point: { lat: number; lng: number }, title: string) => void;
}

function getPoint(item: ResultItem): { lat: number; lng: number } | null
{
    if (!('point' in item) || !item.point) return null;
    return {
        lat: parseFloat(item.point.y),
        lng: parseFloat(item.point.x),
    };
}

function getTitle(item: ResultItem): string
{
    if ('title' in item) return item.title;
    if ('address' in item)
    {
        if ('road' in item.address)
            return item.address.road ?? item.address.parcel ?? '';
    }
    return '';
}

function getSubtitle(item: ResultItem): string
{
    // if (item.type === 'PLACE')
    //     return item.address.road ?? item.address.parcel ?? '';
    // if (item.type === 'ADDRESS') return item.address.parcel ?? '';
    // if (item.type === 'DISTRICT') return item.id;
    // if (item.type === 'ROAD') return item.district ?? '';
    // return '';
    return '';
}

export default function SearchBar({ onSelect }: Props)
{
    const [query, setQuery] = useState('');
    const [type, setType] = useState<SearchType>('PLACE');
    const [results, setResults] = useState<ResultItem[]>([]);
    const [status, setStatus] = useState<
        'idle' | 'loading' | 'not_found' | 'error'
    >('idle');

    async function handleSearch()
    {
        if (!query.trim()) return;
        setStatus('loading');
        setResults([]);

        let res;
        switch (type)
        {
            case 'PLACE':
                res = await searchVWorld({
                    type: 'PLACE',
                    query,
                });
                break;
            case 'ADDRESS':
                res = await searchVWorld({
                    type: 'ADDRESS',
                    query,
                    category: 'ROAD',
                });
                break;
            case 'DISTRICT':
                res = await searchVWorld({
                    type: 'DISTRICT',
                    query,
                    category: 'L4',
                });
                break;
            case 'ROAD':
                res = await searchVWorld({
                    type: 'ROAD',
                    query,
                });
                break;
        }

        if (res.status === 'OK')
        {
            setResults(res.result.items as ResultItem[]);
            setStatus('idle');
        }
        else
        {
            setResults([]);
            setStatus(res.status === 'NOT_FOUND' ? 'not_found' : 'error');
        }
    }

    function handleSelect(item: ResultItem)
    {
        const point = getPoint(item);
        if (!point) return;
        onSelect(point, getTitle(item));
        setResults([]);
        setQuery('');
        setStatus('idle');
    }

    return (
        <div className="flex flex-col h-full w-72 bg-white shadow-lg">
            {/* 헤더 */}
            <div className="p-4 border-b border-gray-100">
                <h1 className="text-base font-bold text-gray-800 mb-3">
                    지도 검색
                </h1>

                {/* 타입 선택 */}
                <div className="grid grid-cols-4 gap-1 mb-3">
                    {(Object.keys(TYPE_LABELS) as SearchType[]).map((t) => (
                        <button
                            key={t}
                            onClick={() =>
                            {
                                setType(t);
                                setResults([]);
                                setStatus('idle');
                            }}
                            className={`text-xs py-1.5 rounded-lg transition-colors ${
                                type === t
                                    ? 'bg-blue-500 text-white font-medium'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                        >
                            {TYPE_LABELS[t]}
                        </button>
                    ))}
                </div>

                {/* 입력창 */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder={`${TYPE_LABELS[type]} 검색`}
                        className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 transition-colors"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={status === 'loading'}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-2 rounded-lg transition-colors disabled:opacity-50 shrink-0"
                    >
                        {status === 'loading' ? '...' : '검색'}
                    </button>
                </div>
            </div>

            {/* 결과 목록 */}
            <div className="flex-1 overflow-y-auto">
                {status === 'not_found' && (
                    <p className="text-sm text-gray-400 text-center py-8">
                        검색 결과가 없어요
                    </p>
                )}
                {status === 'error' && (
                    <p className="text-sm text-red-400 text-center py-8">
                        오류가 발생했어요
                    </p>
                )}
                {results.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
                    >
                        <p className="text-sm font-medium text-gray-800 truncate">
                            {getTitle(item)}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                            {getSubtitle(item)}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
}
