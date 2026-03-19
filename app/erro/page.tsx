import Link from 'next/link';

export default function ErroPage() {
  return (
    <div className="row" style={{ marginTop: '100px' }}>
      <div className="col-md-6 col-md-offset-3 text-center">
        <h1 style={{ fontSize: '120px', marginBottom: '20px' }}>404</h1>
        <h2>Página Não Encontrada</h2>
        <p className="text-muted" style={{ marginBottom: '30px' }}>
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link href="/" className="btn btn-primary btn-lg">
          <i className="lni lni-home"></i> Voltar para Início
        </Link>
      </div>
    </div>
  );
}
