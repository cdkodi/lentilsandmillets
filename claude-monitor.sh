#!/bin/bash

# Claude Code Usage Monitor Script
# For lentilsandmillets.com project

echo "🔍 Starting Claude Code Usage Monitor..."
echo "💡 This will help track your Claude token usage while working on the project"
echo ""

# Check if user wants to specify a plan
if [ "$1" = "pro" ]; then
    echo "📊 Using Claude Pro plan settings"
    python3 -m claude_monitor --plan pro --theme dark --refresh-rate 5
elif [ "$1" = "max5" ]; then
    echo "📊 Using Claude Max5 plan settings"
    python3 -m claude_monitor --plan max5 --theme dark --refresh-rate 5
elif [ "$1" = "max20" ]; then
    echo "📊 Using Claude Max20 plan settings"  
    python3 -m claude_monitor --plan max20 --theme dark --refresh-rate 5
elif [ "$1" = "custom" ]; then
    if [ -z "$2" ]; then
        echo "❌ Please specify token limit for custom plan"
        echo "Usage: ./claude-monitor.sh custom 100000"
        exit 1
    fi
    echo "📊 Using custom plan with $2 tokens"
    python3 -m claude_monitor --plan custom --custom-limit-tokens "$2" --theme dark --refresh-rate 5
else
    echo "📊 Using default settings (auto-detect plan)"
    echo "💡 Available options:"
    echo "   ./claude-monitor.sh pro"
    echo "   ./claude-monitor.sh max5" 
    echo "   ./claude-monitor.sh max20"
    echo "   ./claude-monitor.sh custom 100000"
    echo ""
    python3 -m claude_monitor --theme dark --refresh-rate 5
fi