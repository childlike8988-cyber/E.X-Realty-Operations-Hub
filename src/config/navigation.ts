import type { Role } from '@/types/auth';
export type NavItem={id:string;title:string;description:string;route:string;icon:string;category:string;allowedRoles:Role[];status:'active'|'beta'|'planned'|'disabled';version:string};
export const navigation: NavItem[]=[
{id:'production',title:'行政製作中心',description:'榮譽圖與公告圖製作工作台',route:'/admin/production',icon:'PanelsTopLeft',category:'行政',allowedRoles:['ADMIN','MEDIA','MANAGER'],status:'beta',version:'0.2'},
{id:'asset-library',title:'共用素材庫',description:'管理 LOGO、人物、背景與模板資產',route:'/assets/library',icon:'Images',category:'共用',allowedRoles:['ADMIN','MEDIA','MANAGER'],status:'planned',version:'0.2'},
{id:'real-price',title:'房產資料工具',description:'實價登錄查詢與市場行情展示',route:'/tools/real-price',icon:'ChartNoAxesCombined',category:'工具',allowedRoles:['ADMIN','SALES','MANAGER','VIEWER'],status:'beta',version:'0.2'},
{id:'case-studies',title:'成功案例',description:'整理可複用的成交故事',route:'/admin/case-studies',icon:'BookOpen',category:'行政',allowedRoles:['ADMIN','MANAGER'],status:'planned',version:'0.2'},
{id:'award-graphics',title:'榮譽與成交圖',description:'建立團隊榮譽視覺素材',route:'/admin/award-graphics',icon:'Award',category:'行政',allowedRoles:['ADMIN','MEDIA'],status:'planned',version:'0.2'},
{id:'presentations',title:'PPT 簡報編制',description:'管理會議與訓練簡報',route:'/admin/presentations',icon:'Presentation',category:'行政',allowedRoles:['ADMIN','MEDIA'],status:'planned',version:'0.2'},
{id:'property-summary',title:'案件整理彙整',description:'集中整理物件資料',route:'/admin/property-summary',icon:'FolderKanban',category:'行政',allowedRoles:['ADMIN','SALES','MANAGER'],status:'planned',version:'0.2'},
{id:'onboarding',title:'新人教材',description:'新人訓練資源入口',route:'/learning/onboarding',icon:'GraduationCap',category:'共用',allowedRoles:['ADMIN','MANAGER','VIEWER'],status:'planned',version:'0.2'},
{id:'free-ai',title:'免費 AI 工具',description:'安全的外部工具連結',route:'/tools/free-ai',icon:'Sparkles',category:'共用',allowedRoles:['ADMIN','SALES','MEDIA','MANAGER','VIEWER'],status:'beta',version:'0.2'},
{id:'prospecting',title:'開發廣告圖',description:'文案、版型、預覽與匯出流程',route:'/sales/prospecting-graphics',icon:'Megaphone',category:'業務',allowedRoles:['SALES','MANAGER'],status:'planned',version:'0.3'},
{id:'property-marketing',title:'房屋文案與廣告設計',description:'整理物件行銷輸入輸出',route:'/sales/property-marketing',icon:'Home',category:'業務',allowedRoles:['SALES','MANAGER'],status:'planned',version:'0.3'},
{id:'social-copy',title:'社群文案編製',description:'常用社群內容模板',route:'/sales/social-copy',icon:'MessageSquareText',category:'業務',allowedRoles:['SALES','MANAGER'],status:'planned',version:'0.3'},
{id:'social-design',title:'社群廣告設計',description:'規劃社群視覺工作流',route:'/sales/social-design',icon:'Palette',category:'業務',allowedRoles:['SALES','MEDIA','MANAGER'],status:'planned',version:'0.3'},
{id:'script-assistant',title:'AI 話術助手',description:'常見情境話術整理',route:'/sales/script-assistant',icon:'MessagesSquare',category:'業務',allowedRoles:['SALES','MANAGER'],status:'planned',version:'0.2'},
{id:'video-production',title:'影片製作',description:'素材到剪輯任務的流程骨架',route:'/media/video-production',icon:'Video',category:'影音',allowedRoles:['MEDIA','SALES','MANAGER'],status:'beta',version:'0.1'},
{id:'booking',title:'拍攝預約',description:'預留 Booking Studio 整合入口',route:'/media/booking',icon:'CalendarDays',category:'影音',allowedRoles:['MEDIA','SALES','MANAGER'],status:'planned',version:'0.5'},
{id:'mortgage',title:'房貸試算',description:'純前端的月付金試算',route:'/tools/mortgage-calculator',icon:'Calculator',category:'工具',allowedRoles:['ADMIN','SALES','MANAGER','VIEWER'],status:'beta',version:'0.2'},
{id:'prompt-library',title:'Prompt Library',description:'集中管理可複用提示詞',route:'/tools/prompt-library',icon:'Library',category:'工具',allowedRoles:['ADMIN','SALES','MEDIA','MANAGER','VIEWER'],status:'planned',version:'0.2'},
{id:'tasks',title:'任務派工',description:'預留跨團隊工作流',route:'/tasks',icon:'ListTodo',category:'共用',allowedRoles:['ADMIN','SALES','MEDIA','MANAGER'],status:'planned',version:'0.5'}];
