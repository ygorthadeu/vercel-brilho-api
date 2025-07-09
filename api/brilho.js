const Jimp = require('jimp');

module.exports = async (req, res) => {
  // Adiciona headers CORS para qualquer requisição
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Trata requisição preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Garante que o método seja POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use POST method' });
  }

  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'imageUrl é obrigatório' });
    }

    const image = await Jimp.read(imageUrl);
    let totalBrightness = 0;
    const { width, height } = image.bitmap;

    image.scan(0, 0, width, height, (x, y, idx) => {
      const r = image.bitmap.data[idx + 0];
      const g = image.bitmap.data[idx + 1];
      const b = image.bitmap.data[idx + 2];
      const brightness = (r + g + b) / 3;
      totalBrightness += brightness;
    });

    const average = totalBrightness / (width * height);
    const brilho = average < 128 ? 'dark' : 'light';

    return res.status(200).json({ brilho });
  } catch (e) {
    return res.status(500).json({
      error: 'Falha ao analisar imagem',
      detalhe: e.message,
    });
  }
};
