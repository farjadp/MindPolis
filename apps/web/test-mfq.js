const fetch = require('node-fetch');

async function test() {
  const submitData = {
    assessmentId: 'cm8t4f6n7003z4nj04ks4w23r', // We need to fetch the real ID first
    responses: []
  };
  
  // We'll just fetch the assessment first
  const res = await fetch('http://localhost:3000/api/assessments/moral-foundations-36');
  const data = await res.json();
  const id = data.id;

  if(!id) { console.log('not found'); return; }

  submitData.assessmentId = id;
  submitData.responses = data.questions.map(q => ({
    questionId: q.id,
    value: Math.floor(Math.random() * 5) + 1, // 1 to 5
    confidence: 3 // Neutral confidence
  }));

  const submitRes = await fetch('http://localhost:3000/api/assessments/score-preview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submitData)
  });

  const result = await submitRes.json();
  console.log(JSON.stringify(result, null, 2));
}

test();
