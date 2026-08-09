import type {LocationDemoCase} from '@/features/location-intelligence/types';

export const locationDemoCases: LocationDemoCase[] = [
  {
    id:'gushan-art-district',title:'鼓山美術館生活圈',description:'藝術生活圈、學區與公園綠地的家庭型居住展示案例。',
    property:{id:'loc-gushan-art',name:'美術館首席',address:'美術東二路 101 號',district:'鼓山區',latitude:22.651,longitude:120.284,source:'MOCK'},
    nearbyPlaces:[
      {id:'g1',type:'school',name:'美術館國小',distance:450,description:'步行可達的國小學區。',source:'MOCK'},
      {id:'g2',type:'school',name:'龍美國中',distance:900,description:'完整國中學區選擇。',source:'MOCK'},
      {id:'g3',type:'mrt',name:'凹子底捷運站',distance:1200,description:'銜接市中心的捷運交通。',source:'MOCK'},
      {id:'g4',type:'market',name:'青海市場',distance:700,description:'日常採買機能。',source:'MOCK'},
      {id:'g5',type:'park',name:'美術館園區',distance:350,description:'大型休閒綠地。',source:'MOCK'},
      {id:'g6',type:'shopping',name:'美術館生活商圈',distance:600,description:'餐飲與零售機能。',source:'MOCK'},
    ],
  },
  {
    id:'zuoying-hsr-district',title:'左營高鐵生活圈',description:'交通節點與商業機能並重的首購、通勤與投資展示案例。',
    property:{id:'loc-zuoying-hsr',name:'高鐵綠意居',address:'重信路 201 號',district:'左營區',latitude:22.686,longitude:120.307,source:'MOCK'},
    nearbyPlaces:[
      {id:'z1',type:'school',name:'新光國小',distance:650,description:'周邊國小學區。',source:'MOCK'},
      {id:'z2',type:'mrt',name:'左營高鐵站',distance:500,description:'高鐵、台鐵與捷運轉乘節點。',source:'MOCK'},
      {id:'z3',type:'market',name:'左營果貿市場',distance:1100,description:'傳統市場採買選擇。',source:'MOCK'},
      {id:'z4',type:'park',name:'微笑公園',distance:750,description:'日常休憩空間。',source:'MOCK'},
      {id:'z5',type:'shopping',name:'高鐵商圈',distance:450,description:'商場、餐飲與交通服務。',source:'MOCK'},
      {id:'z6',type:'hospital',name:'左營醫療中心',distance:1400,description:'區域醫療資源。',source:'MOCK'},
    ],
  },
  {
    id:'fengshan-metro-district',title:'鳳山捷運生活圈',description:'捷運、學區與成熟採買機能支撐的自住家庭展示案例。',
    property:{id:'loc-fengshan-metro',name:'鳳翔之星',address:'鳳翔路 88 號',district:'鳳山區',latitude:22.624,longitude:120.352,source:'MOCK'},
    nearbyPlaces:[
      {id:'f1',type:'school',name:'鳳翔國小',distance:500,description:'家庭型買方重視的學區資源。',source:'MOCK'},
      {id:'f2',type:'mrt',name:'鳳山西站',distance:850,description:'捷運通勤選擇。',source:'MOCK'},
      {id:'f3',type:'market',name:'鳳山市場',distance:650,description:'成熟日常採買機能。',source:'MOCK'},
      {id:'f4',type:'park',name:'鳳翔公園',distance:300,description:'親子與休閒綠地。',source:'MOCK'},
      {id:'f5',type:'shopping',name:'鳳山生活商圈',distance:700,description:'餐飲與零售服務。',source:'MOCK'},
      {id:'f6',type:'hospital',name:'鳳山區域醫院',distance:1200,description:'便利醫療資源。',source:'MOCK'},
    ],
  },
];
