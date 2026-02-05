import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router"
import { colorSchemes, type AspectRatio, type IThumbnail, type ThumbnailStyle } from "../assets/assets";
import SoftBackdrop from "../components/SoftBackdrop";
import AspectRatioSelector from "../components/AspectRatioSelector";
import StyleSelector from "../components/StyleSelector";
import ColorSchemeSelector from "../components/ColorSchemeSelector";
import PreviewPanel from "../components/PreviewPanel";
// import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
// import api from "../configs/api";


const Generate = () => {

  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  // const { isLoggedIn } = useAuth();

  const [title, setTitle] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [thumbnail, setThumbnail] = useState<IThumbnail | null>(null);
  const [loading, setLoading] = useState(false);

  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");  
  const [colorSchemeId, setColorSchemeId] = useState<string>(colorSchemes[0].id); 
  const [style, setStyle] = useState<ThumbnailStyle>("Bold & Graphic"); 
  const [styleDropdownOpen, setStyleDropdownOpen] = useState(false);

  


  return (
    <>
      <SoftBackdrop />
      <div className="pt-24 min-h-screen">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-8">
          <div className="grid lg:grid-cols-[400px_1fr] gap-8">
            {/* LEFT PANEL */}
            <div className={`space-y-6 ${id && 'pointer-events-none'}`}>
              <div className="p-6 rounded-2xl bg-white/8 border border-white/12 shadow-xl space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-zinc-100">Create Your Thumbnail</h2>
                  <p className="text-sm text-zinc-400">Describe your vision and let AI bring it to life</p>
                </div>
                <div className="space-y-5">
                  {/* TITLE INPUT */}
                  <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium">Title or Topic</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} placeholder="e.g., 10 Tips for Better Sleep" className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-500"></input>
                    <div className="flex justify-end">
                      <span className="text-xs text-zinc-400">{title.length}/100</span>
                    </div>
                  </div>

                  {/*These input fields for AI parameters */}

                  {/* Aspect Ratio Selector */}
                  <AspectRatioSelector value={aspectRatio} onChange={setAspectRatio} />
                 
                </div>

                {/* StyleSelector */}
                <StyleSelector value={style} onChange={setStyle} isOpen={styleDropdownOpen} setIsOpen={setStyleDropdownOpen} />

                {/* Color Scheme Selector */}
                <ColorSchemeSelector value={colorSchemeId} onChange={setColorSchemeId} />

                {/* Details */}
                <div className="space-y-2">
                  <label htmlFor="details" className="block text-sm font-medium">Additional Prompts <span className="text-zinc-400 text-xs">(optional)</span></label>
                  <textarea id="details" value={additionalDetails} onChange={(e) => setAdditionalDetails(e.target.value)} rows={3} placeholder="Describe the specific details you want in your thumbnail..." className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"></textarea>
                </div>


                {/* BUTTON */}
                {/* {!id && (
                  <button onClick={handleGenerate} className="text-[15px] w-full py-3.5 rounded-xl font-medium bg-linear-to-b from-pink-500 to-pink-600 hover:from-pink-700 disabled:cursor-not-allowed transition-colors">
                    {loading ? 'Generating...' : 'Generate Thumbnail'}
                  </button>
                )} */}
              </div>
               </div>


              {/* RIGHT PANEL */}
              
              <div>
              <div className="p-6 rounded-2xl bg-white/8 border border-white/10 shadow-xl">
                  <h2 className="text-lg font-semibold text-zinc-100 mb-4">Preview</h2>
            <PreviewPanel
              thumbnail={thumbnail as IThumbnail}
              isLoading={loading}
              aspectRatio={aspectRatio}
            />
                </div>
            </div>
            </div>
        </main>
      </div>
    </>
  )
};
export default Generate;