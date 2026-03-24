#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================"
echo "  Development Tools Checking Script"
echo "========================================"
echo ""

# Flag to track if all tools are installed
all_installed=true

# Function to check if a command exists
check_tool() {
    local tool_name=$1
    local command_name=${2:-$1}
    local version_flag=${3:---version}
    
    if command -v "$command_name" &> /dev/null; then
        local version=$($command_name $version_flag 2>&1 | head -n 1)
        echo -e "${GREEN}✓${NC} $tool_name is installed: $version"
    else
        echo -e "${RED}✗${NC} $tool_name is NOT installed"
        all_installed=false
    fi
}

echo "Checking required development tools..."
echo ""

# Check Git
check_tool "Git" "git" "--version"

# Check Docker
check_tool "Docker" "docker" "--version"

# Check Node.js
check_tool "Node.js" "node" "--version"

# Check pnpm
check_tool "pnpm" "pnpm" "--version"

echo ""
echo "========================================"

# Summary
if [ "$all_installed" = true ]; then
    echo -e "${GREEN}✓ All required tools are installed!${NC}"
    echo ""
    echo "You're ready to start development."
    exit 0
else
    echo -e "${RED}✗ Some tools are missing!${NC}"
    echo ""
    echo "Please install the missing tools:"
    echo ""
    echo "  Git:    https://git-scm.com/downloads"
    echo "  Docker: https://docs.docker.com/get-docker/"
    echo "  Node.js: https://nodejs.org/ (recommend using nvm)"
    echo "  pnpm:   npm install -g pnpm"
    echo ""
    exit 1
fi

