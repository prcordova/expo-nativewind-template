#!/bin/bash

# Script para configurar o repositório Git oficial do Melter App
echo "🔧 Configurando repositório oficial Melter App..."

# Remover pasta .git antiga se existir (para começar do zero)
if [ -d ".git" ]; then
    echo "🗑️ Removendo histórico antigo..."
    rm -rf .git
fi

# Inicializar Git
echo "📦 Inicializando novo repositório..."
git init

# Adicionar todos os arquivos
echo "📝 Adicionando arquivos..."
git add .

# Fazer commit inicial profissional
echo "💾 Criando commit inicial..."
git commit -m "🚀 feat: initial commit - Melter App Official v1.0.0

✨ Core Features:
- Feed with Stories, Posts and Ads
- Real-time Chat & Messages
- Friends and Relationships system
- Public User Profiles with dynamic styling
- Native Camera and Media support
- Secure Auth with 2FA support"

echo "✅ Repositório local criado com sucesso!"
echo ""
echo "📋 Próximos passos no terminal:"
echo "1. git remote add origin https://github.com/seu-usuario/melter-app.git"
echo "2. git branch -M main"
echo "3. git push -u origin main"

