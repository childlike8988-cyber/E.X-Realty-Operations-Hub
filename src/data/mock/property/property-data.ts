import type {PropertyProfile} from '@/features/property-intelligence/types';

export const mockProperties: PropertyProfile[] = [
  {id:'property-gushan-3br',title:'鼓山美術館三房平車',district:'鼓山區',address:'美術東二路 101 號',buildingType:'大樓',rooms:'3房2廳2衛',areaPing:42.6,age:4,floor:'12F',totalPrice:1490,unitPrice:35,community:'美術館首席',locationId:'gushan-art-district',realPriceCaseId:'gushan-art-district',targetCustomer:'家庭換屋族',sellingPoints:['學區完整','大型公園與藝術生活圈','三房平車與成熟生活機能'],salesStrategy:'先建立生活品質，再帶入社區成交價格比較。',source:'MOCK'},
  {id:'property-zuoying-2br',title:'左營高鐵兩房車位',district:'左營區',address:'重信路 201 號',buildingType:'大樓',rooms:'2房2廳1衛',areaPing:34.7,age:9,floor:'9F',totalPrice:1010,unitPrice:29.1,community:'高鐵綠意居',locationId:'zuoying-hsr-district',realPriceCaseId:'zuoying-hsr-district',targetCustomer:'首購／投資族',sellingPoints:['高鐵、台鐵與捷運轉乘','兩房車位的總價帶','商圈與日常機能'],salesStrategy:'以交通節點和總價帶建立通勤與資產配置比較。',source:'MOCK'},
  {id:'property-fengshan-metro',title:'鳳山捷運宅',district:'鳳山區',address:'鳳翔路 88 號',buildingType:'華廈',rooms:'2房2廳1衛',areaPing:30.6,age:14,floor:'7F',totalPrice:720,unitPrice:23.5,community:'鳳翔之星',locationId:'fengshan-metro-district',realPriceCaseId:'fengshan-metro-district',targetCustomer:'小家庭自住',sellingPoints:['捷運生活圈','完整學區與公園','親民總價與自住格局'],salesStrategy:'以自住需求與完整生活機能說明長期居住價值。',source:'MOCK'},
];
