# Use Windows Server Core 2022 (matching windows-latest runners)
FROM mcr.microsoft.com/windows/servercore:ltsc2022

# Set shell to PowerShell for easier setup
SHELL ["powershell", "-Command", "$ErrorActionPreference = 'Stop'; $ProgressPreference = 'SilentlyContinue';"]

# 1. Install Node.js
ENV NODE_VERSION 20.11.0
# dist/v20.11.0/node-v20.11.0-win-x64.zip
RUN Invoke-WebRequest -OutFile node.zip -Uri "https://nodejs.org/dist/v$env:NODE_VERSION/node-v$env:NODE_VERSION-win-x64.zip"; \
    Expand-Archive node.zip -DestinationPath C:\; \
    Rename-Item "C:\\node-v$env:NODE_VERSION-win-x64" C:\nodejs; \
    Remove-Item node.zip
RUN SETX PATH C:\nodejs
RUN npm config set registry https://registry.npmjs.org/

WORKDIR /playwright

# 3. Copy project files
COPY package*.json ./
COPY playwright.config.ts ./

# 4. Install dependencies and Playwright Browsers
# We skip browser OS dependencies because ServerCore includes most, 
# and 'install-deps' is not supported on Windows containers.
RUN npm install
RUN npx playwright install chromium

# Run tests by default
CMD ["npx", "playwright", "test"]
