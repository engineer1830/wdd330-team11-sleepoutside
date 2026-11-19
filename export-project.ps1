
# ==========================================
# PROJECT EXPORTER
# Exports project files into one TXT file
# ==========================================

$ProjectPath = Get-Location
$OutputFile = Join-Path $ProjectPath "project-export.txt"

# Directories to ignore
$ExcludedDirectories = @(
    "node_modules",
    ".git",
    "dist",
    "build",
    ".vite",
    "coverage",
    ".next",
    ".idea",
    ".vscode"
)

# Files to ignore
$ExcludedFiles = @(
    "project-export.txt",
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    ".env",
    ".env.local"
)

# File extensions to include
$IncludedExtensions = @(
    ".html",
    ".css",
    ".scss",
    ".js",
    ".mjs",
    ".cjs",
    ".json",
    ".md",
    ".txt",
    ".xml",
    ".svg",
    ".yml",
    ".yaml",
    ".sql",
    ".ps1",
    ".ts",
    ".tsx",
    ".jsx",
    ".gitignore",
    ".config"
)

# Start export
"PROJECT EXPORT" | Out-File $OutputFile -Encoding utf8
"Project: $ProjectPath" | Out-File $OutputFile -Append -Encoding utf8
"Export date: $(Get-Date)" | Out-File $OutputFile -Append -Encoding utf8

"`n========== PROJECT FILES ==========`n" |
    Out-File $OutputFile -Append -Encoding utf8

# Get all files recursively
$Files = Get-ChildItem -Path $ProjectPath -Recurse -File |
    Where-Object {
        $RelativePath = $_.FullName.Substring($ProjectPath.Path.Length).TrimStart('\','/')

        $DirectoryExcluded = $false

        foreach ($Directory in $ExcludedDirectories) {
            if ($RelativePath -split '[/\\]' -contains $Directory) {
                $DirectoryExcluded = $true
                break
            }
        }

        $ExtensionIncluded = (
            $IncludedExtensions -contains $_.Extension -or
            $_.Name -in @(".gitignore", ".npmrc", ".prettierrc")
        )

        -not $DirectoryExcluded -and
        $_.Name -notin $ExcludedFiles -and
        $ExtensionIncluded
    } |
    Sort-Object FullName

# Export every file
foreach ($File in $Files) {

    $RelativePath = $File.FullName.Substring(
        $ProjectPath.Path.Length
    ).TrimStart('\','/')

    "`n`n==================================================" |
        Out-File $OutputFile -Append -Encoding utf8

    "FILE: $RelativePath" |
        Out-File $OutputFile -Append -Encoding utf8

    "==================================================`n" |
        Out-File $OutputFile -Append -Encoding utf8

    Get-Content $File.FullName -Raw |
        Out-File $OutputFile -Append -Encoding utf8
}

"`n========== EXPORT COMPLETED ==========" |
    Out-File $OutputFile -Append -Encoding utf8

"Total files exported: $($Files.Count)" |
    Out-File $OutputFile -Append -Encoding utf8

Write-Host " "
Write-Host "Export completed successfully!" -ForegroundColor Green
Write-Host "Files exported: $($Files.Count)"
Write-Host "Output: $OutputFile"
