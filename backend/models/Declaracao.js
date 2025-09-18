const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class Declaracao {
  static async gerarPDF({ nome, documento, evento, organizacao, dataInicio, dataFim, objetivo, local, data, arquivo }) {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const filePath = path.join(__dirname, '../certificados', arquivo);
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Título
      doc.fontSize(20).text('Declaração de Participação', { align: 'center', underline: true });
      doc.moveDown();
      // Corpo
      doc.fontSize(12).text(`Declaramos para os devidos fins que ${nome}, portador(a) do documento de identidade nº ${documento}, participou do evento ${evento}.`, { align: 'center' });
      doc.moveDown();
      doc.text(`O evento, realizado por ${organizacao}, ocorreu no período de ${dataInicio} a ${dataFim} e teve como objetivo ${objetivo}.`, { align: 'center' });
      doc.moveDown();
      doc.text('A presente declaração é emitida eletronicamente e tem sua autenticidade garantida pela assinatura digital do sistema.', { align: 'center' });
      doc.moveDown();
      doc.text(`${local}, ${data}`, { align: 'center' });
      doc.moveDown(2);
      doc.text('Assinado automaticamente pelo sistema', { align: 'center' });

      // Geração do hash/chave de autenticidade
      const hashData = `${nome}|${documento}|${evento}|${organizacao}|${dataInicio}|${dataFim}|${objetivo}|${local}|${data}`;
      const hash = crypto.createHash('sha256').update(hashData).digest('hex');

      // Rodapé com chave de autenticidade
      doc.fontSize(10).text('Chave de Autenticidade do Documento:', 50, 820, { align: 'left' });
      doc.fontSize(10).text(hash, 250, 820, { align: 'left' });

      doc.end();
      stream.on('finish', () => resolve({ filePath, hash }));
      stream.on('error', reject);
    });
  }
}

module.exports = Declaracao;
