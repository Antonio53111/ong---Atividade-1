const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const fs = require('fs-extra');
const path = require('path');

class ImageOptimizer {
    constructor() {
        this.srcDir = path.join(__dirname, '../src/img');
        this.distDir = path.join(__dirname, '../dist/img');
    }

    async optimize() {
        console.log('🖼️  Otimizando imagens...');
        
        try {
            await fs.ensureDir(this.distDir);
            
            // Otimizar JPEG
            await imagemin([`${this.srcDir}/*.jpg`], {
                destination: this.distDir,
                plugins: [
                    imageminMozjpeg({ quality: 80 })
                ]
            });
            
            // Otimizar PNG
            await imagemin([`${this.srcDir}/*.png`], {
                destination: this.distDir,
                plugins: [
                    imageminPngquant({ quality: [0.6, 0.8] })
                ]
            });
            
            console.log('✅ Imagens otimizadas com sucesso!');
            
            // Mostrar estatísticas
            await this.showStats();
            
        } catch (error) {
            console.error('❌ Erro ao otimizar imagens:', error);
        }
    }

    async showStats() {
        const srcFiles = await fs.readdir(this.srcDir);
        const distFiles = await fs.readdir(this.distDir);
        
        let totalSavings = 0;
        
        for (const file of srcFiles) {
            const srcPath = path.join(this.srcDir, file);
            const distPath = path.join(this.distDir, file);
            
            if (await fs.pathExists(distPath)) {
                const srcSize = (await fs.stat(srcPath)).size;
                const distSize = (await fs.stat(distPath)).size;
                const savings = srcSize - distSize;
                const percent = ((savings / srcSize) * 100).toFixed(1);
                
                totalSavings += savings;
                
                console.log(`📊 ${file}: ${this.formatBytes(srcSize)} → ${this.formatBytes(distSize)} (${percent}% menor)`);
            }
        }
        
        console.log(`💾 Economia total: ${this.formatBytes(totalSavings)}`);
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Executar otimização
if (require.main === module) {
    const optimizer = new ImageOptimizer();
    optimizer.optimize();
}