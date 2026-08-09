import { PrismaClient, UserRole } from '@prisma/client';
const db = new PrismaClient();
async function main(){
 await db.activityLog.deleteMany(); await db.promptTemplate.deleteMany(); await db.learningResource.deleteMany(); await db.aiTool.deleteMany(); await db.caseStudy.deleteMany(); await db.property.deleteMany(); await db.user.deleteMany(); await db.department.deleteMany();
 await db.department.create({data:{name:'行政示範部門'}}); await db.department.create({data:{name:'業務示範部門'}});
 await db.user.create({data:{name:'示範行政帳號',email:'admin@example.invalid',role:UserRole.ADMIN}}); await db.user.create({data:{name:'示範業務帳號',email:'sales@example.invalid',role:UserRole.SALES}});
 for(const [name,area,type] of [['晨光寓所','示範區 A','住宅'],['藍灣小築','示範區 B','公寓'],['星河商辦','示範區 C','辦公']]) await db.property.create({data:{name,area,type}});
 for(const title of ['從需求到成交的示範案例','內容行銷帶來的示範成果','團隊協作的示範流程']) await db.caseStudy.create({data:{title,propertyName:'假資料案件'}});
 for(const name of ['Canva','Gamma','NotebookLM']) await db.aiTool.create({data:{name,category:'免費 AI 工具',url:'https://example.invalid'}});
 for(const title of ['新人入職第一週','品牌語氣基礎','案件資料整理']) await db.learningResource.create({data:{title,category:'新人教材'}});
 for(const title of ['房仲物件特色摘要','成交後感謝訊息','社群貼文改寫']) await db.promptTemplate.create({data:{title,category:'房仲文案',prompt:'這是示範 Prompt，請依需求補充。'}});
}
main().finally(()=>db.$disconnect());
