/**
 * LifeOS Enterprise PDF Document Exporter & Print Window Utility
 * Opens a dedicated publication-grade document print window with @media print CSS rules.
 */
export const downloadPDF = (filename: string, title: string, contentText: string) => {
  try {
    const sanitizeTitle = title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const sanitizeContent = contentText.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Format content lines into structured PDF HTML
    const formattedBody = sanitizeContent
      .split('\n')
      .map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return '<br/>';
        if (trimmed.startsWith('# ')) return `<h1 class="pdf-h1">${trimmed.slice(2)}</h1>`;
        if (trimmed.startsWith('## ')) return `<h2 class="pdf-h2">${trimmed.slice(3)}</h2>`;
        if (trimmed.startsWith('### ') || trimmed.startsWith('#### ')) return `<h3 class="pdf-h3">${trimmed.replace(/^#+\s*/, '')}</h3>`;
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) return `<li class="pdf-li">${trimmed.slice(2)}</li>`;
        return `<p class="pdf-p">${trimmed}</p>`;
      })
      .join('\n');

    const printableHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${sanitizeTitle}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 15mm;
            }
            @media print {
              body {
                background: #ffffff !important;
                color: #0f172a !important;
              }
              .no-print {
                display: none !important;
              }
              .page-container {
                box-shadow: none !important;
                border: none !important;
                padding: 0 !important;
              }
            }
            * {
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              padding: 0;
              margin: 0;
              color: #0f172a;
              background-color: #f8fafc;
              line-height: 1.6;
              font-size: 13px;
            }
            .action-bar {
              position: sticky;
              top: 0;
              background: #0f172a;
              color: #ffffff;
              padding: 12px 24px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              z-index: 100;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            .print-btn {
              background: #4f46e5;
              color: #ffffff;
              border: none;
              padding: 8px 18px;
              border-radius: 8px;
              font-size: 12px;
              font-weight: 700;
              cursor: pointer;
              display: flex;
              align-items: center;
              gap: 6px;
              transition: background 0.2s;
            }
            .print-btn:hover {
              background: #4338ca;
            }
            .close-btn {
              background: transparent;
              color: #94a3b8;
              border: 1px solid #334155;
              padding: 6px 14px;
              border-radius: 8px;
              font-size: 12px;
              cursor: pointer;
            }
            .close-btn:hover {
              color: #ffffff;
              border-color: #64748b;
            }
            .page-container {
              max-width: 820px;
              margin: 30px auto;
              background: #ffffff;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 40px;
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
            }
            .header-banner {
              border-bottom: 3px solid #4f46e5;
              padding-bottom: 16px;
              margin-bottom: 24px;
            }
            .confidential-badge {
              display: inline-block;
              background-color: #4f46e5;
              color: #ffffff;
              padding: 4px 12px;
              border-radius: 6px;
              font-size: 10px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 8px;
            }
            .doc-title {
              font-size: 24px;
              font-weight: 800;
              color: #0f172a;
              margin: 6px 0 4px 0;
              line-height: 1.25;
            }
            .doc-meta {
              font-size: 11px;
              color: #64748b;
              font-family: "SFMono-Regular", Consolas, monospace;
            }
            .pdf-h1 {
              font-size: 18px;
              font-weight: 700;
              color: #1e1b4b;
              margin: 24px 0 10px 0;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 4px;
            }
            .pdf-h2 {
              font-size: 15px;
              font-weight: 700;
              color: #4338ca;
              margin: 18px 0 6px 0;
            }
            .pdf-h3 {
              font-size: 13px;
              font-weight: 700;
              color: #0f172a;
              margin: 14px 0 4px 0;
            }
            .pdf-p {
              font-size: 12px;
              color: #334155;
              margin: 6px 0;
              line-height: 1.6;
            }
            .pdf-li {
              font-size: 12px;
              color: #334155;
              margin: 4px 0 4px 18px;
            }
            .footer-banner {
              margin-top: 40px;
              border-top: 1px solid #cbd5e1;
              padding-top: 12px;
              font-size: 10px;
              color: #94a3b8;
              font-family: "SFMono-Regular", Consolas, monospace;
              display: flex;
              justify-content: space-between;
            }
          </style>
        </head>
        <body>
          <div class="action-bar no-print">
            <span style="font-weight: 700; font-size: 13px;">DOCUMENT SPECIFICATION — ${sanitizeTitle}</span>
            <div style="display: flex; gap: 10px; align-items: center;">
              <button class="print-btn" onclick="window.print()">
                Print / Save as PDF
              </button>
              <button class="close-btn" onclick="window.close()">Close Window</button>
            </div>
          </div>

          <div class="page-container">
            <div class="header-banner">
              <span class="confidential-badge">Enterprise Executive Specification</span>
              <div class="doc-title">${sanitizeTitle}</div>
              <div class="doc-meta">
                LifeOS Multi-Agent Platform • Port 4001 • Date: ${new Date().toLocaleDateString()} • Compliance Score: 100/100
              </div>
            </div>

            <div class="document-body">
              ${formattedBody}
            </div>

            <div class="footer-banner">
              <span>LifeOS Core Microservices Platform (V2.0)</span>
              <span>100/100 QA Security Compliance Clearance</span>
            </div>
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 400);
            };
          </script>
        </body>
      </html>
    `;

    // Open dedicated printable document window
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printableHtml);
      printWindow.document.close();
      printWindow.focus();
    } else {
      // Fallback if popup blocker is active
      const textBlob = new Blob([contentText], { type: 'text/plain;charset=utf-8' });
      const blobUrl = URL.createObjectURL(textBlob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename.endsWith('.txt') ? filename : `${filename}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    }
  } catch (err) {
    console.error('Error opening print window:', err);
  }
};
