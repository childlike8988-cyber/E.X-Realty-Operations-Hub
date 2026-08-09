'use client';

import {Bar,BarChart,CartesianGrid,Legend,Line,LineChart,ResponsiveContainer,Tooltip,XAxis,YAxis} from 'recharts';

export function CommunityPriceComparisonChart({data,communityA,communityB}:{data:{date:string;communityA?:number;communityB?:number}[];communityA:string;communityB:string}) {
  return <section className="glass h-80 rounded-2xl p-5"><h2 className="mb-4 text-lg font-semibold">價格趨勢比較</h2><ResponsiveContainer width="100%" height="88%"><LineChart data={data}><CartesianGrid stroke="#27415e" strokeDasharray="3 3"/><XAxis dataKey="date" stroke="#9cb1c9"/><YAxis stroke="#9cb1c9"/><Tooltip/><Legend/><Line name={communityA} type="monotone" dataKey="communityA" stroke="#f4c96a" strokeWidth={3}/><Line name={communityB} type="monotone" dataKey="communityB" stroke="#7ea7ff" strokeWidth={3}/></LineChart></ResponsiveContainer></section>;
}

export function CommunityVolumeComparisonChart({data,communityA,communityB}:{data:{month:string;communityA:number;communityB:number}[];communityA:string;communityB:string}) {
  return <section className="glass h-80 rounded-2xl p-5"><h2 className="mb-4 text-lg font-semibold">成交量比較</h2><ResponsiveContainer width="100%" height="88%"><BarChart data={data}><CartesianGrid stroke="#27415e" strokeDasharray="3 3"/><XAxis dataKey="month" stroke="#9cb1c9"/><YAxis allowDecimals={false} stroke="#9cb1c9"/><Tooltip/><Legend/><Bar name={communityA} dataKey="communityA" fill="#f4c96a" radius={[5,5,0,0]}/><Bar name={communityB} dataKey="communityB" fill="#7ea7ff" radius={[5,5,0,0]}/></BarChart></ResponsiveContainer></section>;
}
