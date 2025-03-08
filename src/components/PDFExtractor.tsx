'use client';

import React, { useState, useEffect } from 'react';

// Define the window interface to access PDF.js globally
declare global {
  interface Window {
    'pdfjs-dist/build/pdf': any;
  }
}

const PDFExtractor: React.FC = () => {
  const [pdfText, setPdfText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const [pdfStructure, setPdfStructure] = useState<any[]>([]);
  
  // Load PDF.js scripts dynamically
  useEffect(() => {
    const loadPdfJs = async () => {
      if (!window['pdfjs-dist/build/pdf']) {
        // Create and append the script tag for PDF.js
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
        script.async = true;
        script.onload = () => {
          console.log('PDF.js library loaded successfully');
        };
        document.body.appendChild(script);
      }
    };
    
    loadPdfJs();
  }, []);

  const extractTextFromPDF = async (file: File) => {
    setLoading(true);
    setPdfText('');
    setPdfStructure([]);
    setFileName(file.name);

    try {
      // Wait for PDF.js to be loaded if it's not already
      let attempts = 0;
      const maxAttempts = 10;
      
      while (!window['pdfjs-dist/build/pdf'] && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
      }
      
      // Get a reference to the PDF.js library
      const pdfjsLib = window['pdfjs-dist/build/pdf'];
      
      if (!pdfjsLib) {
        throw new Error('PDF.js library not loaded after multiple attempts');
      }
      
      // Set the worker source
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
      
      // Read file as array buffer
      const fileReader = new FileReader();
      
      const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
        fileReader.onload = () => resolve(fileReader.result as ArrayBuffer);
        fileReader.onerror = reject;
        fileReader.readAsArrayBuffer(file);
      });
      
      // Load the PDF document
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDocument = await loadingTask.promise;
      
      // Extract text from each page with enhanced formatting
      let fullText = '';
      const structure = [];
      const numPages = pdfDocument.numPages;
      
      for (let i = 1; i <= numPages; i++) {
        const page = await pdfDocument.getPage(i);
        
        // Get text content with positioning information
        const textContent = await page.getTextContent();
        const viewport = page.getViewport({ scale: 1.0 });
        
        // Group text by approximate Y position (lines)
        const textByLines: Record<string, any[]> = {};
        
        textContent.items.forEach((item: any) => {
          // Round to nearest 10 to group text in the same approximate line
          const yPos = Math.round(viewport.height - item.transform[5]);
          const key = Math.floor(yPos / 10) * 10;
          
          if (!textByLines[key]) {
            textByLines[key] = [];
          }
          
          textByLines[key].push({
            text: item.str,
            x: item.transform[4],
            y: yPos,
            fontSize: item.height,
            fontFamily: item.fontName || 'unknown'
          });
        });
        
        // Sort lines by Y position (top to bottom)
        const sortedYPositions = Object.keys(textByLines)
          .map(Number)
          .sort((a, b) => a - b);
        
        // Process each line
        let pageText = '';
        const pageStructure: any[] = [];
        
        sortedYPositions.forEach(yPos => {
          // Sort items in line by X position (left to right)
          const line = textByLines[yPos].sort((a, b) => a.x - b.x);
          
          // Calculate if this might be a heading based on font size
          const avgFontSize = line.reduce((sum, item) => sum + item.fontSize, 0) / line.length;
          const isLargerText = avgFontSize > 12; // Arbitrary threshold
          
          // Join text in the line
          const lineText = line.map(item => item.text).join(' ').trim();
          
          if (lineText) {
            // Add to structured data
            pageStructure.push({
              text: lineText,
              y: yPos,
              fontSize: avgFontSize,
              isLargerText
            });
            
            // Format for plain text
            if (isLargerText) {
              pageText += `\n${lineText.toUpperCase()}\n`;
            } else {
              pageText += `${lineText}\n`;
            }
          }
        });
        
        // Add structured data to full structure
        structure.push({
          pageNum: i,
          content: pageStructure
        });
        
        // Add formatted text to full text
        fullText += `Page ${i}:\n${pageText}\n\n`;
      }
      
      setPdfStructure(structure);
      setPdfText(fullText || 'No text content found in this PDF.');
      const analysisResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            resumeText: fullText,
          jobDescription: "Frontend developer"
        }),
      });
      
    } catch (error: unknown) {
      console.error('Error extracting text from PDF:', error);
      // Handle the error properly with type checking
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setPdfText(`Error extracting text from PDF: ${errorMessage}. Please try another file.`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        extractTextFromPDF(file);
      } else {
        setPdfText('Please upload a PDF file.');
        setFileName('');
      }
    }
  };

  // Render both raw text and structured version
  const renderStructuredContent = () => {
    if (!pdfStructure.length) return null;
    
    return (
      <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-medium mb-2">Structured Content:</h3>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          {pdfStructure.map((page, pageIndex) => (
            <div key={`page-${pageIndex}`} className="mb-6">
              <h4 className="font-bold border-b pb-1 mb-2">Page {page.pageNum}</h4>
              <div>
                {page.content.map((line: any, lineIndex: number) => (
                  <div 
                    key={`line-${pageIndex}-${lineIndex}`}
                    className={`${line.isLargerText ? 'font-bold text-lg my-2' : 'my-1'}`}
                  >
                    {line.text}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <label
          htmlFor="pdf-upload"
          className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center">
            <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PDF files only</p>
          </div>
          <input
            id="pdf-upload"
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Extracting text from PDF...</p>
        </div>
      )}

      {fileName && !loading && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">File: {fileName}</h2>
        </div>
      )}

      {pdfText && !loading && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Extracted Text:</h3>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-96 overflow-y-auto whitespace-pre-wrap">
            {pdfText}
          </div>
          
          {renderStructuredContent()}
        </div>
      )}
    </div>
  );
};

export default PDFExtractor;