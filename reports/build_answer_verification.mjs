import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { SpreadsheetFile, Workbook } from '@oai/artifact-tool';

const sourceDir = 'E:\\Đề';
const python = 'C:\\Users\\LEGION\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\python.exe';
const data = JSON.parse(await fs.readFile('src/data/questions.json', 'utf8'));
const normalize = (value = '') => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
const py = String.raw`import json,sys,os,re
from docx import Document
p=sys.argv[1]
d=Document(p)
print(json.dumps([x.text.strip() for x in d.paragraphs if x.text.strip()], ensure_ascii=False))`;
const readDoc = async name => JSON.parse(execFileSync(python, ['-c', py, `${sourceDir}\\${name}`], { encoding: 'utf8', env: { ...process.env, PYTHONUTF8: '1' } }));
function parseQuestions(lines) {
  const result=[]; let current=null;
  for (const line of lines) {
    const q=line.match(/^Câu\s+(\d+)\.?$/i);
    if(q){ if(current) result.push(current); current={n:Number(q[1]),question:[],options:{}}; continue; }
    if(!current) continue;
    const option=line.match(/^([ABCD])\.\s*(.*)$/);
    if(option) current.options[option[1]]=option[2]; else if(!/^Trả lời|^Câu trắc nghiệm/i.test(line)) current.question.push(line);
  }
  if(current) result.push(current);
  return result.filter(x=>x.question.length||Object.keys(x.options).length);
}
const wordBanks={}; const sources=[];
for(let n=2;n<=11;n++) { const file=`ĐỀ ÔN LUYỆN SỐ ${String(n).padStart(2,'0')}.docx`; try { wordBanks[String(n).padStart(2,'0')]=parseQuestions(await readDoc(file)); sources.push(file); } catch { const alt=`ĐỀ ÔN LUYỆN SỐ ${String(n).padStart(2,'0')}.docx`; wordBanks[String(n).padStart(2,'0')]=parseQuestions(await readDoc(alt)); sources.push(alt); } }
const aggregateName=(await fs.readdir(sourceDir)).find(x=>/T.?.NG H.P TR.C NGHI.M/i.test(x)); const aggregate=parseQuestions(await readDoc(aggregateName)); sources.push(aggregateName);
const rows=[]; const errors=[];
for(const bank of data){
 const id=bank.id; const sourceQuestions=Number(id)<=11 ? wordBanks[id] : aggregate.slice((Number(id)-12)*70,(Number(id)-11)*70);
 const seen=new Map(); bank.questions.forEach(q=>{const k=normalize(q.question);seen.set(k,(seen.get(k)||0)+1)});
 for(const q of bank.questions){
  const source=sourceQuestions.find(s=>s.n===q.questionId); let status='MATCH'; let detail='';
  if(!source){status='MISSING IN WORD';detail='No Word question with this number';}
  else { const questionMatch=normalize(source.question.join(' '))===normalize(q.question); const optionsMatch=['A','B','C','D'].every((l,i)=>normalize(source.options[l])===normalize(String(q.answers?.[i]||'').replace(/^[A-D]\.\s*/,''))); if(!questionMatch||!optionsMatch){status='CONTENT MISMATCH';detail=`Question ${questionMatch?'match':'differs'}; options ${optionsMatch?'match':'differ'}`;} }
  if((seen.get(normalize(q.question))||0)>1){status='DUPLICATE WEBSITE QUESTION';detail='Duplicate normalized question text in bank';}
  rows.push([`Đề ${id}`,q.questionId,q.question,source ? 'Not provided in Word source' : 'N/A',q.correct,status,detail]);
 }
 for(const s of sourceQuestions){if(!bank.questions.some(q=>q.questionId===s.n)){errors.push(`Đề ${id}, Câu ${s.n}: có trong Word nhưng thiếu trong website.`)}}
}
const summary={total:rows.length,match:rows.filter(r=>r[5]==='MATCH').length,issues:rows.filter(r=>r[5]!=='MATCH').length};
const wb=Workbook.create(); const sum=wb.worksheets.add('Summary'); const detail=wb.worksheets.add('Verification');
sum.getRange('A1:B8').values=[['Word to Website Verification'],['Source folder',sourceDir],['Source files',sources.join('; ')],['Website data','src/data/questions.json'],['Questions checked',summary.total],['Content matches',summary.match],['Issues',summary.issues],['Answer-key note','Word source documents do not provide a separate answer key; no answer key comparison was guessed.']];
detail.getRange(`A1:G${rows.length+1}`).values=[['Exam','Question number','Question','Word answer','Website answer','Status','Detail'],...rows];
for(const sheet of [sum,detail]){sheet.getRange('A1:Z1').format={fill:'#163A5F',font:{bold:true,color:'#FFFFFF',name:'Arial'},horizontalAlignment:'center'};sheet.getRange('A:Z').format={font:{name:'Arial',size:10},verticalAlignment:'top'};sheet.freezePanes.freezeRows(1);}
sum.getRange('A1:B8').format.wrapText=true; sum.getRange('A1:A8').format.font={bold:true,name:'Arial'}; sum.getRange('A1:B8').format.columnWidth=28;
detail.getRange('A:G').format.wrapText=true; detail.getRange('A:A').format.columnWidth=12; detail.getRange('B:B').format.columnWidth=14; detail.getRange('C:C').format.columnWidth=55; detail.getRange('D:E').format.columnWidth=22; detail.getRange('F:F').format.columnWidth=24; detail.getRange('G:G').format.columnWidth=36;
wb.recalculate();
const out=await SpreadsheetFile.exportXlsx(wb); await out.save('reports/ANSWER_VERIFICATION_REPORT.xlsx');
await fs.writeFile('reports/verification-summary.json', JSON.stringify({summary,errors,sources},null,2));
console.log(JSON.stringify({summary,errors,sources},null,2));
