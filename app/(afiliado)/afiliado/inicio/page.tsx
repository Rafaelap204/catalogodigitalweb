import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, TrendingUp, Store } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function AfiliadoInicioPage() {
  const session = await getSession();
  
  if (!session || session.nivel !== 3) {
    redirect('/login');
  }

  const afiliadoId = session.afiliado_id || session.id;
  const supabase = await createClient();

  // Buscar dados reais do afiliado
  const { data: estabelecimentos } = await (supabase
    .from('estabelecimentos') as any)
    .select('id', { count: 'exact' })
    .eq('indicado_por', afiliadoId);

  const { data: comissoes } = await (supabase
    .from('comissoes') as any)
    .select('valor, status')
    .eq('afiliado_id', afiliadoId);

  const { data: indicacoes } = await (supabase
    .from('indicacoes') as any)
    .select('id', { count: 'exact' })
    .eq('afiliado_id', afiliadoId);

  const totalEstabelecimentos = estabelecimentos?.length || 0;
  const totalIndicacoes = indicacoes?.length || 0;
  
  const totalComissoes = comissoes?.reduce((sum: number, c: any) => sum + (parseFloat(c.valor) || 0), 0) || 0;
  const comissoesPendentes = comissoes?.filter((c: any) => c.status === 'pendente').reduce((sum: number, c: any) => sum + (parseFloat(c.valor) || 0), 0) || 0;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard do Afiliado</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Estabelecimentos"
          value={totalEstabelecimentos}
          icon={<Store className="w-6 h-6" />}
          trend=""
        />
        <StatCard
          title="Total em Comissões"
          value={`R$ ${totalComissoes.toFixed(2)}`}
          icon={<DollarSign className="w-6 h-6" />}
          trend=""
        />
        <StatCard
          title="Comissões Pendentes"
          value={`R$ ${comissoesPendentes.toFixed(2)}`}
          icon={<TrendingUp className="w-6 h-6" />}
          trend=""
        />
        <StatCard
          title="Indicações"
          value={totalIndicacoes}
          icon={<Users className="w-6 h-6" />}
          trend=""
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Seus Estabelecimentos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{totalEstabelecimentos > 0 ? `${totalEstabelecimentos} estabelecimento(s) indicado(s)` : 'Nenhum estabelecimento indicado ainda'}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Comissões</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{comissoes?.length ? `${comissoes.length} comissão(ões) registrada(s)` : 'Nenhuma comissão registrada'}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  icon, 
  trend 
}: { 
  title: string; 
  value: number | string; 
  icon: React.ReactNode;
  trend: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            {trend && <p className="text-sm text-green-600 mt-1">{trend}</p>}
          </div>
          <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
