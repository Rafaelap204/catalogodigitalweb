import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Package, Users, TrendingUp } from "lucide-react";

export default async function PainelInicioPage() {
  const session = await getSession();
  
  if (!session || session.nivel !== 2) {
    redirect('/login');
  }

  const estabelecimentoId = session.estabelecimento_id;
  const supabase = createClient();
  
  // Buscar estatísticas do estabelecimento
  const { count: totalProdutos } = await (supabase
    .from("produtos") as any)
    .select("*", { count: "exact", head: true })
    .eq("rel_estabelecimentos_id", estabelecimentoId);
    
  const { count: totalPedidos } = await (supabase
    .from("pedidos") as any)
    .select("*", { count: "exact", head: true })
    .eq("estabelecimento_id", estabelecimentoId);

  // Pedidos de hoje
  const hoje = new Date().toISOString().split('T')[0];
  const { count: pedidosHoje } = await (supabase
    .from("pedidos") as any)
    .select("*", { count: "exact", head: true })
    .eq("estabelecimento_id", estabelecimentoId)
    .gte("created_at", hoje);

  // Faturamento total
  const { data: pedidos } = await (supabase
    .from("pedidos") as any)
    .select("valor_total")
    .eq("estabelecimento_id", estabelecimentoId)
    .eq("status", "pago");
  
  const faturamento = pedidos?.reduce((sum: number, p: any) => sum + (parseFloat(p.valor_total) || 0), 0) || 0;

  // Pedidos recentes
  const { data: pedidosRecentes } = await (supabase
    .from("pedidos") as any)
    .select("id, cliente_nome, valor_total, status, created_at")
    .eq("estabelecimento_id", estabelecimentoId)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard da Loja</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Pedidos Hoje"
          value={pedidosHoje || 0}
          icon={<ShoppingBag className="w-6 h-6" />}
          trend=""
        />
        <StatCard
          title="Total de Produtos"
          value={totalProdutos || 0}
          icon={<Package className="w-6 h-6" />}
          trend=""
        />
        <StatCard
          title="Total de Pedidos"
          value={totalPedidos || 0}
          icon={<Users className="w-6 h-6" />}
          trend=""
        />
        <StatCard
          title="Faturamento"
          value={`R$ ${faturamento.toFixed(2)}`}
          icon={<TrendingUp className="w-6 h-6" />}
          trend=""
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {pedidosRecentes && pedidosRecentes.length > 0 ? (
              <div className="space-y-3">
                {pedidosRecentes.map((pedido: any) => (
                  <div key={pedido.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{pedido.cliente_nome || 'Cliente'}</p>
                      <p className="text-sm text-gray-500">{new Date(pedido.created_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">R$ {parseFloat(pedido.valor_total).toFixed(2)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${pedido.status === 'pago' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {pedido.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Nenhum pedido recente</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Dados de produtos mais vendidos serão exibidos aqui</p>
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
