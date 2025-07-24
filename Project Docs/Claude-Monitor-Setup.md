# Claude Code Usage Monitor Setup
**Token Usage Tracking for lentilsandmillets.com Development**

---

## Overview

The Claude Code Usage Monitor is now installed and configured for your project. It provides real-time monitoring of Claude AI token consumption with machine learning-based predictions and a rich terminal interface.

## Installation Details

**Installed Version:** claude-monitor 3.0.4  
**Installation Method:** pip3 install claude-monitor  
**Python Version:** Python 3.9.6 ✅

## Quick Start

### Option 1: Use the Custom Script (Recommended)
```bash
# From the project root directory
./claude-monitor.sh

# Or specify your Claude plan
./claude-monitor.sh pro        # For Claude Pro users
./claude-monitor.sh max5       # For Claude Max5 users  
./claude-monitor.sh max20      # For Claude Max20 users
./claude-monitor.sh custom 100000  # Custom token limit
```

### Option 2: Direct Command
```bash
# Basic usage (auto-detect plan)
python3 -m claude_monitor

# Specify your Claude plan
python3 -m claude_monitor --plan pro
python3 -m claude_monitor --plan max5
python3 -m claude_monitor --plan max20

# Custom token limit
python3 -m claude_monitor --plan custom --custom-limit-tokens 100000
```

## Configuration Options

### Plan Types
- **pro**: Claude Pro subscription limits
- **max5**: Claude Max5 plan limits
- **max20**: Claude Max20 plan limits  
- **custom**: Set your own token limits

### Themes
```bash
--theme light    # Light theme
--theme dark     # Dark theme (default in our script)
--theme classic  # Classic terminal theme
--theme auto     # Auto-detect based on system
```

### Refresh Settings
```bash
--refresh-rate 5          # Update every 5 seconds (default in our script)
--refresh-per-second 1.0  # Display refresh rate (higher = more CPU usage)
```

### Timezone & Time Format
```bash
--timezone America/New_York  # Set specific timezone
--time-format 12h           # 12-hour or 24-hour format
```

## Features

### Real-time Monitoring
- ✅ **Live token consumption tracking**
- ✅ **Color-coded progress bars**
- ✅ **Machine learning predictions**
- ✅ **Usage trend analysis**

### Multiple Plan Support
- ✅ **Automatic plan detection**
- ✅ **Custom token limits**
- ✅ **Daily/monthly usage tracking**
- ✅ **Reset hour configuration**

### Advanced Features
- ✅ **Persistent settings storage**
- ✅ **Export usage data**
- ✅ **Debug logging**
- ✅ **Cross-platform compatibility**

## Usage During Development

### Recommended Workflow
1. **Start monitoring before beginning work:**
   ```bash
   ./claude-monitor.sh pro  # Replace 'pro' with your actual plan
   ```

2. **Keep monitor running in a separate terminal** while you work with Claude Code

3. **Monitor shows:**
   - Current token usage
   - Remaining tokens
   - Usage predictions
   - Daily/monthly limits

### Key Metrics to Watch
- **🟢 Green**: Safe usage levels
- **🟡 Yellow**: Approaching limits
- **🔴 Red**: Near or at token limits

### Best Practices
- **Start monitoring early** in your development session
- **Check predictions** to plan your work sessions
- **Monitor trends** to optimize your Claude usage
- **Use custom limits** if you have specific budget constraints

## Troubleshooting

### Common Issues

#### Monitor Not Starting
```bash
# If you get "command not found", use the full path:
python3 -m claude_monitor --plan pro

# Or check Python path:
which python3
python3 --version
```

#### PATH Issues
If you see warnings about scripts not being in PATH:
```bash
# Add to your ~/.zshrc or ~/.bash_profile:
export PATH="$HOME/Library/Python/3.9/bin:$PATH"

# Then reload:
source ~/.zshrc
```

#### Permission Issues
```bash
# Make sure the script is executable:
chmod +x claude-monitor.sh
```

## Advanced Configuration

### Custom Configuration File
The monitor saves preferences automatically, but you can also create custom configs:

```bash
# Clear saved configuration to start fresh
python3 -m claude_monitor --clear

# Set up with specific preferences
python3 -m claude_monitor \
  --plan pro \
  --theme dark \
  --timezone America/New_York \
  --refresh-rate 5 \
  --time-format 12h
```

### Logging and Debug
```bash
# Enable debug logging
python3 -m claude_monitor --debug

# Save logs to file
python3 -m claude_monitor --log-file claude-usage.log --log-level INFO
```

## Integration with Development Workflow

### VS Code Integration
Add a task to `.vscode/tasks.json`:
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Claude Monitor",
      "type": "shell",
      "command": "./claude-monitor.sh",
      "args": ["pro"],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "new"
      }
    }
  ]
}
```

### Terminal Session Management
```bash
# Start in background (if using tmux/screen)
tmux new-session -d -s claude-monitor './claude-monitor.sh pro'

# Attach to monitor session
tmux attach-session -t claude-monitor
```

## Cost Optimization Tips

### Using the Monitor for Budget Control
1. **Set custom limits** based on your budget
2. **Monitor daily usage** to pace your development
3. **Use predictions** to plan work sessions
4. **Track patterns** to optimize your prompting

### Example Custom Budget Setup
```bash
# If you want to limit yourself to 50K tokens per day
./claude-monitor.sh custom 50000
```

## Updates and Maintenance

### Updating the Monitor
```bash
# Update to latest version
pip3 install --upgrade claude-monitor

# Check version
python3 -m claude_monitor --version
```

### Uninstalling (if needed)
```bash
pip3 uninstall claude-monitor
```

---

## Quick Reference Commands

```bash
# Start monitoring (auto-detect plan)
./claude-monitor.sh

# Monitor with specific plan
./claude-monitor.sh pro

# Custom token limit
./claude-monitor.sh custom 100000

# Direct commands
python3 -m claude_monitor --plan pro --theme dark
python3 -m claude_monitor --help
python3 -m claude_monitor --version
python3 -m claude_monitor --clear  # Reset configuration
```

The monitor is now ready to help you track your Claude usage while developing the lentilsandmillets.com project! 🚀