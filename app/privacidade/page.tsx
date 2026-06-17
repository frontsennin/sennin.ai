import Link from 'next/link'

export const metadata = {
  title: 'Política de Privacidade — Sennin.ai',
}

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 px-6 py-4">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
          Sennin.ai
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">Política de Privacidade</h1>
          <p className="text-zinc-400 text-sm mt-2">Última atualização: junho de 2026</p>
        </div>

        <Section title="1. Sobre o Sennin.ai">
          <p>O Sennin.ai é uma ferramenta de análise e criação de conteúdo para Instagram. Este documento descreve como coletamos, usamos e protegemos seus dados pessoais.</p>
        </Section>

        <Section title="2. Dados que coletamos">
          <ul className="list-disc list-inside space-y-2 text-zinc-300">
            <li><strong>Dados de conta:</strong> nome, endereço de e-mail e foto de perfil fornecidos no cadastro ou via Login com Google/Facebook.</li>
            <li><strong>Dados do Instagram:</strong> nome de usuário, número de seguidores, posts, taxa de engajamento e métricas de mídia — acessados via Instagram Graph API após sua autorização explícita.</li>
            <li><strong>Conteúdo gerado:</strong> análises de perfil, carrosséis e roteiros que você cria dentro da plataforma.</li>
          </ul>
        </Section>

        <Section title="3. Como usamos os dados">
          <ul className="list-disc list-inside space-y-2 text-zinc-300">
            <li>Exibir métricas e insights do seu perfil no dashboard.</li>
            <li>Gerar análises, carrosséis e roteiros usando inteligência artificial (Google Gemini).</li>
            <li>Salvar seu histórico de conteúdo gerado para referência futura.</li>
          </ul>
          <p className="mt-3">Não vendemos, alugamos ou compartilhamos seus dados com terceiros para fins comerciais.</p>
        </Section>

        <Section title="4. Permissões do Instagram / Facebook">
          <p>Solicitamos as seguintes permissões ao conectar sua conta:</p>
          <ul className="list-disc list-inside space-y-2 text-zinc-300 mt-2">
            <li><code className="text-violet-400">instagram_basic</code> — Leitura do perfil e métricas básicas.</li>
            <li><code className="text-violet-400">instagram_manage_insights</code> — Acesso a insights de alcance e engajamento.</li>
            <li><code className="text-violet-400">pages_show_list</code> — Listagem de Páginas do Facebook vinculadas.</li>
            <li><code className="text-violet-400">pages_read_engagement</code> — Leitura de dados de engajamento da Página.</li>
          </ul>
          <p className="mt-3">Você pode revogar essas permissões a qualquer momento nas configurações do Facebook/Instagram.</p>
        </Section>

        <Section title="5. Armazenamento e segurança">
          <p>Os dados são armazenados no Google Firebase (Firestore) com acesso restrito por autenticação. Cada usuário acessa somente seus próprios dados. Tokens de acesso do Instagram são armazenados de forma segura e usados apenas para requisições à API em seu nome.</p>
        </Section>

        <Section title="6. Seus direitos">
          <ul className="list-disc list-inside space-y-2 text-zinc-300">
            <li>Acessar todos os seus dados a qualquer momento pelo dashboard.</li>
            <li>Solicitar a exclusão completa de todos os seus dados.</li>
            <li>Revogar o acesso ao Instagram sem excluir sua conta Sennin.ai.</li>
          </ul>
          <p className="mt-3">
            Para solicitar a exclusão dos seus dados,{' '}
            <Link href="/excluir-dados" className="text-violet-400 hover:text-violet-300">
              clique aqui
            </Link>.
          </p>
        </Section>

        <Section title="7. Contato">
          <p>Dúvidas sobre privacidade? Entre em contato: <a href="mailto:contato@sennin.ai" className="text-violet-400 hover:text-violet-300">contato@sennin.ai</a></p>
        </Section>
      </main>

      <footer className="border-t border-zinc-800 px-6 py-4 text-center text-xs text-zinc-600">
        © 2026 Sennin.ai
      </footer>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-zinc-100">{title}</h2>
      <div className="text-zinc-400 leading-relaxed space-y-2">{children}</div>
    </section>
  )
}
