const fs = require('fs-extra');
const path = require('path');
const { minify: minifyJs } = require('terser');
const htmlMinifier = require('html-minifier');
const cssMinify = require('css-minify');

class BuildSystem {
    constructor() {
        this.srcDir = path.join(__dirname, '../src');
        this.distDir = path.join(__dirname, '../dist');
    }

    async build() {
        console.log('🚀 Iniciando build de produção...');
        
        try {
            // Limpar diretório dist
            await this.cleanDist();
            
            // Processar arquivos
            await this.processHTML();
            await this.processCSS();
            await this.processJS();
            await this.copyAssets();
            
            console.log('✅ Build concluído com sucesso!');
        } catch (error) {
            console.error('❌ Erro no build:', error);
            process.exit(1);
        }
    }

    async cleanDist() {
        if (await fs.pathExists(this.distDir)) {
            await fs.remove(this.distDir);
        }
        await fs.ensureDir(this.distDir);
    }

    async processHTML() {
        const htmlFiles = await fs.readdir(this.srcDir);
        
        for (const file of htmlFiles) {
            if (path.extname(file) === '.html') {
                let content = await fs.readFile(path.join(this.srcDir, file), 'utf8');
                
                // Minificar HTML
                content = htmlMinifier.minify(content, {
                    removeComments: true,
                    collapseWhitespace: true,
                    minifyJS: true,
                    minifyCSS: true,
                    removeAttributeQuotes: true,
                    useShortDoctype: true
                });
                
                await fs.writeFile(path.join(this.distDir, file), content);
                console.log(`📄 HTML minificado: ${file}`);
            }
        }
    }

    async processCSS() {
        const cssDir = path.join(this.srcDir, 'css');
        const distCssDir = path.join(this.distDir, 'css');
        
        await fs.ensureDir(distCssDir);
        
        const cssFiles = await fs.readdir(cssDir);
        
        for (const file of cssFiles) {
            if (path.extname(file) === '.css') {
                let content = await fs.readFile(path.join(cssDir, file), 'utf8');
                
                // Minificar CSS
                const result = await cssMinify.minify(content);
                
                await fs.writeFile(path.join(distCssDir, file), result);
                console.log(`🎨 CSS minificado: ${file}`);
            }
        }
    }

    async processJS() {
        const jsDir = path.join(this.srcDir, 'js');
        const distJsDir = path.join(this.distDir, 'js');
        
        await fs.ensureDir(distJsDir);
        
        const jsFiles = await fs.readdir(jsDir);
        
        for (const file of jsFiles) {
            if (path.extname(file) === '.js') {
                let content = await fs.readFile(path.join(jsDir, file), 'utf8');
                
                // Minificar JavaScript
                const result = await minifyJs(content, {
                    compress: true,
                    mangle: true
                });
                
                await fs.writeFile(path.join(distJsDir, file), result.code);
                console.log(`⚡ JavaScript minificado: ${file}`);
            }
        }
    }

    async copyAssets() {
        // Copiar imagens
        const imgSrc = path.join(this.srcDir, 'img');
        const imgDist = path.join(this.distDir, 'img');
        
        if (await fs.pathExists(imgSrc)) {
            await fs.copy(imgSrc, imgDist);
            console.log('🖼️ Imagens copiadas');
        }
        
        // Copiar outros assets
        await fs.copy(path.join(this.srcDir, 'favicon.ico'), path.join(this.distDir, 'favicon.ico'));
        console.log('📦 Assets copiados');
    }
}

// Executar build
if (require.main === module) {
    const builder = new BuildSystem();
    builder.build();
}

module.exports = BuildSystem;