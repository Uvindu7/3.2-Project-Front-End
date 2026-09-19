import React, { useState } from 'react';
import contactArt from '../../assets/contact-art.png';

const Contact = () => {
  const [result, setResult] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending...");
    const formData = new FormData(event.target);
    formData.append("access_key", "14f3b7e2-5a70-47e3-8974-c67de6f94902");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      setResult(data.success ? "Message sent successfully!" : "Error sending message.");
      if (data.success) {
        event.target.reset();
      }
    } catch (error) {
      setResult("Error sending message.");
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-[1200px] mx-auto">
      <div className="mb-12">
        <h1 className="text-[3.5rem] font-bold text-text-main mb-4 leading-tight">Contact</h1>
        <p className="text-text-muted max-w-[500px] text-[1.1rem] leading-relaxed">
          Experience LIYARA Clothing. Whether you have inquiries regarding our latest collections, 
          custom orders, or styling advice, our studio is here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Contact Form Section */}
        <div className="bg-white rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50">
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-[#333] uppercase">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  placeholder="Enter your name" 
                  className="w-full bg-[#f8f8f8] border border-gray-100 rounded-xl px-4 py-4 text-sm outline-none focus:border-black/20 transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-[#333] uppercase">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="email@example.com" 
                  className="w-full bg-[#f8f8f8] border border-gray-100 rounded-xl px-4 py-4 text-sm outline-none focus:border-black/20 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-[#333] uppercase">Subject</label>
              <input 
                type="text" 
                name="subject"
                required
                placeholder="What is this regarding?" 
                className="w-full bg-[#f8f8f8] border border-gray-100 rounded-xl px-4 py-4 text-sm outline-none focus:border-black/20 transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-[#333] uppercase">Message</label>
              <textarea 
                name="message"
                required
                rows="5" 
                placeholder="Type your message here..." 
                className="w-full bg-[#f8f8f8] border border-gray-100 rounded-xl px-4 py-4 text-sm outline-none focus:border-black/20 transition-all font-medium resize-none"
              ></textarea>
            </div>

            <button type="submit" className="bg-black text-white px-8 py-4 rounded-xl text-[12px] font-bold tracking-widest hover:bg-[#333] transition-all flex items-center gap-3 group">
              SEND INQUIRY
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
            {result && (
              <p className={`text-sm mt-4 ${result.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                {result}
              </p>
            )}
          </form>
        </div>

        {/* Info and Image Section */}
        <div className="space-y-12">
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src={contactArt} 
              alt="Premium Abstract Art" 
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" 
            />
          </div>

          <div className="space-y-10 pl-2">
            <div>
              <h3 className="text-xl font-bold mb-4">Support</h3>
              <div className="space-y-1">
                <p className="text-[10px] font-bold tracking-widest text-text-muted uppercase">Direct Contact</p>
                <a href="mailto:liyaracloathing@gmail.com" className="text-sm font-medium hover:underline">liyaracloathing@gmail.com</a>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Direct Contact</h3>
              <div className="flex flex-col gap-6 md:flex-row md:gap-12">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold tracking-widest text-text-muted uppercase">Phone</p>
                  <p className="text-sm font-medium">+1 (212) 555-0198</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold tracking-widest text-text-muted uppercase">WhatsApp</p>
                  <a href="#" className="text-sm font-medium flex items-center gap-2 hover:opacity-70">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.483 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.308 1.656zm6.757-4.242c1.474.873 2.91 1.307 4.497 1.308 5.201 0 9.431-4.23 9.432-9.431 0-2.521-.983-4.891-2.77-6.678s-4.157-2.77-6.679-2.77c-5.204 0-9.433 4.23-9.433 9.432 0 1.932.569 3.389 1.593 5.153l-.992 3.626 3.752-.984zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    Message us on WhatsApp
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-10">
              <h3 className="text-xl font-bold mb-6">Follow</h3>
              <div className="flex gap-8">
                <a href="#" className="text-[10px] font-bold tracking-widest text-text-muted hover:text-black uppercase transition-colors">Instagram</a>
                <a href="#" className="text-[10px] font-bold tracking-widest text-text-muted hover:text-black uppercase transition-colors">Linkedin</a>
                <a href="#" className="text-[10px] font-bold tracking-widest text-text-muted hover:text-black uppercase transition-colors">Behance</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
