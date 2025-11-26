export default function Terms() {
    return (
        <div className="container-custom py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Termos de Uso</h1>
            <div className="prose prose-slate dark:prose-invert max-w-none">
                <p>Última atualização: {new Date().toLocaleDateString()}</p>
                <p>Bem-vindo ao Mão Amiga. Ao usar nossa plataforma, você concorda com estes termos.</p>
                <h3>1. Objetivo</h3>
                <p>O Mão Amiga é uma plataforma que conecta doadores a beneficiários através de campanhas de financiamento coletivo.</p>
                <h3>2. Responsabilidades</h3>
                <p>Os criadores de campanhas são inteiramente responsáveis pela veracidade das informações prestadas e pelo uso adequado dos recursos arrecadados.</p>
                <h3>3. Taxas</h3>
                <p>A plataforma é gratuita e não cobra taxas sobre as doações.</p>
                {/* Mais conteúdo seria adicionado aqui */}
            </div>
        </div>
    )
}
