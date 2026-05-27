import { useState } from 'react';
import { Send } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ nome: '', sobrenome: '', email: '', mensagem: '' });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: integrar envio
  }

  return (
    <section id="contato" className="min-h-screen -mb-10 relative z-10 flex flex-col justify-center items-center">
      <div className="bg-white w-full max-w-3xl px-4 sm:px-6 lg:px-8 pt-10 pb-0">

        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
            Fale Conosco
          </h2>
          <p style={{ color: '#666' }}>
            Envie sua mensagem e retornaremos em breve.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-semibold text-gray-700 mb-2">
                Nome
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                required
                value={form.nome}
                onChange={handleChange}
                placeholder="Seu nome"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B3A8F] focus:border-transparent transition"
              />
            </div>
            <div>
              <label htmlFor="sobrenome" className="block text-sm font-semibold text-gray-700 mb-2">
                Sobrenome
              </label>
              <input
                id="sobrenome"
                name="sobrenome"
                type="text"
                required
                value={form.sobrenome}
                onChange={handleChange}
                placeholder="Seu sobrenome"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B3A8F] focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B3A8F] focus:border-transparent transition"
            />
          </div>

          <div>
            <label htmlFor="mensagem" className="block text-sm font-semibold text-gray-700 mb-2">
              Mensagem
            </label>
            <textarea
              id="mensagem"
              name="mensagem"
              rows={4}
              required
              value={form.mensagem}
              onChange={handleChange}
              placeholder="Escreva sua mensagem..."
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B3A8F] focus:border-transparent transition resize-none"
            />
          </div>

          <div className="text-right pb-0">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-[#1B3A8F] hover:bg-[#152e72] text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Enviar mensagem
              <Send size={18} />
            </button>
          </div>

        </form>
      </div>
    </section>
  );
}
