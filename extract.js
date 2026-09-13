import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcFile = 'E:\\bo_de_02_15_4_bo_70_cau.html';

if (!fs.existsSync(srcFile)) {
    console.error('Source file not found:', srcFile);
    process.exit(1);
}

const content = fs.readFileSync(srcFile, 'utf-8');

function extractObject(varName) {
    const startIndex = content.indexOf(`const ${varName} = {`);
    if (startIndex === -1) return "{}";
    let braceCount = 0, endIndex = -1, started = false;
    for (let i = startIndex; i < content.length; i++) {
        if (content[i] === '{') { braceCount++; started = true; } 
        else if (content[i] === '}') { braceCount--; }
        if (started && braceCount === 0) { endIndex = i + 1; break; }
    }
    if (endIndex === -1) return "{}";
    return content.substring(startIndex, endIndex).replace(`const ${varName} = `, '');
}

let banksObj = {};
let metaObj = {};

try {
    // Later exam banks are assigned after the initial object literal, so
    // evaluating the entire bank declaration section preserves every set.
    const banksStart = content.indexOf('const banks =');
    const metaStart = content.indexOf('const EXAM_META =');
    if (banksStart === -1 || metaStart === -1) throw new Error('Exam data markers were not found');
    banksObj = new Function(`${content.substring(banksStart, metaStart)}; return banks;`)();
    metaObj = new Function(`return ${extractObject('EXAM_META')}`)();
} catch (err) {
    console.error("Failed to parse source JS objects", err);
}

const examsArray = [];
for (const [examId, questionsData] of Object.entries(banksObj)) {
    const examMeta = metaObj[examId] || { title: `Đề số ${examId}` };
    const formattedQuestions = questionsData.map(q => {
        let answersArray = [];
        if (q.options) {
            answersArray = Object.entries(q.options).map(([key, val]) => `${key}. ${val}`);
        }
        return {
            questionId: q.id,
            type: q.type,
            question: q.prompt,
            passage: q.passage || undefined,
            answers: answersArray.length > 0 ? answersArray : undefined,
            correct: q.answer || q.modelAnswer || ""
        };
    });

    examsArray.push({
        id: examId,
        title: examMeta.title,
        badge: examMeta.badge,
        description: examMeta.description,
        questions: formattedQuestions
    });
}

examsArray.sort((a, b) => a.id.localeCompare(b.id));

const dataDir = path.join(__dirname, 'src', 'data');
fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(path.join(dataDir, 'questions.json'), JSON.stringify(examsArray, null, 2));
console.log(`Successfully migrated exams to questions.json`);
