"use client";

import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { Loader2, Send, CheckCircle2, AlertCircle } from "lucide-react";

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 focus:border-[#7C6EFA] focus:bg-[#7C6EFA]/5 focus:ring-2 focus:ring-[#7C6EFA]/15 outline-none transition-all text-white placeholder:text-white/30";

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    
    setStatus("sending");
    
    // Extraire les données du formulaire
    const formData = new FormData(formRef.current);
    const templateParams = {
      user_name: formData.get('user_name') as string,
      user_email: formData.get('user_email') as string,
      user_phone: formData.get('user_phone') as string || 'Non renseigné',
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    };
    
    console.log('Sending email with params:', templateParams);
    
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );
      setStatus("success");
      formRef.current.reset();
    } catch (error) {
      console.error('EmailJS Error:', error);
      setStatus("error");
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">
            Nom complet *
          </label>
          <input type="text" name="user_name" required placeholder="Jean Dupont" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">
            Email *
          </label>
          <input type="email" name="user_email" required placeholder="jean@exemple.fr" className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">
            Téléphone
          </label>
          <input type="tel" name="user_phone" placeholder="06 XX XX XX XX" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">
            Sujet *
          </label>
          <select
            name="subject"
            required
            className={`${inputClass} [&>option]:bg-[#1A1A2E] [&>option]:text-white`}
          >
            <option value="">Choisir un sujet</option>
            <option value="Demande de devis">Demande de devis</option>
            <option value="Demande d'information">Demande d&apos;information</option>
            <option value="Support technique">Support technique</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">
          Message *
        </label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Décrivez votre besoin..."
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-[#7C6EFA] hover:bg-[#5A4ED8] disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#7C6EFA]/20"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Envoyer le message
          </>
        )}
      </button>

      {status === "success" && (
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl p-4">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <p className="text-sm">Message envoyé ! Nous vous répondrons sous 24h.</p>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p className="text-sm">Erreur d&apos;envoi. Contactez-nous à hello@lea-numerique.fr</p>
        </div>
      )}
    </form>
  );
}
