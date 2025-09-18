e responder em portugues?const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function getImageOrGeneric(tipo) {
  const customPath = path.join(__dirname, '../uploads', `${tipo}.png`);
  const genericaPath = path.join(__dirname, '../uploads', `generica_${tipo}.png`);
  if (fs.existsSync(customPath)) return customPath;
  if (fs.existsSync(genericaPath)) return genericaPath;
  return null;
}

class Certificado {
  static async gerarPDF({ nome, evento, data, horas, documento, curso, dataInicio, dataFim, topicos, local, coordenador, cargo, arquivo }) {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const filePath = path.join(__dirname, '../certificados', arquivo);
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Imagens
      const logo = getImageOrGeneric('logo');
      const banner = getImageOrGeneric('banner');
      const certificadoBg = getImageOrGeneric('certificado');
      const assinatura = getImageOrGeneric('assinatura');

      // Banner topo
      if (banner) doc.image(banner, 50, 30, { width: 500, height: 60 });
      // Logo canto superior esquerdo
      if (logo) doc.image(logo, 50, 100, { width: 80 });
      // Fundo certificado (opcional)
      if (certificadoBg) doc.image(certificadoBg, 0, 0, { width: 595, height: 842, opacity: 0.1 });

      doc.moveDown(4);
      doc.fontSize(22).text('CERTIFICADO DE CONCLUSÃO', { align: 'center', underline: true });
      doc.moveDown();
      doc.fontSize(12).text(`A [Nome da Organização ou Empresa] certifica que ${nome}, documento de identidade nº ${documento}, concluiu com sucesso o ${curso}, realizado no período de ${dataInicio} a ${dataFim}.`, { align: 'center' });
      doc.moveDown();
      doc.text(`O participante demonstrou proficiência no conteúdo programático, que incluiu ${topicos}.`, { align: 'center' });
      doc.moveDown();
      doc.text(`Totalizando uma carga horária de ${horas} horas.`, { align: 'center' });
      doc.moveDown();
      doc.text(`Para atestar a validade deste certificado, seguem as informações de autenticidade.`, { align: 'center' });
      doc.moveDown();
      doc.text(`${local}, ${data}`, { align: 'center' });

      // Assinatura
      if (assinatura) {
        doc.image(assinatura, 220, 600, { width: 150 });
        doc.text(coordenador || '[Nome do Coordenador]', 220, 760, { align: 'center' });
        doc.text(cargo || '[Cargo do Coordenador]', 220, 780, { align: 'center' });
      } else {
        doc.text('[Assinatura do Coordenador não definida]', 220, 600, { align: 'center' });
      }

      // Geração do hash/chave de autenticidade
      const hashData = `${nome}|${documento}|${curso}|${dataInicio}|${dataFim}|${topicos}|${horas}|${local}|${data}`;
      const hash = crypto.createHash('sha256').update(hashData).digest('hex');

      // Rodapé com chave de autenticidade
      doc.fontSize(10).text('Chave de Autenticidade do Certificado:', 50, 820, { align: 'left' });
      doc.fontSize(10).text(hash, 250, 820, { align: 'left' });

      doc.end();
      stream.on('finish', () => resolve({ filePath, hash }));
      stream.on('error', reject);
    });
  }
}

module.exports = Certificado;
