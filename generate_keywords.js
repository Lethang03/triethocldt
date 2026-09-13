const fs = require('fs');
const path = require('path');

const questionsPath = path.join(__dirname, 'src/data/questions.json');
const essayAnswersPath = path.join(__dirname, 'src/data/essayAnswers.json');

const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
const essayAnswersData = { exams: [] };

function extractKeywords(text) {
    if (!text) return [];
    
    // Custom handling for specific patterns
    if (text.includes('Khả năng – hiện thực')) {
        return ["khả năng", "hiện thực", "điều kiện thích hợp", "tác động thực tiễn"];
    }
    if (text.includes('Nội dung – hình thức')) {
        return ["nội dung", "hình thức", "quyết định", "độc lập tương đối", "tác động trở lại"];
    }
    if (text.includes('Bản chất – hiện tượng')) {
        return ["bản chất", "hiện tượng", "bên trong", "ổn định", "biểu hiện", "bên ngoài"];
    }
    if (text.includes('Quy luật phủ định của phủ định')) {
        return ["phủ định của phủ định", "phủ định biện chứng", "khách quan", "kế thừa", "phát triển"];
    }
    if (text.includes('cơ sở, động lực, mục đích, tiêu chuẩn kiểm nghiệm chân lý')) {
        return ["cơ sở", "động lực", "mục đích", "tiêu chuẩn kiểm nghiệm chân lý"];
    }
    if (text.includes('Quan điểm toàn diện; Quan điểm lịch sử')) {
        return ["quan điểm toàn diện", "quan điểm lịch sử", "thống nhất và đấu tranh", "mâu thuẫn", "nguyên nhân", "kết quả", "phủ định biện chứng"];
    }

    // Generic fallback
    let parts = text.split(/[,;\.\-:\(\)]+/);
    let keywords = parts
        .map(p => p.trim().toLowerCase())
        .filter(p => p.length > 3)
        .filter(p => !['có thể xác định', 'bốn vai trò', 'hãy nêu'].includes(p));
        
    if (keywords.length === 0) {
        keywords = [text.trim()];
    }
    
    return keywords;
}

questionsData.forEach(exam => {
    // We only care about sequence and text questions
    const relevantQuestions = exam.questions.filter(q => q.type === 'sequence' || q.type === 'text');
    
    if (relevantQuestions.length > 0) {
        const examObj = {
            examId: exam.id,
            questions: relevantQuestions.map(q => {
                const isText = q.type === 'text';
                let keywords = [];
                if (isText) {
                    if (exam.id === '02' && q.questionId === 58) keywords = ["thực tiễn", "tiêu chuẩn", "chân lý"];
                    else if (exam.id === '02' && q.questionId === 59) keywords = ["lịch sử", "tự nhiên", "quy luật khách quan"];
                    else if (exam.id === '02' && q.questionId === 60) keywords = ["khách quan", "thực tiễn", "sáng tạo"];
                    else {
                        keywords = extractKeywords(q.correct);
                    }
                }
                
                return {
                    questionId: q.questionId,
                    type: q.type,
                    referenceAnswer: q.correct,
                    keywords: keywords,
                    points: 1
                };
            })
        };
        essayAnswersData.exams.push(examObj);
    }
});

fs.writeFileSync(essayAnswersPath, JSON.stringify(essayAnswersData, null, 2));
console.log('Successfully generated essayAnswers.json');

