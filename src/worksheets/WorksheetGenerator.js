/**
 * WorksheetGenerator.js
 * Client-side PDF worksheet generation using html2pdf.js
 */

import { getRandomQuestions, parseOptions } from '../core/questions/questionBank';

const WORLD_NAMES = { 1:'Spice Bazaar — Ratios', 2:'Speed Speedway — Rates', 3:'Gold Exchange — Percentages' };

function buildWorksheetHTML(questions, studentName, worldId, type) {
  const title  = `RatioCraft Practice Worksheet — ${WORLD_NAMES[worldId] || 'All Topics'}`;
  const date   = new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'long', year:'numeric' });
  const rows   = questions.map((q, i) => `
    <div class="question">
      <p><strong>${i+1}.</strong> ${q.questionText}</p>
      <div class="choices">
        ${parseOptions(q).map((opt, j) =>
          `<span class="choice"><span class="circle">${String.fromCharCode(65+j)}</span>${opt}</span>`
        ).join('')}
      </div>
      <div class="workbox">Working space: _______________________________________________</div>
      <div class="answerline">Answer: ____________</div>
    </div>
  `).join('');

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8"/>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: Arial, sans-serif; font-size: 11pt; color: #1E293B; padding: 20mm; line-height: 1.5; }
      .header { border-bottom: 2.5px solid #0F766E; padding-bottom: 12px; margin-bottom: 18px; }
      .header h1 { font-size: 16pt; color: #0F766E; font-weight: 900; }
      .header .meta { font-size: 9pt; color: #64748B; margin-top: 4px; }
      .header .fields { display: flex; gap: 24px; margin-top: 10px; font-size: 10pt; }
      .header .fields span { flex: 1; border-bottom: 1.5px solid #CBD5E1; padding-bottom: 2px; }
      .question { margin-bottom: 20px; padding: 12px; background: #F8FAFC; border-left: 4px solid #0F766E; border-radius: 6px; page-break-inside: avoid; }
      .choices { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin: 8px 0; }
      .choice { display: flex; align-items: center; gap: 6px; font-size: 10pt; }
      .circle { display: inline-flex; width: 20px; height: 20px; border: 1.5px solid #94A3B8; border-radius: 50%; align-items: center; justify-content: center; font-size: 8pt; font-weight: bold; flex-shrink: 0; }
      .workbox { font-size: 9pt; color: #94A3B8; margin-top: 8px; }
      .answerline { font-size: 10pt; font-weight: 700; color: #0F766E; margin-top: 4px; }
      .footer { margin-top: 24px; padding-top: 12px; border-top: 1.5px solid #E2E8F0; font-size: 9pt; color: #94A3B8; display: flex; justify-content: space-between; }
      .qr-hint { font-size: 8pt; color: #94A3B8; margin-top: 3px; }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>📊 ${title}</h1>
      <div class="meta">Intellia SG · RatioCraft · Grade 6 Mathematics · Generated: ${date}</div>
      <div class="fields">
        <span>Name: ${studentName || '___________________________'}</span>
        <span>Date: ___________________</span>
        <span>Score: ______ / ${questions.length}</span>
      </div>
    </div>
    <div class="instructions" style="margin-bottom:16px;font-size:10pt;color:#475569;padding:8px 12px;background:#EFF6FF;border-radius:6px;">
      Instructions: Choose the correct answer for each question. Show your working in the space provided.
    </div>
    ${rows}
    <div class="footer">
      <span>RatioCraft © Intellia SG 2026 — intelliasg.com</span>
      <span>🔑 Answer key available in the RatioCraft app after completion.</span>
    </div>
  </body>
  </html>`;
}

export async function downloadWorksheet(type = 'practice', worldId = 1, studentName = '') {
  // Dynamically import html2pdf to keep bundle small
  const html2pdf = (await import('html2pdf.js')).default;
  const questions = getRandomQuestions(worldId, 10);
  const html      = buildWorksheetHTML(questions, studentName, worldId, type);

  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;left:-9999px;top:0;width:210mm;';
  container.innerHTML = html;
  document.body.appendChild(container);

  await html2pdf().set({
    margin: [0,0,0,0],
    filename: `RatioCraft_Worksheet_World${worldId}.pdf`,
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: 'css' },
  }).from(container).save();

  document.body.removeChild(container);
}
