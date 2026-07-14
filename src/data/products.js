const base = [
  { id: 1, name: "GPT-4 Business Architect", category: "Prompts IA", price: 29.99, image: "https://images.unsplash.com/photo-1675557009875-436f595b1612?q=80&w=800", description: "Ingeniería de prompts avanzada." },
  { id: 2, name: "Midjourney Cinematic V6", category: "Diseño", price: 25.00, image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800", description: "Estilos fotorrealistas de élite." },
  { id: 3, name: "Auto-Content Machine", category: "Automatización", price: 97.00, image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800", description: "Blueprint de automatización masiva." },
  { id: 4, name: "Master Agentes IA", category: "Cursos", price: 199.00, image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800", description: "Curso de LangChain y Python." }
];
export const allProducts = Array.from({ length: 44 }, (_, i) => ({ ...base[i % base.length], id: i + 1 }));