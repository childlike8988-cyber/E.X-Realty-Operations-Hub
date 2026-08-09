import type {TemplateProject} from './types';
const key='ex-realty-template-projects';
export function loadProjects():TemplateProject[]{if(typeof window==='undefined')return[];try{return JSON.parse(localStorage.getItem(key)||'[]')}catch{return[]}}
export function saveProject(project:TemplateProject){const all=loadProjects().filter(p=>p.id!==project.id);localStorage.setItem(key,JSON.stringify([project,...all]));}
export function softDeleteProject(id:string){const now=new Date().toISOString();saveProject({...loadProjects().find(p=>p.id===id)!,deletedAt:now})}
