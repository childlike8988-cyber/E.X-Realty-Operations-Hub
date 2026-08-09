import type {Template} from './types';
const awardFields=[{id:'portraitImage',label:'人物照片',type:'image' as const},{id:'name',label:'姓名',type:'text' as const},{id:'title',label:'主標題',type:'text' as const},{id:'subtitle',label:'副標題',type:'text' as const},{id:'description',label:'說明',type:'textarea' as const},{id:'branchName',label:'分店名稱',type:'text' as const},{id:'phone',label:'聯絡電話',type:'text' as const},{id:'year',label:'年份',type:'text' as const},{id:'customText',label:'自訂文字',type:'textarea' as const}];
const announcementFields=[{id:'mainImage',label:'主圖片',type:'image' as const},{id:'title',label:'主標題',type:'text' as const},{id:'subtitle',label:'副標題',type:'text' as const},{id:'description',label:'說明',type:'textarea' as const},{id:'date',label:'日期',type:'date' as const},{id:'location',label:'地點',type:'text' as const},{id:'content',label:'活動內容',type:'textarea' as const},{id:'branch',label:'分店',type:'text' as const},{id:'phone',label:'電話',type:'text' as const}];
export const templates:Template[]=[
 {id:'sold',name:'賀成交',kind:'award',category:'榮譽圖',fields:awardFields},
 {id:'marketing-king',name:'行銷王',kind:'award',category:'榮譽圖',fields:awardFields},
 {id:'million-elite',name:'百萬菁英',kind:'award',category:'榮譽圖',fields:awardFields},
 {id:'custom-award',name:'自定義榮譽圖',kind:'award',category:'榮譽圖',fields:awardFields},
 {id:'company',name:'企業公告',kind:'announcement',category:'公告圖',fields:announcementFields},
 {id:'event',name:'活動公告',kind:'announcement',category:'公告圖',fields:announcementFields},
 {id:'reward',name:'目標獎勵公告',kind:'announcement',category:'公告圖',fields:announcementFields},
 {id:'travel',name:'旅行計畫公告',kind:'announcement',category:'公告圖',fields:announcementFields},
];
