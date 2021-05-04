function CPTS-Clean {
    Remove-Item -Recurse dist -ErrorAction SilentlyContinue
    Remove-Item src/*.js
    $targets = "cpts.zip", "cpts-src.tar.bz2", "cpts-src.zip"
    Remove-Item $targets -ErrorAction SilentlyContinue
}

function CPTS-Build {
    npm install
    npm run build
}

function CPTS-Pack {
    Compress-Archive -Path dist/* -DestinationPath cpts.zip -ErrorAction Stop
}

function CPTS-SourceBuild {
    CPTS-Clean
    $files = "LICENSE", "Makefile", "package-lock.json", "package.json", "win_firefox.ps1", "README.md", "tsconfig.json", "webpack.config.js", "public", "src"
    Compress-Archive -Path $files -DestinationPath cpts-src.zip -ErrorAction Stop
}

$func = $args[0]

if ($func -eq "clean") {
    CPTS-Clean
} elseif ($func -eq "pack") {
    CPTS-Clean
    CPTS-Build
    CPTS-Pack
} elseif ($func -eq "sdist") {
    CPTS-Clean
    CPTS-SourceBuild
} else {
    Write-Output "Error: clean, pack, or sdist"
}
