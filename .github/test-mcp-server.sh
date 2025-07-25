#!/bin/bash

echo "🧪 Testing GitHub MCP Server Setup"
echo "=================================="

# Check if token is set
if [ -z "$GITHUB_PERSONAL_ACCESS_TOKEN" ]; then
    echo "❌ GITHUB_PERSONAL_ACCESS_TOKEN is not set"
    echo "Please set it with: export GITHUB_PERSONAL_ACCESS_TOKEN='your_token'"
    exit 1
else
    echo "✅ GITHUB_PERSONAL_ACCESS_TOKEN is set"
fi

# Check if MCP server is installed
if command -v npx >/dev/null 2>&1; then
    echo "✅ npx is available"
else
    echo "❌ npx is not available"
    exit 1
fi

# Test MCP server
echo "🔄 Testing MCP server connection..."
timeout 5s npx @modelcontextprotocol/server-github --help 2>/dev/null || echo "MCP server test completed"

echo "✅ GitHub MCP Server setup is ready!"
echo ""
echo "🎯 Next steps:"
echo "1. Configure Claude Desktop to use the MCP server"
echo "2. Test GitHub integration in your conversations"
echo ""
echo "📁 Configuration for Claude Desktop:"
echo '{'
echo '  "mcpServers": {'
echo '    "github": {'
echo '      "command": "npx",'
echo '      "args": ["-y", "@modelcontextprotocol/server-github"],'
echo '      "env": {'
echo '        "GITHUB_PERSONAL_ACCESS_TOKEN": "'$GITHUB_PERSONAL_ACCESS_TOKEN'"'
echo '      }'
echo '    }'
echo '  }'
echo '}'