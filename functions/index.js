/**
 * Cloud Function: generateNarrative
 * ----------------------------------
 * Recebe as notas de processo de um indicador (já aprovadas) e pede ao
 * Claude (API da Anthropic) para as compilar numa narrativa contínua,
 * em vez do compilador local baseado em modelos/regras.
 *
 * A chave da API NUNCA é enviada ao browser — fica guardada em segredo
 * no Firebase (Secret Manager) e só é usada aqui, do lado do servidor.
 */

const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');

admin.initializeApp();

const ANTHROPIC_API_KEY = defineSecret('ANTHROPIC_API_KEY');

exports.generateNarrative = onCall(
  { secrets: [ANTHROPIC_API_KEY], region: 'us-central1', cors: true },
  async (request) => {
    // Só utilizadores autenticados (com sessão iniciada na plataforma)
    // podem pedir a geração de narrativa.
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'É preciso ter sessão iniciada.');
    }

    const { indicatorName, level, frequency, unit, notes, pct } = request.data || {};

    if (!indicatorName || !Array.isArray(notes) || !notes.length) {
      throw new HttpsError('invalid-argument', 'Dados insuficientes para gerar a narrativa.');
    }
    if (notes.length > 30) {
      throw new HttpsError('invalid-argument', 'Demasiadas notas para uma única narrativa.');
    }

    const notesText = notes
      .map((n) => `- ${String(n.period).slice(0, 40)}: ${String(n.note).slice(0, 800)}`)
      .join('\n');

    const prompt = `Escreve UM parágrafo em português de Moçambique, num tom institucional, profissional e directo, que resuma a evolução do seguinte indicador de monitoria e avaliação ao longo do tempo, com base exclusivamente nas notas de processo fornecidas abaixo.

Regras importantes:
- Não inventes factos, números ou datas que não estejam nas notas.
- Não te limites a copiar as notas uma a seguir à outra — sintetiza-as numa narrativa fluida e contínua, ligando as fases do processo de forma natural (ex: "inicialmente...", "posteriormente...", "actualmente...").
- Usa a periodicidade indicada (trimestre/semestre/ano) para enquadrar a evolução no tempo.
${pct !== null && pct !== undefined ? `- Termina a mencionar que o indicador atingiu ${pct}% da meta definida até ao momento.` : ''}
- Responde APENAS com o parágrafo da narrativa, em texto simples, sem título, sem markdown, sem comentários adicionais.

Indicador: ${indicatorName}
Nível: ${level || 'N/D'}
Periodicidade: ${frequency || 'N/D'}
Unidade: ${unit || 'N/D'}

Notas de processo, por período (ordem cronológica):
${notesText}`;

    let response;
    try {
      response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY.value(),
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 600,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
    } catch (err) {
      console.error('Erro de rede ao chamar a API da Anthropic:', err);
      throw new HttpsError('unavailable', 'Não foi possível contactar o serviço de IA.');
    }

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.error('Erro da API da Anthropic:', response.status, errText);
      throw new HttpsError('internal', 'O serviço de IA devolveu um erro.');
    }

    const data = await response.json();
    const textBlock = (data.content || []).find((b) => b.type === 'text');
    const narrative = (textBlock && textBlock.text ? textBlock.text : '').trim();

    if (!narrative) {
      throw new HttpsError('internal', 'A IA não devolveu texto.');
    }

    return { narrative };
  }
);
