const Jimp = require('jimp');
// Adicione um comentário na primeira linha
// Função para detectar brilho da imagem

module.exports = async (req, res) => {
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
    return res.status(500).json({ error: 'Falha ao analisar imagem', detalhe: e.message });
  }
};
