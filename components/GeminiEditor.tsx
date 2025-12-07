import React, { useState, useRef, useEffect } from 'react';
import { editImage } from '../services/geminiService';
import { Upload, Wand2, Loader2, Download, RefreshCw, Link as LinkIcon } from 'lucide-react';

interface GeminiEditorProps {
  initialImage?: string | null;
}

const GeminiEditor: React.FC<GeminiEditorProps> = ({ initialImage }) => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load initial image if provided
  useEffect(() => {
    if (initialImage) {
      setOriginalImage(initialImage);
      setGeneratedImage(null);
      setError(null);
    }
  }, [initialImage]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
        setGeneratedImage(null);
        setError(null);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlUpload = async () => {
    if (!imageUrl.trim()) return;
    setError(null);
    setLoading(true);

    try {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error('Failed to fetch image from URL');
        const blob = await response.blob();
        if (!blob.type.startsWith('image/')) throw new Error('URL does not point to a valid image');

        const reader = new FileReader();
        reader.onloadend = () => {
            setOriginalImage(reader.result as string);
            setGeneratedImage(null);
            setError(null);
            setLoading(false);
            setImageUrl('');
        };
        reader.readAsDataURL(blob);
    } catch (err: any) {
        setLoading(false);
        // Friendly CORS error message
        if (err.name === 'TypeError' && (err.message.includes('fetch') || err.message.includes('NetworkError'))) {
             setError("Unable to load image. The website might be blocking direct access (CORS). Try downloading and uploading the file instead.");
        } else {
             setError(err.message || "Failed to load image URL.");
        }
    }
  };

  const handleEdit = async () => {
    if (!originalImage || !prompt) return;

    setLoading(true);
    setError(null);

    try {
      // Extract base64 data without prefix
      const base64Data = originalImage.split(',')[1];
      const mimeType = originalImage.substring(originalImage.indexOf(':') + 1, originalImage.indexOf(';'));

      const result = await editImage(base64Data, prompt, mimeType);
      setGeneratedImage(result);
    } catch (err: any) {
      setError(err.message || "Failed to generate image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-brand-primary to-[#0e6185] text-white">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Wand2 className="h-6 w-6" />
          AI Image Editor
        </h2>
        <p className="text-brand-bg/80 mt-1">
          Powered by Gemini 2.5 Flash. Upload an image and describe how you want to change it.
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Upload Section */}
        {!originalImage ? (
          <div className="space-y-6">
            <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:bg-slate-50 cursor-pointer transition-colors"
            >
                <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
                />
                <div className="bg-brand-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-8 w-8 text-brand-primary" />
                </div>
                <h3 className="text-lg font-medium text-slate-800">Upload an image to edit</h3>
                <p className="text-brand-muted mt-2">JPG, PNG supported</p>
            </div>

            <div className="flex items-center gap-4">
                <div className="h-px bg-slate-200 flex-1"></div>
                <span className="text-slate-400 text-xs font-semibold tracking-wider">OR PASTE URL</span>
                <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            <div className="flex gap-2">
                 <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/image.png"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none text-sm transition-all"
                        onKeyDown={(e) => e.key === 'Enter' && handleUrlUpload()}
                    />
                 </div>
                 <button 
                    onClick={handleUrlUpload}
                    disabled={loading || !imageUrl.trim()}
                    className="bg-slate-800 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                 >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Load'}
                 </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                   <span className="flex-shrink-0">⚠️</span> {error}
                </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original Image */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-brand-muted uppercase tracking-wider">Original</span>
                  <button 
                    onClick={() => { setOriginalImage(null); setGeneratedImage(null); setPrompt(''); setError(null); }}
                    className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Reset
                  </button>
                </div>
                <div className="relative aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                  <img src={originalImage} alt="Original" className="w-full h-full object-contain" />
                </div>
              </div>

              {/* Generated Image */}
              <div className="space-y-2">
                 <span className="text-sm font-semibold text-brand-muted uppercase tracking-wider">Result</span>
                <div className="relative aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
                  {loading && !generatedImage && (
                    <div className="text-center space-y-3">
                      <Loader2 className="h-10 w-10 text-brand-primary animate-spin mx-auto" />
                      <p className="text-sm text-brand-muted">Consulting the AI...</p>
                    </div>
                  )}
                  {generatedImage && !loading && (
                    <img src={generatedImage} alt="Edited" className="w-full h-full object-contain" />
                  )}
                  {loading && generatedImage && (
                      <>
                        <img src={generatedImage} alt="Edited" className="w-full h-full object-contain opacity-50" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="h-10 w-10 text-brand-primary animate-spin" />
                        </div>
                      </>
                  )}
                  {!loading && !generatedImage && (
                    <div className="text-brand-muted text-sm text-center px-6">
                      Your edited image will appear here.
                    </div>
                  )}
                </div>
                {generatedImage && !loading && (
                    <div className="flex justify-end">
                        <a href={generatedImage} download="edited-image.png" className="text-brand-primary hover:text-brand-primary/80 text-sm font-medium flex items-center gap-1">
                            <Download className="w-4 h-4" /> Download
                        </a>
                    </div>
                )}
              </div>
            </div>

            {/* Prompt Input */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label htmlFor="prompt" className="block text-sm font-medium text-slate-700 mb-2">
                What changes would you like to make?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Add a retro filter, remove the background, make it look like a sketch..."
                  className="flex-1 rounded-lg border-slate-300 border px-4 py-2 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
                />
                <button
                  onClick={handleEdit}
                  disabled={loading || !prompt}
                  className="bg-brand-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                >
                  {loading ? 'Processing' : 'Generate'}
                  {!loading && <Wand2 className="h-4 w-4" />}
                </button>
              </div>
              {error && (
                <div className="mt-2 text-red-500 text-sm flex items-center gap-1">
                    <span>⚠️</span> {error}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeminiEditor;