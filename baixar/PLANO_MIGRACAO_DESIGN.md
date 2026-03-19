# Plano de Migração do Design PHP para Next.js

## Situação Atual
- Sistema PHP legado com design próprio em `_core/_cdn/`
- Next.js criado do zero com design básico
- Autenticação já funciona no Next.js

## Opções para Migrar o Design

### Opção 1: Copiar Assets e Usar Layout Global (Recomendada)
**Tempo estimado:** 2-3 dias

1. **Copiar CSS/JS para public/**
   ```
   ilink-next/public/_core/_cdn/...
   ```

2. **Criar layout raiz que carrega os assets**
   - Adicionar tags `<link>` e `<script>` no layout.tsx
   - Manter estrutura head/navigation/footer do PHP

3. **Migrar páginas principais gradualmente**
   - Login
   - Dashboard admin
   - Dashboard painel
   - etc.

### Opção 2: Extrair CSS Principal e Converter para Tailwind
**Tempo estimado:** 4-5 dias

1. Analisar CSS em `_core/_cdn/panel/css/`
2. Converter classes para Tailwind
3. Adaptar componentes

### Opção 3: Manter Design Atual e Melhorar Gradualmente
**Tempo estimado:** Contínuo

1. Usar o design atual do Next.js (funcional)
2. Ir copiando elementos visuais do PHP conforme necessidade

## 📋 Análise dos Assets Principais

### CSS Essenciais (em `_core/_cdn/panel/css/`):
- `template.css` - Layout principal
- `forms.css` - Formulários
- `theme.css` - Cores/tema
- `default.css` - Estilos base

### JS Essenciais:
- `template.js` - Scripts do template
- `jquery.min.js` - Dependência
- `bootstrap.min.js` - Componentes

### Estrutura de Layout PHP:
```
head.php          → <head> com CSS
navigation.php    → Menu superior
footer.php        → Scripts JS + fechamento
```

## 🎯 Recomendação

**Seguir com Opção 3 por agora:**
- O sistema já está funcionando
- O login e redirecionamento funcionam
- Podemos ir melhorando o design gradualmente

**Ou, se quiser o design original:**
- Preciso de 2-3 dias para fazer a migração completa
- Devo copiar os assets e criar layouts compatíveis

## ❓ Pergunta para Você

**Qual prefere?**

1. **Continuar com design atual** (mais rápido, funciona agora)
2. **Migrar design original** (2-3 dias de trabalho)
3. **Fazer apenas páginas críticas** com design original (login + dashboard)

Me diga qual opção prefere que eu prossigo!
