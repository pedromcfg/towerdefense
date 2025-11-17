/**
 * DEFESA DA ALDEIA - TOWER DEFENSE
 * 
 * Jogo Tower Defense medieval em JavaScript puro
 * Código educativo e bem comentado para alunos iniciantes
 */

// ============================================
// SISTEMA DE CARREGAMENTO DE IMAGENS (OPÇÃO B)
// ============================================

/**
 * Objeto que guarda todas as imagens carregadas
 * Cada chave corresponde a um sprite do jogo
 */
const IMAGES = {
    // Torres antigas (do tileset - manter para compatibilidade)
    towerShort: null,
    towerTall: null,
    towerMagic: null,
    
    // Torres novas (componentes separados)
    // Estrutura: tower[towerNumber][component][upgradeLevel]
    // Exemplo: tower1.throwerBack.basic, tower1.base.basic, tower1.throwerFront.basic
    tower1: {
        throwerBack: { basic: null, upgrade: null },
        base: { basic: null, upgrade: null, premium: null },
        throwerFront: { basic: null, upgrade: null },
        projectile: [], // Array com 5 frames: [0] = projétil, [1-4] = explosão
        animation: [], // Array com 9 frames da animação de disparo (tower1_1 a tower1_9) - DEPRECADO
        // Novas animações por nível
        animationBasic: [],    // 9 frames da torre basic
        animationUpgrade: [],  // 9 frames da torre upgrade
        animationPremium: []   // 9 frames da torre premium
    },
    tower2: {
        throwerBack: { basic: null, upgrade: null },
        base: { basic: null, upgrade: null, premium: null },
        throwerFront: { basic: null, upgrade: null },
        projectile: [] // Array com 5 frames: [0] = projétil, [1-4] = explosão
    },
    
    // Terrenos (tiles de ground)
    ground52: null,  // Tile principal do terreno
    ground41: null,  // Tile da estrada/caminho
    
    // Props decorativos (opcional)
    house: null,
    tree: null,
    rock: null,
    
    // GUI - Elementos de interface
    mainMenu: null,
    buttons: null,  // Sprite sheet com todos os botões
    settings: null,
    icons: null,   // Sprite sheet com todos os ícones
    
    // GUI - Sprites recortados (serão preenchidos dinamicamente)
    buttonNormal: null,      // Botão no estado normal
    buttonHover: null,        // Botão no estado hover
    buttonPressed: null,      // Botão no estado pressionado
    iconCoin: null,          // Ícone de moeda
    iconHeart: null,         // Ícone de vida
    iconWave: null,          // Ícone de wave
    winCoin: null,           // Moeda que aparece quando inimigo morre
    
    // Monstros - Sprites de caminhada (Walking) e morte (Dying)
    // Cada monstro tem suas animações
    monster1Walking: [],
    monster1Dying: [],
    monster2Walking: [],
    monster2Dying: [],
    monster3Walking: [],
    monster3Dying: [],
    monster4Walking: [],
    monster4Dying: [],
    monster5Walking: [],
    monster5Dying: [],
    monster6Walking: [],
    monster6Dying: [],
    monster7Walking: [],
    monster7Dying: [],
    monster8Walking: [],
    monster8Dying: [],
    monster9Walking: [],
    monster9Dying: [],
    monster10Walking: [],
    monster10Dying: [],
};

/**
 * Carrega uma imagem e guarda no objeto IMAGES
 * @param {string} key - Chave para guardar a imagem (ex: "towerShort")
 * @param {string} path - Caminho do arquivo PNG
 * @returns {Promise<Image>} - Promise que resolve quando a imagem carregar
 */
function loadImage(key, path) {
    // Retorna uma Promise (promessa) que será resolvida quando a imagem carregar
    return new Promise((resolve, reject) => {
        // Cria um novo objeto Image do HTML5
        const img = new Image();
        
        // Quando a imagem carregar com sucesso
        img.onload = () => {
            // Guarda a imagem no objeto IMAGES usando a chave fornecida
            IMAGES[key] = img;
            console.log(`✓ Carregado: ${key}`);
            // Resolve a Promise com a imagem carregada
            resolve(img);
        };
        
        // Se houver erro ao carregar a imagem
        img.onerror = () => {
            console.warn(`⚠ Erro ao carregar: ${path} (usando fallback)`);
            // Define como null para permitir que o jogo continue (usará fallback)
            IMAGES[key] = null;
            // Resolve mesmo assim (não rejeita) para não quebrar o jogo
            resolve(null);
        };
        
        // Define o caminho da imagem (isso inicia o carregamento)
        img.src = path;
    });
}

/**
 * Carrega uma sequência de animação (múltiplos frames)
 * @param {string} key - Chave base para guardar (ex: "monster1Walking")
 * @param {string} basePath - Caminho base (ex: "assets/monsters/Monster_1/PNG/PNG Sequences/Walking")
 * @param {string} animationName - Nome da animação (ex: "Walking", "Dying")
 * @param {number} frameCount - Número de frames (padrão: 18)
 * @returns {Promise<Array>} - Promise que resolve com array de imagens
 */
function loadAnimation(key, basePath, animationName, frameCount = 18) {
    // Carrega uma sequência de imagens (frames) para criar uma animação
    return new Promise((resolve) => {
        const images = []; // Array que vai guardar todos os frames da animação
        let loaded = 0; // Contador de quantos frames já carregaram
        let hasError = false; // Flag para saber se houve erro (evita múltiplos avisos)
        
        // Loop para carregar cada frame da animação
        for (let i = 0; i < frameCount; i++) {
            // Formata o número do frame com zeros à esquerda (000, 001, 002, etc.)
            const frameNum = i.toString().padStart(3, '0');
            // Monta o caminho completo do arquivo PNG do frame
            const path = `${basePath}/0_Monster_${animationName}_${frameNum}.png`;
            const img = new Image();
            
            // Quando o frame carregar com sucesso
            img.onload = () => {
                // Guarda o frame no array na posição correta
                images[i] = img;
                loaded++; // Incrementa o contador
                // Se todos os frames carregaram
                if (loaded === frameCount) {
                    // Guarda o array completo de frames no objeto IMAGES
                    IMAGES[key] = images;
                    console.log(`✓ Animação carregada: ${key} (${frameCount} frames)`);
                    // Resolve a Promise com o array de imagens
                    resolve(images);
                }
            };
            
            // Se houver erro ao carregar um frame
            img.onerror = () => {
                // Mostra aviso apenas uma vez
                if (!hasError) {
                    console.warn(`⚠ Erro ao carregar animação: ${key} (usando fallback)`);
                    hasError = true;
                }
                // Define como null (fallback será usado)
                images[i] = null;
                loaded++; // Incrementa mesmo assim para continuar
                // Se todos os frames foram processados (mesmo com erros)
                if (loaded === frameCount) {
                    IMAGES[key] = images;
                    resolve(images);
                }
            };
            
            // Inicia o carregamento do frame
            img.src = path;
        }
    });
}

/**
 * Carrega todas as imagens necessárias para o jogo
 * @returns {Promise<boolean>} - true se todas carregaram, false caso contrário
 */
async function loadAllImages() {
    console.log('🔄 Carregando imagens...');
    
    try {
        // Carrega imagens estáticas primeiro
        await Promise.all([
            // Torres
            loadImage('towerShort', 'assets/tileset/PNG/Top-Down Simple Summer_Prop - Watchtower Short.png'),
            loadImage('towerTall', 'assets/tileset/PNG/Top-Down Simple Summer_Prop - Watchtower Tall.png'),
            loadImage('towerMagic', 'assets/tileset/PNG/Top-Down Simple Summer_Prop - Magic Stone Tower.png'),
            
            // Terrenos
            loadImage('ground52', 'assets/tileset/PNG/Top-Down Simple Summer_Ground 52.png'),  // Terreno principal
            loadImage('ground41', 'assets/tileset/PNG/Top-Down Simple Summer_Ground 41.png'),  // Estrada/caminho
            
            // Props (opcional, para decoração futura)
            loadImage('house', 'assets/tileset/PNG/Top-Down Simple Summer_Prop - House.png'),
            loadImage('tree', 'assets/tileset/PNG/Top-Down Simple Summer_Prop - Tree Medium.png'),
            loadImage('rock', 'assets/tileset/PNG/Top-Down Simple Summer_Prop - Rock 01.png'),
            
            // GUI - Elementos de interface
            loadImage('mainMenu', 'assets/GUI/PNG/Main_menu.png'),
            loadImage('buttons', 'assets/GUI/PNG/Buttons.png'),
            loadImage('settings', 'assets/GUI/PNG/Settings.png'),
            loadImage('icons', 'assets/GUI/PNG/Icons.png'),
            loadImage('winCoin', 'assets/GUI/PNG/winCoin.png'),
            
            // Torres novas (tower1 e tower2) - componentes separados
            // Tower 1
            loadImage('tower1_throwerBackBasic', 'assets/towers/PNG/tower1/throwerBackBasic1.png'),
            loadImage('tower1_throwerBackUpgrade', 'assets/towers/PNG/tower1/throwerBackUpgrade1.png'),
            loadImage('tower1_baseBasic', 'assets/towers/PNG/tower1/baseBasic1.png'),
            loadImage('tower1_baseUpgrade', 'assets/towers/PNG/tower1/baseUpgrade1.png'),
            loadImage('tower1_basePremium', 'assets/towers/PNG/tower1/basePremium1.png'),
            loadImage('tower1_throwerFrontBasic', 'assets/towers/PNG/tower1/throwerFrontBasic1.png'),
            loadImage('tower1_throwerFrontUpgrade', 'assets/towers/PNG/tower1/throwerFrontUpgrade1.png'),
            // Tower 1 - Projéteis (5 frames: projétil + 4 frames de explosão)
            loadImage('tower1_projectile1', 'assets/towers/PNG/tower1/projectile1_1.png'),
            loadImage('tower1_projectile2', 'assets/towers/PNG/tower1/projectile1_2.png'),
            loadImage('tower1_projectile3', 'assets/towers/PNG/tower1/projectile1_3.png'),
            loadImage('tower1_projectile4', 'assets/towers/PNG/tower1/projectile1_4.png'),
            loadImage('tower1_projectile5', 'assets/towers/PNG/tower1/projectile1_5.png'),
            // Tower 1 - Animações de disparo por nível (9 frames cada)
            // Basic
            loadImage('tower1_basic_1', 'assets/towers/PNG/tower1/tower1_basic/tower1_basic_1.png'),
            loadImage('tower1_basic_2', 'assets/towers/PNG/tower1/tower1_basic/tower1_basic_2.png'),
            loadImage('tower1_basic_3', 'assets/towers/PNG/tower1/tower1_basic/tower1_basic_3.png'),
            loadImage('tower1_basic_4', 'assets/towers/PNG/tower1/tower1_basic/tower1_basic_4.png'),
            loadImage('tower1_basic_5', 'assets/towers/PNG/tower1/tower1_basic/tower1_basic_5.png'),
            loadImage('tower1_basic_6', 'assets/towers/PNG/tower1/tower1_basic/tower1_basic_6.png'),
            loadImage('tower1_basic_7', 'assets/towers/PNG/tower1/tower1_basic/tower1_basic_7.png'),
            loadImage('tower1_basic_8', 'assets/towers/PNG/tower1/tower1_basic/tower1_basic_8.png'),
            loadImage('tower1_basic_9', 'assets/towers/PNG/tower1/tower1_basic/tower1_basic_9.png'),
            // Upgrade
            loadImage('tower1_upgrade_1', 'assets/towers/PNG/tower1/tower1_upgrade/tower1_upgrade_1.png'),
            loadImage('tower1_upgrade_2', 'assets/towers/PNG/tower1/tower1_upgrade/tower1_upgrade_2.png'),
            loadImage('tower1_upgrade_3', 'assets/towers/PNG/tower1/tower1_upgrade/tower1_upgrade_3.png'),
            loadImage('tower1_upgrade_4', 'assets/towers/PNG/tower1/tower1_upgrade/tower1_upgrade_4.png'),
            loadImage('tower1_upgrade_5', 'assets/towers/PNG/tower1/tower1_upgrade/tower1_upgrade_5.png'),
            loadImage('tower1_upgrade_6', 'assets/towers/PNG/tower1/tower1_upgrade/tower1_upgrade_6.png'),
            loadImage('tower1_upgrade_7', 'assets/towers/PNG/tower1/tower1_upgrade/tower1_upgrade_7.png'),
            loadImage('tower1_upgrade_8', 'assets/towers/PNG/tower1/tower1_upgrade/tower1_upgrade_8.png'),
            loadImage('tower1_upgrade_9', 'assets/towers/PNG/tower1/tower1_upgrade/tower1_upgrade_9.png'),
            // Premium
            loadImage('tower1_premium_1', 'assets/towers/PNG/tower1/tower1_premium/tower1_premium_1.png'),
            loadImage('tower1_premium_2', 'assets/towers/PNG/tower1/tower1_premium/tower1_premium_2.png'),
            loadImage('tower1_premium_3', 'assets/towers/PNG/tower1/tower1_premium/tower1_premium_3.png'),
            loadImage('tower1_premium_4', 'assets/towers/PNG/tower1/tower1_premium/tower1_premium_4.png'),
            loadImage('tower1_premium_5', 'assets/towers/PNG/tower1/tower1_premium/tower1_premium_5.png'),
            loadImage('tower1_premium_6', 'assets/towers/PNG/tower1/tower1_premium/tower1_premium_6.png'),
            loadImage('tower1_premium_7', 'assets/towers/PNG/tower1/tower1_premium/tower1_premium_7.png'),
            loadImage('tower1_premium_8', 'assets/towers/PNG/tower1/tower1_premium/tower1_premium_8.png'),
            loadImage('tower1_premium_9', 'assets/towers/PNG/tower1/tower1_premium/tower1_premium_9.png'),
            
            // Tower 2
            loadImage('tower2_throwerBackBasic', 'assets/towers/PNG/tower2/throwerBackBasic2.png'),
            loadImage('tower2_throwerBackUpgrade', 'assets/towers/PNG/tower2/throwerBackUpgrade2.png'),
            loadImage('tower2_baseBasic', 'assets/towers/PNG/tower2/baseBasic2.png'),
            loadImage('tower2_baseUpgrade', 'assets/towers/PNG/tower2/baseUpgrade2.png'),
            loadImage('tower2_basePremium', 'assets/towers/PNG/tower2/basePremium2.png'),
            loadImage('tower2_throwerFrontBasic', 'assets/towers/PNG/tower2/throwerFrontBasic2.png'),
            loadImage('tower2_throwerFrontUpgrade', 'assets/towers/PNG/tower2/throwerFrontUpgrade2.png'),
            // Tower 2 - Projéteis (5 frames: projétil + 4 frames de explosão)
            loadImage('tower2_projectile1', 'assets/towers/PNG/tower2/projectile2_1.png'),
            loadImage('tower2_projectile2', 'assets/towers/PNG/tower2/projectile2_2.png'),
            loadImage('tower2_projectile3', 'assets/towers/PNG/tower2/projectile2_3.png'),
            loadImage('tower2_projectile4', 'assets/towers/PNG/tower2/projectile2_4.png'),
            loadImage('tower2_projectile5', 'assets/towers/PNG/tower2/projectile2_5.png'),
        ]);
        
        console.log('🔄 Carregando animações de monstros...');
        
        // Carrega animações de todos os 10 monstros
        // Monster 1-5 usam "Fly", Monster 6-10 usam "Walking"
        await Promise.all([
            // Monster 1 (usa Fly)
            loadAnimation('monster1Walking', 'assets/monsters/Monster_1/PNG/PNG Sequences/Fly', 'Fly'),
            loadAnimation('monster1Dying', 'assets/monsters/Monster_1/PNG/PNG Sequences/Dying', 'Dying'),
            
            // Monster 2 (usa Fly)
            loadAnimation('monster2Walking', 'assets/monsters/Monster_2/PNG/PNG Sequences/Fly', 'Fly'),
            loadAnimation('monster2Dying', 'assets/monsters/Monster_2/PNG/PNG Sequences/Dying', 'Dying'),
            
            // Monster 3 (usa Fly)
            loadAnimation('monster3Walking', 'assets/monsters/Monster_3/PNG/PNG Sequences/Fly', 'Fly'),
            loadAnimation('monster3Dying', 'assets/monsters/Monster_3/PNG/PNG Sequences/Dying', 'Dying'),
            
            // Monster 4 (usa Fly)
            loadAnimation('monster4Walking', 'assets/monsters/Monster_4/PNG/PNG Sequences/Fly', 'Fly'),
            loadAnimation('monster4Dying', 'assets/monsters/Monster_4/PNG/PNG Sequences/Dying', 'Dying'),
            
            // Monster 5 (usa Fly)
            loadAnimation('monster5Walking', 'assets/monsters/Monster_5/PNG/PNG Sequences/Fly', 'Fly'),
            loadAnimation('monster5Dying', 'assets/monsters/Monster_5/PNG/PNG Sequences/Dying', 'Dying'),
            
            // Monster 6 (usa Walking)
            loadAnimation('monster6Walking', 'assets/monsters/Monster_6/PNG/PNG Sequences/Walking', 'Walking'),
            loadAnimation('monster6Dying', 'assets/monsters/Monster_6/PNG/PNG Sequences/Dying', 'Dying'),
            
            // Monster 7 (usa Walking)
            loadAnimation('monster7Walking', 'assets/monsters/Monster_7/PNG/PNG Sequences/Walking', 'Walking'),
            loadAnimation('monster7Dying', 'assets/monsters/Monster_7/PNG/PNG Sequences/Dying', 'Dying'),
            
            // Monster 8 (usa Walking)
            loadAnimation('monster8Walking', 'assets/monsters/Monster_8/PNG/PNG Sequences/Walking', 'Walking'),
            loadAnimation('monster8Dying', 'assets/monsters/Monster_8/PNG/PNG Sequences/Dying', 'Dying'),
            
            // Monster 9 (usa Walking)
            loadAnimation('monster9Walking', 'assets/monsters/Monster_9/PNG/PNG Sequences/Walking', 'Walking'),
            loadAnimation('monster9Dying', 'assets/monsters/Monster_9/PNG/PNG Sequences/Dying', 'Dying'),
            
            // Monster 10 (usa Walking)
            loadAnimation('monster10Walking', 'assets/monsters/Monster_10/PNG/PNG Sequences/Walking', 'Walking'),
            loadAnimation('monster10Dying', 'assets/monsters/Monster_10/PNG/PNG Sequences/Dying', 'Dying'),
        ]);
        
        // Organiza as torres novas no formato correto
        organizeTowerSprites();
        
        // Processa os sprite sheets do GUI (recorta os sprites individuais)
        processGUISprites();
        
        return true;
        } catch (error) {
            console.error('❌ Erro ao carregar imagens:', error);
            return false;
        }
    }

/**
 * Função auxiliar para desenhar uma imagem no canvas
 * @param {CanvasRenderingContext2D} ctx - Contexto do canvas
 * @param {string} imageKey - Chave da imagem no objeto IMAGES
 * @param {number} x - Posição X
 * @param {number} y - Posição Y
 * @param {number} width - Largura (opcional)
 * @param {number} height - Altura (opcional)
 */
function drawSprite(ctx, imageKey, x, y, width = null, height = null) {
    const img = IMAGES[imageKey];
    
    if (img) {
        if (width && height) {
            ctx.drawImage(img, x, y, width, height);
        } else {
            ctx.drawImage(img, x, y);
        }
    }
    // Se a imagem não carregou, não desenha nada (fallback será usado nas classes)
}

// ============================================
// SISTEMA DE SPRITE SHEETS (RECORTE DE IMAGENS)
// ============================================

/**
 * Recorta um sprite de uma imagem maior (sprite sheet)
 * @param {Image} sourceImage - Imagem fonte (sprite sheet)
 * @param {number} sx - Posição X no sprite sheet
 * @param {number} sy - Posição Y no sprite sheet
 * @param {number} swidth - Largura do sprite no sprite sheet
 * @param {number} sheight - Altura do sprite no sprite sheet
 * @returns {HTMLCanvasElement} - Canvas com o sprite recortado
 */
function extractSprite(sourceImage, sx, sy, swidth, sheight) {
    // Cria um canvas temporário para recortar o sprite
    const canvas = document.createElement('canvas');
    canvas.width = swidth;
    canvas.height = sheight;
    const ctx = canvas.getContext('2d');
    
    // Desenha apenas a parte do sprite sheet que queremos
    ctx.drawImage(
        sourceImage,
        sx, sy, swidth, sheight,  // Área do sprite sheet a copiar (source)
        0, 0, swidth, sheight     // Onde desenhar no canvas (destination)
    );
    
    // Retorna o canvas (que pode ser usado como imagem)
    return canvas;
}

/**
 * Mapeamento de sprites do GUI
 * Define onde cada elemento está no sprite sheet
 * 
 * COMO DESCOBRIR AS COORDENADAS:
 * 1. Abra a imagem (Buttons.png, Icons.png) em um editor (GIMP, Photoshop, Paint.NET)
 * 2. Use a ferramenta de seleção para selecionar um sprite
 * 3. Veja as coordenadas na barra de status ou painel de informações
 *    - x, y = posição do canto superior esquerdo do sprite
 *    - width, height = largura e altura do sprite
 * 4. Ou use ferramentas online como:
 *    - https://www.leshylabs.com/apps/sstool/
 *    - https://ezgif.com/sprite-cutter
 * 
 * NOTA: As coordenadas abaixo são EXEMPLOS - você precisa ajustar baseado nas suas imagens reais!
 */
const GUI_SPRITE_MAP = {
    // Botões do arquivo Buttons.png
    buttons: {
        // Exemplo de estrutura (ajuste conforme sua imagem)
        // Se os botões estão em linha: normal, hover, pressed
        normal: { x: 0, y: 0, width: 200, height: 60 },
        hover: { x: 0, y: 60, width: 200, height: 60 },
        pressed: { x: 0, y: 120, width: 200, height: 60 },
        // Se os botões estão em coluna, ajuste os valores de x
        // Se os botões têm tamanhos diferentes, ajuste width e height
    },
    
    // Ícones do arquivo Icons.png
    icons: {
        // Exemplo (ajuste conforme sua imagem)
        // Se os ícones estão em uma linha horizontal:
        coin: { x: 0, y: 0, width: 32, height: 32 },
        heart: { x: 32, y: 0, width: 32, height: 32 },
        wave: { x: 64, y: 0, width: 32, height: 32 },
        // Se estão em grid, calcule: x = coluna × largura, y = linha × altura
    }
};

/**
 * Organiza os sprites das torres no formato correto
 * Esta função organiza as imagens carregadas no formato esperado pelas classes
 */
function organizeTowerSprites() {
    console.log('🔄 Organizando sprites das torres...');
    
    // Organiza Tower 1
    if (IMAGES.tower1_throwerBackBasic) {
        IMAGES.tower1.throwerBack.basic = IMAGES.tower1_throwerBackBasic;
        IMAGES.tower1.throwerBack.upgrade = IMAGES.tower1_throwerBackUpgrade;
        IMAGES.tower1.base.basic = IMAGES.tower1_baseBasic;
        IMAGES.tower1.base.upgrade = IMAGES.tower1_baseUpgrade;
        IMAGES.tower1.base.premium = IMAGES.tower1_basePremium;
        IMAGES.tower1.throwerFront.basic = IMAGES.tower1_throwerFrontBasic;
        IMAGES.tower1.throwerFront.upgrade = IMAGES.tower1_throwerFrontUpgrade;
        // Projéteis: [0] = projétil voando, [1-4] = frames de explosão
        IMAGES.tower1.projectile = [
            IMAGES.tower1_projectile1, // Projétil voando
            IMAGES.tower1_projectile2, // Explosão frame 1
            IMAGES.tower1_projectile3, // Explosão frame 2
            IMAGES.tower1_projectile4, // Explosão frame 3
            IMAGES.tower1_projectile5  // Explosão frame 4
        ];
        // Animações de disparo por nível: [0-8] = 9 frames de cada animação
        // Basic
        IMAGES.tower1.animationBasic = [
            IMAGES.tower1_basic_1, IMAGES.tower1_basic_2, IMAGES.tower1_basic_3,
            IMAGES.tower1_basic_4, IMAGES.tower1_basic_5, IMAGES.tower1_basic_6,
            IMAGES.tower1_basic_7, IMAGES.tower1_basic_8, IMAGES.tower1_basic_9
        ];
        // Upgrade
        IMAGES.tower1.animationUpgrade = [
            IMAGES.tower1_upgrade_1, IMAGES.tower1_upgrade_2, IMAGES.tower1_upgrade_3,
            IMAGES.tower1_upgrade_4, IMAGES.tower1_upgrade_5, IMAGES.tower1_upgrade_6,
            IMAGES.tower1_upgrade_7, IMAGES.tower1_upgrade_8, IMAGES.tower1_upgrade_9
        ];
        // Premium
        IMAGES.tower1.animationPremium = [
            IMAGES.tower1_premium_1, IMAGES.tower1_premium_2, IMAGES.tower1_premium_3,
            IMAGES.tower1_premium_4, IMAGES.tower1_premium_5, IMAGES.tower1_premium_6,
            IMAGES.tower1_premium_7, IMAGES.tower1_premium_8, IMAGES.tower1_premium_9
        ];
        // Mantém compatibilidade com código antigo (usa basic como padrão)
        IMAGES.tower1.animation = IMAGES.tower1.animationBasic;
        console.log('✓ Tower 1 organizada');
    }
    
    // Organiza Tower 2
    if (IMAGES.tower2_throwerBackBasic) {
        IMAGES.tower2.throwerBack.basic = IMAGES.tower2_throwerBackBasic;
        IMAGES.tower2.throwerBack.upgrade = IMAGES.tower2_throwerBackUpgrade;
        IMAGES.tower2.base.basic = IMAGES.tower2_baseBasic;
        IMAGES.tower2.base.upgrade = IMAGES.tower2_baseUpgrade;
        IMAGES.tower2.base.premium = IMAGES.tower2_basePremium;
        IMAGES.tower2.throwerFront.basic = IMAGES.tower2_throwerFrontBasic;
        IMAGES.tower2.throwerFront.upgrade = IMAGES.tower2_throwerFrontUpgrade;
        // Projéteis: [0] = projétil voando, [1-4] = frames de explosão
        IMAGES.tower2.projectile = [
            IMAGES.tower2_projectile1, // Projétil voando
            IMAGES.tower2_projectile2, // Explosão frame 1
            IMAGES.tower2_projectile3, // Explosão frame 2
            IMAGES.tower2_projectile4, // Explosão frame 3
            IMAGES.tower2_projectile5  // Explosão frame 4
        ];
        console.log('✓ Tower 2 organizada');
    }
    
}

/**
 * Processa os sprite sheets e extrai os sprites individuais
 * Esta função deve ser chamada depois que as imagens do GUI carregarem
 */
function processGUISprites() {
    console.log('🔄 Processando sprite sheets do GUI...');
    
    // Processa botões do sprite sheet Buttons.png
    if (IMAGES.buttons) {
        const map = GUI_SPRITE_MAP.buttons;
        
        // Extrai cada estado do botão
        if (map.normal) {
            IMAGES.buttonNormal = extractSprite(
                IMAGES.buttons,
                map.normal.x,
                map.normal.y,
                map.normal.width,
                map.normal.height
            );
            console.log('✓ Botão normal extraído');
        }
        
        if (map.hover) {
            IMAGES.buttonHover = extractSprite(
                IMAGES.buttons,
                map.hover.x,
                map.hover.y,
                map.hover.width,
                map.hover.height
            );
            console.log('✓ Botão hover extraído');
        }
        
        if (map.pressed) {
            IMAGES.buttonPressed = extractSprite(
                IMAGES.buttons,
                map.pressed.x,
                map.pressed.y,
                map.pressed.width,
                map.pressed.height
            );
            console.log('✓ Botão pressed extraído');
        }
    } else {
        console.warn('⚠ Buttons.png não carregou - botões usarão fallback');
    }
    
    // Processa ícones do sprite sheet Icons.png
    if (IMAGES.icons) {
        const map = GUI_SPRITE_MAP.icons;
        
        if (map.coin) {
            IMAGES.iconCoin = extractSprite(
                IMAGES.icons,
                map.coin.x,
                map.coin.y,
                map.coin.width,
                map.coin.height
            );
            console.log('✓ Ícone coin extraído');
        }
        
        if (map.heart) {
            IMAGES.iconHeart = extractSprite(
                IMAGES.icons,
                map.heart.x,
                map.heart.y,
                map.heart.width,
                map.heart.height
            );
            console.log('✓ Ícone heart extraído');
        }
        
        if (map.wave) {
            IMAGES.iconWave = extractSprite(
                IMAGES.icons,
                map.wave.x,
                map.wave.y,
                map.wave.width,
                map.wave.height
            );
            console.log('✓ Ícone wave extraído');
        }
    } else {
        console.warn('⚠ Icons.png não carregou - ícones usarão fallback');
    }
    
}

// ============================================
// CONFIGURAÇÕES GLOBAIS DO JOGO
// ============================================

// CONFIG é um objeto mutável que pode ser alterado pelas opções
// Valores padrão (serão sobrescritos pelas opções se existirem)
// Default configuration values (used for reset)
const DEFAULT_CONFIG = {
    STARTING_COINS: 200,
    STARTING_VILLAGE_LIFE: 100,
    TOWER_COST: 50,
    ENEMY_REWARD: 10,
    TOWER_RANGE: 50,
    TOWER_DAMAGE: 25,
    TOWER_FIRE_RATE: 1000,
    TOWER_BASIC_COST: 50,
    TOWER_UPGRADE_COST: 500,
    TOWER_PREMIUM_COST: 1000,
    ENEMY_SPEED: 1.0,
    ENEMY_HEALTH: 50,
    ENEMIES_PER_WAVE: 5,
    WAVE_MULTIPLIER: 1.2,
    MAX_WAVES: 10,
};

const CONFIG = {
    // Grid dimensions (15 columns x 15 rows = 750x750 pixels)
    GRID_COLS: 15,
    GRID_ROWS: 15,
    
    // Size of each grid cell (in pixels)
    CELL_SIZE: 50,
    
    // Initial resources (can be changed in options)
    STARTING_COINS: 200,
    STARTING_VILLAGE_LIFE: 100,
    
    // Tower cost (can be changed in options)
    TOWER_COST: 50,
    
    // Reward for killing enemy (can be changed in options)
    ENEMY_REWARD: 10,
    
    // Tower settings (can be changed in options)
    TOWER_RANGE: 50,        // Range in pixels
    TOWER_DAMAGE: 25,        // Damage per projectile
    TOWER_FIRE_RATE: 1000,   // Time between shots (ms) - for basic tower
    
    // Tower costs
    TOWER_BASIC_COST: 50,    // Basic tower cost
    TOWER_UPGRADE_COST: 500, // Upgrade tower cost
    TOWER_PREMIUM_COST: 1000, // Premium tower cost
    
    // Enemy settings (can be changed in options)
    ENEMY_SIZE: 45, // Aumentado de 30 para 45 (50% maior) - apenas tamanho visual, não afeta o canvas
    ENEMY_SPEED: 1.0,        // Base speed (pixels per frame) - 1.0 is balanced
    ENEMY_HEALTH: 50,        // Initial health
    
    // Projectile settings
    PROJECTILE_SIZE: 8,
    PROJECTILE_SPEED: 10,    // Balanced speed (2x enemy speed for good gameplay)
    
    // Wave settings (can be changed in options)
    WAVE_PAUSE_TIME: 3000,   // Pause between waves (ms)
    ENEMIES_PER_WAVE: 5,     // Initial enemies per wave
    WAVE_MULTIPLIER: 1.2,    // Difficulty multiplier per wave
    MAX_WAVES: 10,           // Maximum number of waves (can be changed in options)
};

// ============================================
// CLASSE PROJECTILE (Projétil)
// ============================================

class Projectile {
    /**
     * Cria um novo projétil
     * @param {number} x - Posição X inicial
     * @param {number} y - Posição Y inicial
     * @param {Enemy} target - Inimigo alvo
     * @param {number} damage - Dano que causa
     * @param {number} towerType - Tipo de torre (1 ou 2) - determina qual sprite usar
     */
    constructor(x, y, target, damage, towerType = 1) {
        // Posição inicial do projétil (onde a torre está)
        this.x = x;
        this.y = y;
        // Inimigo alvo que o projétil vai perseguir
        this.target = target;
        // Quantidade de dano que o projétil causa quando atinge
        this.damage = damage;
        // Se o projétil está ativo (ainda voando) ou não
        this.active = true;
        // Tipo de torre que disparou (1 ou 2)
        this.towerType = towerType;
        // Estado do projétil: 'flying' (voando) ou 'exploding' (explodindo)
        this.state = 'flying';
        // Frame atual da animação de explosão (1-4)
        this.explosionFrame = 0;
        // Duração da animação de explosão
        this.explosionDuration = 0;
    }

    /**
     * Atualiza a posição do projétil ou animação de explosão
     */
    update() {
        // Se está explodindo, apenas atualiza a animação
        if (this.state === 'exploding') {
            this.explosionDuration++;
            this.explosionFrame = Math.floor(this.explosionDuration * 0.3); // Velocidade da animação
            
            // Remove o projétil após a animação de explosão terminar (4 frames)
            if (this.explosionFrame >= 4) {
                this.active = false;
            }
            return;
        }
        
        // Se o alvo não existe mais ou foi destruído, inicia explosão
        if (!this.target || !this.target.active) {
            this.state = 'exploding';
            this.explosionDuration = 0;
            this.explosionFrame = 0;
            return;
        }

        // Calcula a direção para o alvo (diferença nas coordenadas)
        const dx = this.target.x - this.x; // Diferença em X
        const dy = this.target.y - this.y; // Diferença em Y
        // Calcula a distância total usando o teorema de Pitágoras
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Move o projétil em direção ao alvo
        if (distance > CONFIG.PROJECTILE_SPEED) {
            // Normaliza a direção (divide pela distância) e multiplica pela velocidade
            // Isso faz o projétil se mover na direção correta
            this.x += (dx / distance) * CONFIG.PROJECTILE_SPEED;
            this.y += (dy / distance) * CONFIG.PROJECTILE_SPEED;
        } else {
            // Se está muito perto, considera que atingiu o alvo
            this.target.takeDamage(this.damage); // Aplica o dano
            // Inicia animação de explosão
            this.state = 'exploding';
            this.explosionDuration = 0;
            this.explosionFrame = 0;
        }
    }

    /**
     * Desenha o projétil no canvas
     * @param {CanvasRenderingContext2D} ctx - Contexto do canvas
     */
    draw(ctx) {
        const towerKey = `tower${this.towerType}`;
        const tower = IMAGES[towerKey];
        
        if (!tower || !tower.projectile || tower.projectile.length === 0) {
            // Fallback: desenha círculo se sprites não carregaram
            ctx.fillStyle = '#f39c12';
            ctx.beginPath();
            ctx.arc(this.x, this.y, CONFIG.PROJECTILE_SIZE, 0, Math.PI * 2);
            ctx.fill();
            return;
        }
        
        let sprite = null;
        let size = CONFIG.PROJECTILE_SIZE * 2;
        
        if (this.state === 'exploding') {
            // Usa frames de explosão (índices 1-4, mas array começa em 0)
            const frameIndex = Math.min(this.explosionFrame + 1, 4); // +1 porque [0] é o projétil
            if (tower.projectile[frameIndex]) {
                sprite = tower.projectile[frameIndex];
                size = CONFIG.PROJECTILE_SIZE * 3; // Explosão é maior
            }
        } else {
            // Usa sprite do projétil voando (índice 0)
            sprite = tower.projectile[0];
        }
        
        if (sprite) {
            const drawX = this.x - size / 2;
            const drawY = this.y - size / 2;
            ctx.drawImage(sprite, drawX, drawY, size, size);
        } else {
            // Fallback
            ctx.fillStyle = '#f39c12';
            ctx.beginPath();
            ctx.arc(this.x, this.y, CONFIG.PROJECTILE_SIZE, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// ============================================
// CLASSE ENEMY (Inimigo)
// ============================================

class Enemy {
    /**
     * Cria um novo inimigo
     * @param {Array} path - Array de pontos do caminho [{x, y}, ...]
     * @param {number} speed - Velocidade do inimigo
     * @param {number} health - Vida do inimigo
     * @param {number} monsterType - Tipo de monstro (1-10)
     */
    constructor(path, speed, health, monsterType = 1) {
        // Caminho que o inimigo vai seguir (array de pontos {x, y})
        this.path = path;
        // Índice do ponto atual no caminho (começa no primeiro ponto)
        this.pathIndex = 0;
        // Posição X atual do inimigo (começa no primeiro ponto do caminho)
        this.x = path[0].x;
        // Posição Y atual do inimigo
        this.y = path[0].y;
        // Velocidade de movimento (pixels por frame)
        this.speed = speed;
        // Vida máxima (para calcular porcentagem da barra de vida)
        this.maxHealth = health;
        // Vida atual do inimigo
        this.health = health;
        // Se o inimigo está ativo (ainda no jogo) ou foi removido
        this.active = true;
        // Se o inimigo chegou ao fim do caminho (aldeia)
        this.reachedEnd = false;
        // Tipo de monstro (1-10) - determina qual sprite usar
        this.monsterType = monsterType;
        
        // Sistema de animação
        this.animationFrame = 0; // Frame atual da animação de caminhada
        this.animationSpeed = 2; // Velocidade da animação (frames por update) - aumentado para animação mais rápida
        this.isDying = false; // Se está executando animação de morte
        this.dyingFrame = 0; // Frame atual da animação de morte
        this.dyingDuration = 0; // Tempo que a animação de morte está rodando
    }

    /**
     * Atualiza a posição do inimigo no caminho e animação
     */
    update() {
        // Se está morrendo, apenas atualiza animação de morte
        if (this.isDying) {
            this.dyingDuration++;
            this.dyingFrame = Math.floor(this.dyingDuration * 0.6); // Velocidade da animação de morte - aumentado para animação mais rápida
            
            // Remove o inimigo após a animação de morte terminar
            if (this.dyingFrame >= 18) {
                this.active = false;
                this.isDying = false; // Marca como não está mais morrendo
            }
            return;
        }
        
        if (this.pathIndex >= this.path.length - 1) {
            // Chegou ao fim do caminho
            this.reachedEnd = true;
            this.active = false;
            return;
        }

        // Atualiza animação de caminhada
        this.animationFrame += this.animationSpeed;
        if (this.animationFrame >= 18) {
            this.animationFrame = 0; // Loop da animação
        }

        // Pega o próximo ponto do caminho
        const target = this.path[this.pathIndex + 1];
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Move em direção ao próximo ponto
        if (distance > this.speed) {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        } else {
            // Chegou ao próximo ponto, avança no caminho
            this.pathIndex++;
            this.x = target.x;
            this.y = target.y;
        }
    }

    /**
     * Aplica dano ao inimigo
     * @param {number} damage - Quantidade de dano
     */
    takeDamage(damage) {
        // Reduz a vida do inimigo pelo dano recebido
        this.health -= damage;
        // Se a vida chegou a zero e ainda não está morrendo
        if (this.health <= 0 && !this.isDying) {
            // Inicia a animação de morte
            this.isDying = true;
            this.dyingDuration = 0; // Reseta o contador de duração
            this.dyingFrame = 0; // Começa no primeiro frame da animação de morte
        }
    }

    /**
     * Desenha o inimigo no canvas
     * @param {CanvasRenderingContext2D} ctx - Contexto do canvas
     */
    draw(ctx) {
        // Monta a chave do monstro (ex: "monster1", "monster2", etc.)
        const monsterKey = `monster${this.monsterType}`;
        // Tamanho do sprite (um pouco maior que o tamanho base)
        const size = CONFIG.ENEMY_SIZE * 1.5;
        // Calcula posição X para centralizar o sprite
        const drawX = this.x - size / 2;
        // Calcula posição Y para centralizar o sprite
        const drawY = this.y - size / 2;
        
        // Escolhe qual animação usar baseado no estado do inimigo
        let animationKey; // Chave da animação no objeto IMAGES
        let frameIndex; // Índice do frame atual da animação
        
        if (this.isDying) {
            // Se está morrendo, usa a animação de morte
            animationKey = `${monsterKey}Dying`;
            // Limita ao último frame (17, pois começa em 0)
            frameIndex = Math.min(this.dyingFrame, 17);
        } else {
            // Se está vivo, usa a animação de caminhada
            animationKey = `${monsterKey}Walking`;
            // Usa módulo para fazer loop da animação (0-17)
            frameIndex = Math.floor(this.animationFrame) % 18;
        }
        
        // Tenta pegar a animação do objeto IMAGES
        const animation = IMAGES[animationKey];
        if (animation && animation[frameIndex]) {
            // Se a animação existe e o frame existe
            const sprite = animation[frameIndex];
            if (sprite) {
                // Desenha o sprite do frame atual
                ctx.drawImage(sprite, drawX, drawY, size, size);
            } else {
                // Se o sprite não carregou, usa fallback
                this.drawFallback(ctx);
            }
        } else {
            // Se a animação não existe, usa fallback
            this.drawFallback(ctx);
        }
        
        // Desenha barra de vida apenas se não estiver morrendo
        if (!this.isDying) {
            this.drawHealthBar(ctx);
        }
    }
    
    /**
     * Desenha fallback (quadrado) se o sprite não carregou
     * @param {CanvasRenderingContext2D} ctx - Contexto do canvas
     */
    drawFallback(ctx) {
        // Corpo do inimigo (quadrado vermelho)
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(
            this.x - CONFIG.ENEMY_SIZE / 2,
            this.y - CONFIG.ENEMY_SIZE / 2,
            CONFIG.ENEMY_SIZE,
            CONFIG.ENEMY_SIZE
        );

        // Borda
        ctx.strokeStyle = '#c0392b';
        ctx.lineWidth = 2;
        ctx.strokeRect(
            this.x - CONFIG.ENEMY_SIZE / 2,
            this.y - CONFIG.ENEMY_SIZE / 2,
            CONFIG.ENEMY_SIZE,
            CONFIG.ENEMY_SIZE
        );
    }
    
    /**
     * Desenha a barra de vida
     * @param {CanvasRenderingContext2D} ctx - Contexto do canvas
     */
    drawHealthBar(ctx) {
        const barWidth = CONFIG.ENEMY_SIZE * 1.5;
        const barHeight = 4;
        const healthPercent = Math.max(0, this.health / this.maxHealth);

        // Fundo da barra
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(
            this.x - barWidth / 2,
            this.y - CONFIG.ENEMY_SIZE / 2 - 12,
            barWidth,
            barHeight
        );

        // Vida restante
        ctx.fillStyle = healthPercent > 0.5 ? '#27ae60' : '#e74c3c';
        ctx.fillRect(
            this.x - barWidth / 2,
            this.y - CONFIG.ENEMY_SIZE / 2 - 12,
            barWidth * healthPercent,
            barHeight
        );
    }
}

// ============================================
// CLASSE TOWER (Torre)
// ============================================

class Tower {
    /**
     * Cria uma nova torre
     * @param {number} gridX - Posição X no grid
     * @param {number} gridY - Posição Y no grid
     * @param {number} towerType - Tipo de torre (1 ou 2)
     * @param {string} upgradeLevel - Nível da torre: 'basic', 'upgrade', 'premium'
     */
    constructor(gridX, gridY, towerType = 1, upgradeLevel = 'basic') {
        // Posição no grid (coordenadas da célula)
        this.gridX = gridX;
        this.gridY = gridY;
        // Posição real no canvas (centro da célula)
        this.x = gridX * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2;
        this.y = gridY * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2;
        // Alcance da torre em pixels (raio do círculo de alcance)
        this.range = CONFIG.TOWER_RANGE;
        // Dano que cada projétil causa
        this.damage = CONFIG.TOWER_DAMAGE;
        // Tempo entre disparos em milissegundos
        this.fireRate = CONFIG.TOWER_FIRE_RATE;
        // Última vez que a torre disparou (para controlar cooldown)
        this.lastFireTime = 0;
        // Tipo de torre (1 ou 2)
        this.towerType = towerType;
        // Nível de upgrade: 'basic', 'upgrade', 'premium'
        this.upgradeLevel = upgradeLevel;
        
        // Configurações baseadas no nível
        // Upgrade dispara ao dobro da velocidade (fireRate / 2)
        // Premium dispara ao dobro da velocidade E dispara 2 projéteis
        if (this.upgradeLevel === 'upgrade' || this.upgradeLevel === 'premium') {
            this.fireRate = CONFIG.TOWER_FIRE_RATE / 2; // Metade do tempo = dobro da velocidade
        } else {
            this.fireRate = CONFIG.TOWER_FIRE_RATE;
        }
        
        // Premium dispara 2 projéteis
        this.projectilesPerShot = this.upgradeLevel === 'premium' ? 2 : 1;
        
        // Animação da torre (para efeito de slingshot)
        this.animationTime = 0; // Tempo desde o último disparo (para animação)
        this.animationDuration = 300; // Duração da animação de disparo (ms)
    }

    /**
     * Verifica se pode disparar e encontra um alvo
     * @param {Array} enemies - Array de inimigos
     * @param {number} currentTime - Tempo atual
     * @returns {Enemy|null} - Inimigo alvo ou null
     */
    findTarget(enemies, currentTime) {
        // Verifica se pode disparar (cooldown - tempo entre disparos)
        // Se ainda não passou tempo suficiente desde o último disparo, não pode atirar
        if (currentTime - this.lastFireTime < this.fireRate) {
            return null; // Não pode atirar ainda
        }

        // Encontra o inimigo mais próximo dentro do alcance
        let closestEnemy = null; // Inimigo mais próximo encontrado
        let closestDistance = this.range; // Distância do inimigo mais próximo

        // Percorre todos os inimigos
        for (const enemy of enemies) {
            // Pula inimigos que não estão ativos
            if (!enemy.active) continue;

            // Calcula a distância entre a torre e o inimigo
            const dx = enemy.x - this.x; // Diferença em X
            const dy = enemy.y - this.y; // Diferença em Y
            // Distância usando teorema de Pitágoras
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Se está dentro do alcance E é mais próximo que o anterior
            if (distance <= this.range && distance < closestDistance) {
                closestEnemy = enemy; // Atualiza o alvo
                closestDistance = distance; // Atualiza a distância
            }
        }

        // Retorna o inimigo mais próximo (ou null se não houver nenhum)
        return closestEnemy;
    }

    /**
     * Dispara projéteis
     * @param {Enemy} target - Inimigo alvo
     * @param {number} currentTime - Tempo atual
     * @returns {Array<Projectile>} - Array de projéteis (1 para basic/upgrade, 2 para premium)
     */
    fire(target, currentTime) {
        // Se não há alvo, não dispara
        if (!target) return [];

        // Atualiza o tempo do último disparo (para controlar cooldown)
        this.lastFireTime = currentTime;
        // Inicia animação de disparo
        this.animationTime = currentTime;
        this.isAnimating = true;
        this.animationFrame = 0;
        
        // Cria os projéteis baseado no nível da torre
        const projectiles = [];
        
        if (this.projectilesPerShot === 2) {
            // Premium: dispara 2 projéteis
            // Encontra um segundo alvo próximo (ou usa o mesmo)
            projectiles.push(new Projectile(this.x, this.y, target, this.damage, this.towerType));
            
            // Tenta encontrar outro inimigo próximo para o segundo projétil
            // Por enquanto, dispara os 2 no mesmo alvo (pode melhorar depois)
            projectiles.push(new Projectile(this.x, this.y, target, this.damage, this.towerType));
        } else {
            // Basic e Upgrade: dispara 1 projétil
            projectiles.push(new Projectile(this.x, this.y, target, this.damage, this.towerType));
        }
        
        return projectiles;
    }
    
    /**
     * Atualiza a animação da torre
     * @param {number} currentTime - Tempo atual
     */
    update(currentTime) {
        // Atualiza animação de disparo
        if (this.isAnimating && this.animationTime > 0 && currentTime > 0) {
            const timeSinceFire = currentTime - this.animationTime;
            if (timeSinceFire < this.animationDuration) {
                // Calcula qual frame mostrar (0-8)
                const progress = timeSinceFire / this.animationDuration;
                this.animationFrame = Math.floor(progress * 9); // 9 frames
                // Limita ao último frame
                if (this.animationFrame >= 9) {
                    this.animationFrame = 8;
                }
            } else {
                // Animação terminou
                this.isAnimating = false;
                this.animationTime = 0;
                this.animationFrame = 0;
            }
        }
    }

    /**
     * Desenha a torre no canvas
     * Se a torre está animando (disparando), usa a animação completa (9 frames)
     * Caso contrário, usa os componentes separados (throwerBack, base, throwerFront)
     * @param {CanvasRenderingContext2D} ctx - Contexto do canvas
     * @param {boolean} showRange - Se deve mostrar o alcance
     * @param {number} currentTime - Tempo atual (para animação)
     */
    draw(ctx, showRange = false, currentTime = 0) {
        // Desenha o alcance (se solicitado)
        if (showRange) {
            ctx.strokeStyle = 'rgba(52, 152, 219, 0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Pega os sprites da torre baseado no tipo
        const towerKey = `tower${this.towerType}`;
        const tower = IMAGES[towerKey];
        
        // Calcula posição de desenho (centro da célula)
        const drawX = this.x - CONFIG.CELL_SIZE / 2;
        const drawY = this.y - CONFIG.CELL_SIZE / 2;
        
        if (tower) {
            // Escolhe qual animação usar baseado no nível da torre
            let animationArray = null;
            if (this.upgradeLevel === 'premium') {
                animationArray = tower.animationPremium;
            } else if (this.upgradeLevel === 'upgrade') {
                animationArray = tower.animationUpgrade;
            } else {
                animationArray = tower.animationBasic;
            }
            
            // Se está animando (disparando), usa a animação completa
            if (this.isAnimating && animationArray && animationArray.length > 0) {
                const frame = animationArray[this.animationFrame];
                if (frame) {
                    // Desenha a torre maior que a célula (1.5x) para melhor visualização
                    const towerSize = CONFIG.CELL_SIZE * 1.5;
                    const towerDrawX = this.x - towerSize / 2;
                    const towerDrawY = this.y - towerSize / 2;
                    ctx.drawImage(frame, towerDrawX, towerDrawY, towerSize, towerSize);
                } else {
                    // Fallback se o frame não existe
                    this.drawFallback(ctx);
                }
            } else {
                // Se não está animando, usa o primeiro frame da animação como estado padrão
                if (animationArray && animationArray.length > 0 && animationArray[0]) {
                    // Desenha a torre maior que a célula (1.5x) para melhor visualização
                    const towerSize = CONFIG.CELL_SIZE * 1.5;
                    const towerDrawX = this.x - towerSize / 2;
                    const towerDrawY = this.y - towerSize / 2;
                    ctx.drawImage(animationArray[0], towerDrawX, towerDrawY, towerSize, towerSize);
                } else {
                    // Fallback: se a animação não estiver disponível, usa os componentes separados
                    // Desenha as 3 camadas na ordem correta (de trás para frente)
                    
                    // 1. throwerBack (atrás)
                    const throwerBack = this.upgradeLevel === 'upgrade' || this.upgradeLevel === 'premium' 
                        ? tower.throwerBack.upgrade 
                        : tower.throwerBack.basic;
                    if (throwerBack) {
                        // Desenha componentes maiores que a célula (1.5x) para melhor visualização
                        const towerSize = CONFIG.CELL_SIZE * 1.5;
                        const towerDrawX = this.x - towerSize / 2;
                        const towerDrawY = this.y - towerSize / 2;
                        ctx.drawImage(throwerBack, towerDrawX, towerDrawY, towerSize, towerSize);
                    }
                    
                    // 2. base (no meio)
                    const base = this.upgradeLevel === 'premium' 
                        ? tower.base.premium 
                        : (this.upgradeLevel === 'upgrade' 
                            ? tower.base.upgrade 
                            : tower.base.basic);
                    if (base) {
                        ctx.drawImage(base, towerDrawX, towerDrawY, towerSize, towerSize);
                    }
                    
                    // 3. throwerFront (na frente)
                    const throwerFront = this.upgradeLevel === 'upgrade' || this.upgradeLevel === 'premium' 
                        ? tower.throwerFront.upgrade 
                        : tower.throwerFront.basic;
                    if (throwerFront) {
                        ctx.drawImage(throwerFront, towerDrawX, towerDrawY, towerSize, towerSize);
                    }
                }
            }
        } else {
            // Fallback: desenha um retângulo se as imagens não carregaram
            this.drawFallback(ctx);
        }
    }
    
    /**
     * Desenha fallback (retângulo) se as imagens não carregaram
     * @param {CanvasRenderingContext2D} ctx - Contexto do canvas
     */
    drawFallback(ctx) {
        const size = CONFIG.CELL_SIZE * 0.7;
        ctx.fillStyle = '#7f8c8d';
        ctx.fillRect(
            this.x - size / 2,
            this.y - size / 2,
            size,
            size
        );

        // Borda
        ctx.strokeStyle = '#34495e';
        ctx.lineWidth = 2;
        ctx.strokeRect(
            this.x - size / 2,
            this.y - size / 2,
            size,
            size
        );

        // Detalhes (janela)
        ctx.fillStyle = '#34495e';
        ctx.fillRect(
            this.x - size / 4,
            this.y - size / 4,
            size / 2,
            size / 2
        );
    }
}

// ============================================
// CLASSE COINPARTICLE (Partícula de Moeda)
// ============================================

/**
 * Partícula de moeda que aparece quando um inimigo morre
 * Faz uma animação de salto e desvanecimento
 */
class CoinParticle {
    /**
     * Cria uma nova partícula de moeda
     * @param {number} x - Posição X inicial (onde o inimigo morreu)
     * @param {number} y - Posição Y inicial (onde o inimigo morreu)
     */
    constructor(x, y) {
        this.startX = x; // Posição X inicial
        this.startY = y; // Posição Y inicial
        this.x = x; // Posição X atual
        this.y = y; // Posição Y atual
        
        // Animação de salto
        this.velocityY = -8; // Velocidade vertical inicial (negativa = para cima)
        this.gravity = 0.5; // Gravidade que puxa a moeda para baixo
        this.life = 0; // Tempo de vida da partícula (em frames)
        this.maxLife = 60; // Duração total da animação (60 frames = ~1 segundo a 60fps)
        
        this.active = true; // Se a partícula ainda está ativa
    }
    
    /**
     * Atualiza a posição e animação da partícula
     */
    update() {
        if (!this.active) return;
        
        // Aplica gravidade (velocidade aumenta para baixo)
        this.velocityY += this.gravity;
        
        // Move a partícula
        this.y += this.velocityY;
        
        // Pequeno movimento horizontal aleatório para dar mais naturalidade
        this.x += (Math.random() - 0.5) * 0.5;
        
        // Incrementa o tempo de vida
        this.life++;
        
        // Remove a partícula quando a animação termina
        if (this.life >= this.maxLife) {
            this.active = false;
        }
    }
    
    /**
     * Desenha a partícula no canvas
     * @param {CanvasRenderingContext2D} ctx - Contexto do canvas
     */
    draw(ctx) {
        if (!this.active || !IMAGES.winCoin) return;
        
        // Calcula a opacidade (fade out - começa em 1.0 e vai para 0.0)
        const opacity = 1 - (this.life / this.maxLife);
        
        // Calcula o tamanho (pode aumentar um pouco durante o salto)
        const size = (32 + Math.sin(this.life * 0.2) * 4) * 0.75;
        
        // Salva o estado do canvas
        ctx.save();
        
        // Aplica opacidade
        ctx.globalAlpha = opacity;
        
        // Desenha a imagem da moeda
        ctx.drawImage(
            IMAGES.winCoin,
            this.x - size / 2,
            this.y - size / 2,
            size,
            size
        );
        
        // Restaura o estado do canvas
        ctx.restore();
    }
}

// ============================================
// CLASSE GAME (Jogo Principal)
// ============================================

class Game {
    /**
     * Inicializa o jogo
     */
    constructor() {
        // Pega o elemento canvas do HTML
        this.canvas = document.getElementById('gameCanvas');
        // Obtém o contexto 2D do canvas (usado para desenhar)
        this.ctx = this.canvas.getContext('2d');
        
        // Define o tamanho do canvas baseado no grid
        // Largura = número de colunas × tamanho de cada célula
        this.canvas.width = CONFIG.GRID_COLS * CONFIG.CELL_SIZE;
        // Altura = número de linhas × tamanho de cada célula
        this.canvas.height = CONFIG.GRID_ROWS * CONFIG.CELL_SIZE;

        // Estado do jogo (recursos e vida)
        this.coins = CONFIG.STARTING_COINS; // Moedas iniciais do jogador
        this.villageLife = CONFIG.STARTING_VILLAGE_LIFE; // Vida inicial da aldeia
        this.wave = 0; // Wave atual (0 = ainda não começou)
        this.gameOver = false; // Se o jogo terminou
        this.imagesLoaded = false; // Se as imagens foram carregadas
        this.paused = false; // Se o jogo está pausado
        this.animationFrameId = null; // ID do requestAnimationFrame atual (para poder cancelar)

        // Arrays que guardam todos os objetos do jogo
        this.towers = []; // Todas as torres colocadas
        this.enemies = []; // Todos os inimigos no mapa
        this.projectiles = []; // Todos os projéteis voando
        this.coinParticles = []; // Partículas de moeda que aparecem quando inimigos morrem

        // Estado das waves (ondas de inimigos)
        this.waveInProgress = false; // Se uma wave está acontecendo
        this.wavePauseStart = 0; // Quando começou a pausa entre waves
        this.enemiesInWave = 0; // Quantos inimigos devem aparecer nesta wave
        this.enemiesSpawned = 0; // Quantos inimigos já foram criados nesta wave
        this.lastSpawnTime = 0; // Última vez que um inimigo foi spawnado
        this.waveSpeed = CONFIG.ENEMY_SPEED; // Velocidade dos inimigos na wave atual
        this.waveHealth = CONFIG.ENEMY_HEALTH; // Vida dos inimigos na wave atual
        this.currentMonsterType = 1; // Tipo de monstro da wave atual

        // Caminho que os inimigos vão seguir (array de pontos {x, y})
        this.path = this.generatePath();

        // Posição da torre que está sendo preview (quando o mouse passa por cima)
        this.selectedTowerPosition = null;

        // Configura os eventos do mouse (clique, movimento)
        this.setupEventListeners();

        // Carrega todas as imagens antes de iniciar o jogo
        this.init();
    }

    /**
     * Inicializa o jogo carregando as imagens primeiro
     */
    async init() {
        // Mostra mensagem de carregamento
        // Carrega todas as imagens
        this.imagesLoaded = await loadAllImages();
        
        // Desenha os previews das torres no menu de compra
        this.drawTowerShopPreviews();
        
        // Atualiza a seleção inicial (basic por padrão)
        this.updateTowerShopSelection();
        
        // Atualiza os custos no menu de compra (já é chamado em drawTowerShopPreviews, mas garantimos aqui também)
        this.updateTowerShopCosts();
        
        // Atualiza a tela de debug inicial
        this.updateDebugScreen();
        
        // Inicia o loop do jogo (mesmo que algumas imagens não tenham carregado)
        this.lastTime = performance.now();
        this.gameLoop();
    }

    /**
     * Gera o caminho que os inimigos vão seguir
     * @returns {Array} Array de pontos [{x, y}, ...]
     */
    generatePath() {
        // Cria um array vazio para guardar os pontos do caminho
        const path = [];
        // Metade do tamanho de uma célula (para centralizar nos pontos)
        const cellCenter = CONFIG.CELL_SIZE / 2;

        // Ponto 1: Entrada (lado esquerdo do mapa, no meio vertical)
        path.push({
            x: 0, // Começa na borda esquerda
            y: (CONFIG.GRID_ROWS / 2) * CONFIG.CELL_SIZE + cellCenter // Meio vertical
        });

        // Ponto 2: Meio do caminho (centro do mapa)
        path.push({
            x: (CONFIG.GRID_COLS / 2) * CONFIG.CELL_SIZE + cellCenter, // Meio horizontal
            y: (CONFIG.GRID_ROWS / 2) * CONFIG.CELL_SIZE + cellCenter // Meio vertical
        });

        // Ponto 3: Saída (lado direito do mapa, no meio vertical)
        path.push({
            x: CONFIG.GRID_COLS * CONFIG.CELL_SIZE, // Termina na borda direita
            y: (CONFIG.GRID_ROWS / 2) * CONFIG.CELL_SIZE + cellCenter // Meio vertical
        });

        // Retorna o caminho completo
        return path;
    }

    /**
     * Configura os event listeners
     */
    setupEventListeners() {
        // Clique no canvas para colocar torre
        this.canvas.addEventListener('click', (e) => {
            if (this.gameOver) return;

            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            this.handleCanvasClick(x, y);
        });
        
        // Event listeners para o menu de compra de torres
        const towerBasic = document.getElementById('tower-basic');
        const towerUpgrade = document.getElementById('tower-upgrade');
        const towerPremium = document.getElementById('tower-premium');
        
        if (towerBasic) {
            towerBasic.addEventListener('click', () => {
                this.selectedTowerLevel = 'basic';
                this.updateTowerShopSelection();
            });
        }
        
        if (towerUpgrade) {
            towerUpgrade.addEventListener('click', () => {
                this.selectedTowerLevel = 'upgrade';
                this.updateTowerShopSelection();
            });
        }
        
        if (towerPremium) {
            towerPremium.addEventListener('click', () => {
                this.selectedTowerLevel = 'premium';
                this.updateTowerShopSelection();
            });
        }

        // Movimento do mouse para preview da torre
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.gameOver) return;

            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            this.handleMouseMove(x, y);
        });
    }

    /**
     * Processa o clique no canvas
     * @param {number} x - Posição X do clique
     * @param {number} y - Posição Y do clique
     */
    handleCanvasClick(x, y) {
        // Converte a posição do clique (em pixels) para posição no grid
        const gridX = Math.floor(x / CONFIG.CELL_SIZE);
        const gridY = Math.floor(y / CONFIG.CELL_SIZE);

        // Verifica se está dentro dos limites do grid
        if (gridX < 0 || gridX >= CONFIG.GRID_COLS || gridY < 0 || gridY >= CONFIG.GRID_ROWS) {
            return; // Fora dos limites, não faz nada
        }

        // Verifica se já existe uma torre nessa posição
        if (this.isTowerAt(gridX, gridY)) {
            return; // Já tem torre aqui, não pode colocar outra
        }

        // Verifica se está no caminho (onde os inimigos passam)
        if (this.isOnPath(gridX, gridY)) {
            return; // Não pode colocar torre no caminho
        }

        // Determina o custo baseado no nível selecionado
        let towerCost = CONFIG.TOWER_BASIC_COST;
        if (this.selectedTowerLevel === 'upgrade') {
            towerCost = CONFIG.TOWER_UPGRADE_COST;
        } else if (this.selectedTowerLevel === 'premium') {
            towerCost = CONFIG.TOWER_PREMIUM_COST;
        }

        // Checks if player has enough coins to buy the tower
        if (this.coins < towerCost) {
            alert(`Insufficient coins! Required: ${towerCost}`);
            return; // Not enough money
        }

        // Everything OK! Place the tower with the selected level
        this.towers.push(new Tower(gridX, gridY, 1, this.selectedTowerLevel));
        // Deduct the tower cost from coins
        this.coins -= towerCost;
        // Update HUD to show new coins
        this.updateHUD();
    }

    /**
     * Processa o movimento do mouse para preview
     * @param {number} x - Posição X do mouse
     * @param {number} y - Posição Y do mouse
     */
    handleMouseMove(x, y) {
        const gridX = Math.floor(x / CONFIG.CELL_SIZE);
        const gridY = Math.floor(y / CONFIG.CELL_SIZE);

        if (gridX >= 0 && gridX < CONFIG.GRID_COLS && gridY >= 0 && gridY < CONFIG.GRID_ROWS) {
            if (!this.isTowerAt(gridX, gridY) && !this.isOnPath(gridX, gridY)) {
                this.selectedTowerPosition = { gridX, gridY };
            } else {
                this.selectedTowerPosition = null;
            }
        } else {
            this.selectedTowerPosition = null;
        }
    }

    /**
     * Verifica se existe uma torre numa posição do grid
     * @param {number} gridX - Posição X no grid
     * @param {number} gridY - Posição Y no grid
     * @returns {boolean}
     */
    isTowerAt(gridX, gridY) {
        return this.towers.some(tower => tower.gridX === gridX && tower.gridY === gridY);
    }

    /**
     * Verifica se uma posição do grid está no caminho
     * @param {number} gridX - Posição X no grid
     * @param {number} gridY - Posição Y no grid
     * @returns {boolean}
     */
    isOnPath(gridX, gridY) {
        const cellCenterX = gridX * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2;
        const cellCenterY = gridY * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2;
        const pathY = (CONFIG.GRID_ROWS / 2) * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2;

        // Verifica se está na linha horizontal do caminho
        return Math.abs(cellCenterY - pathY) < CONFIG.CELL_SIZE / 2;
    }

    /**
     * Inicia uma nova wave de inimigos
     * Cada wave usa o monstro correspondente
     */
    startWave() {
        // Limita ao número máximo de waves configurado
        if (this.wave >= CONFIG.MAX_WAVES) {
            // Jogo completo! Vitória!
            this.gameOver = true;
            alert(`Parabéns! Você completou todas as ${CONFIG.MAX_WAVES} waves!`);
            return; // Para a função aqui
        }
        
        // Avança para a próxima wave
        this.wave++;
        // Marca que uma wave está em progresso
        this.waveInProgress = true;
        // Reseta o contador de inimigos spawnados
        this.enemiesSpawned = 0;
        
        // Determina qual monstro usar nesta wave
        // Wave 1 = Monster_1, Wave 2 = Monster_2, etc.
        // Limita ao máximo de 10 (temos apenas 10 tipos de monstros)
        this.currentMonsterType = Math.min(this.wave, 10);
        
        // Calcula número de inimigos e dificuldade
        const baseEnemies = CONFIG.ENEMIES_PER_WAVE; // Número base de inimigos
        // Aumenta a dificuldade exponencialmente com cada wave
        const difficulty = Math.pow(CONFIG.WAVE_MULTIPLIER, this.wave - 1);
        // Calcula quantos inimigos vão aparecer nesta wave
        this.enemiesInWave = Math.floor(baseEnemies * difficulty);
        
        // Aumenta a velocidade dos inimigos a cada wave (10% por wave)
        this.waveSpeed = CONFIG.ENEMY_SPEED * (1 + (this.wave - 1) * 0.1);
        // Aumenta a vida dos inimigos baseado na dificuldade
        this.waveHealth = CONFIG.ENEMY_HEALTH * difficulty;
        
        // Reseta o tempo de spawn quando uma nova wave começa
        this.lastSpawnTime = 0;
        
        // Debug: mostra stats de velocidade
        console.log(`🌊 Wave ${this.wave} iniciada!`);
        console.log(`   Monster: ${this.currentMonsterType}`);
        console.log(`   Enemy Speed: ${this.waveSpeed.toFixed(2)} (Base: ${CONFIG.ENEMY_SPEED.toFixed(2)})`);
        console.log(`   Enemy Health: ${this.waveHealth.toFixed(0)} (Base: ${CONFIG.ENEMY_HEALTH})`);
        console.log(`   Enemies in wave: ${this.enemiesInWave}`);
    }

    /**
     * Spawna um novo inimigo com o tipo de monstro da wave atual
     */
    spawnEnemy() {
        if (this.enemiesSpawned < this.enemiesInWave) {
            // Cria inimigo com o tipo de monstro correspondente à wave
            const monsterType = this.currentMonsterType || this.wave;
            this.enemies.push(new Enemy(this.path, this.waveSpeed, this.waveHealth, monsterType));
            this.enemiesSpawned++;
        }
    }

    /**
     * Atualiza o estado do jogo
     * @param {number} currentTime - Tempo atual
     */
    update(currentTime) {
        // Se o jogo terminou ou está pausado, não atualiza mais nada
        if (this.gameOver || this.paused) return;

        // Gerencia as waves (ondas de inimigos)
        if (!this.waveInProgress) {
            // Se não há wave em progresso, está na pausa entre waves
            if (this.wavePauseStart === 0) {
                // Marca quando começou a pausa
                this.wavePauseStart = currentTime;
            } else if (currentTime - this.wavePauseStart >= CONFIG.WAVE_PAUSE_TIME) {
                // Se passou o tempo de pausa, inicia a próxima wave
                this.startWave();
                this.wavePauseStart = 0; // Reseta o contador
            }
        } else {
            // Se há uma wave em progresso
            // Spawna inimigos gradualmente (um de cada vez)
            if (this.enemiesSpawned < this.enemiesInWave) {
                const spawnInterval = 1000; // 1 segundo entre cada inimigo
                // Se ainda não spawnou nenhum, inicializa o tempo
                if (this.enemiesSpawned === 0) {
                    this.lastSpawnTime = currentTime; // Inicializa o tempo no primeiro spawn
                    this.spawnEnemy(); // Cria o primeiro inimigo imediatamente
                } else if (currentTime - this.lastSpawnTime >= spawnInterval) {
                    // Se já passou o intervalo, spawna o próximo
                    this.spawnEnemy(); // Cria um novo inimigo
                    this.lastSpawnTime = currentTime; // Atualiza o tempo
                }
            }

            // Verifica se a wave terminou
            // Condições: Todos os inimigos foram spawnados E não há mais inimigos ativos ou morrendo
            const activeEnemies = this.enemies.filter(e => (e.active || e.isDying) && !e.reachedEnd);
            if (this.enemiesSpawned >= this.enemiesInWave && activeEnemies.length === 0) {
                // Wave terminou!
                this.waveInProgress = false; // Marca que a wave acabou
                this.wavePauseStart = currentTime; // Inicia a pausa
                
                
                // Verifica se completou todas as waves configuradas
                if (this.wave >= CONFIG.MAX_WAVES) {
                    this.gameOver = true;
                    alert(`Congratulations! You completed all ${CONFIG.MAX_WAVES} waves!`);
                }
            }
        }

        // Inicia a primeira wave quando o jogo começa
        if (this.wave === 0 && !this.waveInProgress) {
            this.startWave();
        }

        // Atualiza inimigos (incluindo os que estão morrendo)
        // Loop de trás para frente para poder remover itens sem problemas
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            // Atualiza todos os inimigos (ativos ou morrendo)
            // Isso atualiza a posição e animação
            if (enemy.active || enemy.isDying) {
                enemy.update();
            }

            // Verifica se o inimigo chegou ao fim do caminho (aldeia)
            // Apenas se estava ativo e não estava morrendo
            if (enemy.reachedEnd && !enemy.isDying) {
                // Reduz a vida da aldeia
                this.villageLife -= 10;
                this.updateHUD(); // Atualiza o HUD
                
                // Se a vida chegou a zero, game over
                if (this.villageLife <= 0) {
                    this.gameOver = true;
                    alert('Game Over! The village was destroyed!');
                }
                // Remove o inimigo que chegou ao fim
                this.enemies.splice(i, 1);
                continue; // Pula para o próximo inimigo
            }

            // Remove inimigos que terminaram a animação de morte
            // Condições: não está ativo, não chegou ao fim, não está morrendo
            if (!enemy.active && !enemy.reachedEnd && !enemy.isDying) {
                // Cria uma partícula de moeda na posição onde o inimigo morreu
                this.coinParticles.push(new CoinParticle(enemy.x, enemy.y));
                
                // Dá recompensa ao jogador por matar o inimigo
                this.coins += CONFIG.ENEMY_REWARD;
                this.updateHUD(); // Atualiza o HUD
                // Remove o inimigo do array
                this.enemies.splice(i, 1);
            }
        }

        // Atualiza torres (verifica se podem disparar)
        for (const tower of this.towers) {
            // Cada torre tenta encontrar um alvo dentro do alcance
            const target = tower.findTarget(this.enemies, currentTime);
            if (target) {
                // Se encontrou um alvo, dispara projéteis (pode ser 1 ou 2)
                const projectiles = tower.fire(target, currentTime);
                // Adiciona todos os projéteis ao array
                for (const projectile of projectiles) {
                    if (projectile) {
                        this.projectiles.push(projectile);
                    }
                }
            }
        }

        // Atualiza todos os projéteis (movem em direção aos alvos)
        for (const projectile of this.projectiles) {
            if (projectile.active) {
                // Atualiza a posição do projétil
                projectile.update();
            }
        }

        // Remove projéteis que não estão mais ativos (atingiram o alvo ou perderam o alvo)
        this.projectiles = this.projectiles.filter(p => p.active);
        
        // Atualiza partículas de moeda
        for (let i = this.coinParticles.length - 1; i >= 0; i--) {
            const particle = this.coinParticles[i];
            particle.update();
            
            // Remove partículas inativas
            if (!particle.active) {
                this.coinParticles.splice(i, 1);
            }
        }
    }

    /**
     * Desenha tudo no canvas
     */
    draw() {
        // Limpa o canvas (apaga tudo que estava desenhado antes)
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Desenha o terreno (background com tiles de ground)
        this.drawTerrain();

        // Desenha o grid (opcional, pode comentar depois para esconder as linhas)
        // this.drawGrid();

        // Desenha o caminho (estrada onde os inimigos passam)
        this.drawPath();

        // Desenha preview da torre (quando o mouse passa por cima de uma célula válida)
        let towerCost = CONFIG.TOWER_BASIC_COST;
        if (this.selectedTowerLevel === 'upgrade') {
            towerCost = CONFIG.TOWER_UPGRADE_COST;
        } else if (this.selectedTowerLevel === 'premium') {
            towerCost = CONFIG.TOWER_PREMIUM_COST;
        }
        
        if (this.selectedTowerPosition && this.coins >= towerCost) {
            this.drawTowerPreview(this.selectedTowerPosition.gridX, this.selectedTowerPosition.gridY);
        }

        // Desenha todas as torres colocadas
        const currentTime = performance.now();
        for (const tower of this.towers) {
            // Atualiza animação da torre
            tower.update(currentTime);
            // Desenha a torre (passa currentTime para animação)
            tower.draw(this.ctx, false, currentTime);
        }

        // Desenha todos os inimigos (ativos ou morrendo)
        for (const enemy of this.enemies) {
            if (enemy.active || enemy.isDying) {
                enemy.draw(this.ctx);
            }
        }

        // Desenha todos os projéteis voando
        for (const projectile of this.projectiles) {
            if (projectile.active) {
                projectile.draw(this.ctx);
            }
        }
        
        // Desenha todas as partículas de moeda
        for (const particle of this.coinParticles) {
            particle.draw(this.ctx);
        }
    }

    /**
     * Desenha o terreno usando tiles de ground
     */
    drawTerrain() {
        // Loop para desenhar cada célula do grid
        for (let row = 0; row < CONFIG.GRID_ROWS; row++) {
            for (let col = 0; col < CONFIG.GRID_COLS; col++) {
                // Calcula a posição em pixels desta célula
                const x = col * CONFIG.CELL_SIZE;
                const y = row * CONFIG.CELL_SIZE;
                
                // Verifica se está no caminho (não desenha terreno no caminho)
                // O caminho será desenhado depois pela função drawPath()
                if (!this.isOnPath(col, row)) {
                    // Usa o tile Ground 52 para o terreno principal
                    const img = IMAGES.ground52;
                    if (img) {
                        // Desenha o tile de terreno maior que a célula (1.5x) para melhor visualização
                        const tileSize = CONFIG.CELL_SIZE * 1.5;
                        const tileX = x - (tileSize - CONFIG.CELL_SIZE) / 2;
                        const tileY = y - (tileSize - CONFIG.CELL_SIZE) / 2;
                        this.ctx.drawImage(img, tileX, tileY, tileSize, tileSize);
                    } else {
                        // Fallback: se a imagem não carregou, desenha cor de fundo sólida
                        this.ctx.fillStyle = '#ecf0f1'; // Cor cinza claro
                        this.ctx.fillRect(x, y, CONFIG.CELL_SIZE, CONFIG.CELL_SIZE);
                    }
                }
            }
        }
    }

    /**
     * Desenha o grid
     */
    drawGrid() {
        this.ctx.strokeStyle = '#bdc3c7';
        this.ctx.lineWidth = 1;

        // Linhas verticais
        for (let i = 0; i <= CONFIG.GRID_COLS; i++) {
            const x = i * CONFIG.CELL_SIZE;
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        // Linhas horizontais
        for (let i = 0; i <= CONFIG.GRID_ROWS; i++) {
            const y = i * CONFIG.CELL_SIZE;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    /**
     * Desenha o caminho usando o tile Ground 41
     */
    drawPath() {
        // Calcula a posição Y do caminho (linha do meio do mapa)
        const pathY = (CONFIG.GRID_ROWS / 2) * CONFIG.CELL_SIZE;
        const pathRow = Math.floor((CONFIG.GRID_ROWS / 2));
        
        // Pega a imagem do tile da estrada (Ground 41)
        const pathImg = IMAGES.ground41;
        
        // Desenha tiles de estrada para cada célula na linha do caminho
        for (let col = 0; col < CONFIG.GRID_COLS; col++) {
            const x = col * CONFIG.CELL_SIZE;
            const y = pathY;
            
            if (pathImg) {
                // Desenha o tile da estrada maior que a célula (1.5x) para melhor visualização
                const tileSize = CONFIG.CELL_SIZE * 1.5;
                const tileX = x - (tileSize - CONFIG.CELL_SIZE) / 2;
                const tileY = y - (tileSize - CONFIG.CELL_SIZE) / 2;
                this.ctx.drawImage(pathImg, tileX, tileY, tileSize, tileSize);
            } else {
                // Fallback: se a imagem não carregou, desenha cor de caminho
                this.ctx.fillStyle = '#95a5a6'; // Cor cinza
                this.ctx.fillRect(x, y, CONFIG.CELL_SIZE, CONFIG.CELL_SIZE);
                
                // Desenha uma borda ao redor do caminho
                this.ctx.strokeStyle = '#7f8c8d'; // Cor cinza mais escura
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(x, y, CONFIG.CELL_SIZE, CONFIG.CELL_SIZE);
            }
        }
    }

    /**
     * Desenha preview da torre antes de colocar
     * @param {number} gridX - Posição X no grid
     * @param {number} gridY - Posição Y no grid
     */
    drawTowerPreview(gridX, gridY) {
        // Calcula a posição central da célula (onde a torre ficaria)
        const x = gridX * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2;
        const y = gridY * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2;

        // Desenha o círculo de alcance da torre (mostra onde ela pode atirar)
        this.ctx.strokeStyle = 'rgba(52, 152, 219, 0.5)'; // Azul semi-transparente
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        // Desenha um círculo com raio igual ao alcance da torre
        this.ctx.arc(x, y, CONFIG.TOWER_RANGE, 0, Math.PI * 2);
        this.ctx.stroke();

        // Desenha preview da torre (sprite transparente mostrando onde será colocada)
        // Cria uma torre temporária para desenhar o preview com o nível correto
        const previewTower = new Tower(gridX, gridY, 1, this.selectedTowerLevel);
        const tower = IMAGES.tower1;
        const drawX = gridX * CONFIG.CELL_SIZE;
        const drawY = gridY * CONFIG.CELL_SIZE;
        
        if (tower) {
            // Escolhe qual animação usar baseado no nível selecionado
            let animationArray = null;
            if (this.selectedTowerLevel === 'premium') {
                animationArray = tower.animationPremium;
            } else if (this.selectedTowerLevel === 'upgrade') {
                animationArray = tower.animationUpgrade;
            } else {
                animationArray = tower.animationBasic;
            }
            
            // Tenta usar o primeiro frame da animação (se disponível)
            if (animationArray && animationArray.length > 0 && animationArray[0]) {
                // Usa o primeiro frame da animação com transparência
                this.ctx.globalAlpha = 0.5; // 50% de opacidade (semi-transparente)
                // Desenha preview da torre maior que a célula (1.5x) para melhor visualização
                const previewTowerSize = CONFIG.CELL_SIZE * 1.5;
                const previewTowerX = gridX * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2 - previewTowerSize / 2;
                const previewTowerY = gridY * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2 - previewTowerSize / 2;
                this.ctx.drawImage(animationArray[0], previewTowerX, previewTowerY, previewTowerSize, previewTowerSize);
                this.ctx.globalAlpha = 1.0; // Volta a opacidade normal (100%)
            } else if (tower.throwerBack && tower.throwerBack.basic) {
                // Fallback: usa os componentes separados se a animação não estiver disponível
                this.ctx.globalAlpha = 0.5; // 50% de opacidade (semi-transparente)
                
                // Desenha as 3 camadas na ordem correta
                // Desenha preview dos componentes maiores que a célula (1.5x) para melhor visualização
                const previewTowerSize = CONFIG.CELL_SIZE * 1.5;
                const previewTowerX = gridX * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2 - previewTowerSize / 2;
                const previewTowerY = gridY * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2 - previewTowerSize / 2;
                if (tower.throwerBack.basic) {
                    this.ctx.drawImage(tower.throwerBack.basic, previewTowerX, previewTowerY, previewTowerSize, previewTowerSize);
                }
                if (tower.base.basic) {
                    this.ctx.drawImage(tower.base.basic, previewTowerX, previewTowerY, previewTowerSize, previewTowerSize);
                }
                if (tower.throwerFront.basic) {
                    this.ctx.drawImage(tower.throwerFront.basic, previewTowerX, previewTowerY, previewTowerSize, previewTowerSize);
                }
                
                this.ctx.globalAlpha = 1.0; // Volta a opacidade normal (100%)
            } else {
                // Fallback: se a imagem não carregou, desenha retângulo transparente
                const size = CONFIG.CELL_SIZE * 0.7;
                this.ctx.fillStyle = 'rgba(127, 140, 141, 0.5)'; // Cinza semi-transparente
                this.ctx.fillRect(x - size / 2, y - size / 2, size, size);
            }
        } else {
            // Fallback: se a imagem não carregou, desenha retângulo transparente
            const size = CONFIG.CELL_SIZE * 0.7;
            this.ctx.fillStyle = 'rgba(127, 140, 141, 0.5)'; // Cinza semi-transparente
            this.ctx.fillRect(x - size / 2, y - size / 2, size, size);
        }
    }

    /**
     * Atualiza o HUD na interface
     */
    updateHUD() {
        // Atualiza os valores mostrados no HUD (Heads-Up Display) na interface HTML
        // HUD = informações do jogo mostradas na tela (vida, moedas, wave)
        
        // Atualiza a vida da aldeia no elemento HTML
        document.getElementById('village-life').textContent = this.villageLife;
        // Atualiza as moedas no elemento HTML
        document.getElementById('coins').textContent = this.coins;
        // Atualiza a wave atual no elemento HTML
        document.getElementById('wave').textContent = this.wave;
        
        // Atualiza a disponibilidade das torres no menu de compra
        this.updateTowerShopAvailability();
    }
    
    /**
     * Atualiza a tela de debug com os stats atuais
     */
    updateDebugScreen() {
        // Tower Stats
        const debugTowerRange = document.getElementById('debugTowerRange');
        const debugTowerDamage = document.getElementById('debugTowerDamage');
        const debugTowerFireRate = document.getElementById('debugTowerFireRate');
        if (debugTowerRange) debugTowerRange.textContent = CONFIG.TOWER_RANGE;
        if (debugTowerDamage) debugTowerDamage.textContent = CONFIG.TOWER_DAMAGE;
        if (debugTowerFireRate) debugTowerFireRate.textContent = CONFIG.TOWER_FIRE_RATE + 'ms';
        
        // Tower Costs
        const debugTowerBasicCost = document.getElementById('debugTowerBasicCost');
        const debugTowerUpgradeCost = document.getElementById('debugTowerUpgradeCost');
        const debugTowerPremiumCost = document.getElementById('debugTowerPremiumCost');
        if (debugTowerBasicCost) debugTowerBasicCost.textContent = CONFIG.TOWER_BASIC_COST;
        if (debugTowerUpgradeCost) debugTowerUpgradeCost.textContent = CONFIG.TOWER_UPGRADE_COST;
        if (debugTowerPremiumCost) debugTowerPremiumCost.textContent = CONFIG.TOWER_PREMIUM_COST;
        
        // Enemy Stats
        const debugEnemySpeed = document.getElementById('debugEnemySpeed');
        const debugEnemyHealth = document.getElementById('debugEnemyHealth');
        const debugEnemyReward = document.getElementById('debugEnemyReward');
        if (debugEnemySpeed) debugEnemySpeed.textContent = CONFIG.ENEMY_SPEED.toFixed(1);
        if (debugEnemyHealth) debugEnemyHealth.textContent = CONFIG.ENEMY_HEALTH;
        if (debugEnemyReward) debugEnemyReward.textContent = CONFIG.ENEMY_REWARD;
        
        // Wave Settings
        const debugMaxWaves = document.getElementById('debugMaxWaves');
        const debugEnemiesPerWave = document.getElementById('debugEnemiesPerWave');
        const debugWaveMultiplier = document.getElementById('debugWaveMultiplier');
        if (debugMaxWaves) debugMaxWaves.textContent = CONFIG.MAX_WAVES;
        if (debugEnemiesPerWave) debugEnemiesPerWave.textContent = CONFIG.ENEMIES_PER_WAVE;
        if (debugWaveMultiplier) debugWaveMultiplier.textContent = CONFIG.WAVE_MULTIPLIER.toFixed(1);
        
        // Game State
        const debugCoins = document.getElementById('debugCoins');
        const debugVillageLife = document.getElementById('debugVillageLife');
        if (debugCoins) debugCoins.textContent = this.coins;
        if (debugVillageLife) debugVillageLife.textContent = this.villageLife;
    }
    
    /**
     * Atualiza a seleção visual no menu de compra de torres
     */
    updateTowerShopSelection() {
        // Remove a classe 'selected' de todas as opções
        const allOptions = document.querySelectorAll('.tower-option');
        allOptions.forEach(option => option.classList.remove('selected'));
        
        // Adiciona a classe 'selected' à opção escolhida
        const selectedOption = document.getElementById(`tower-${this.selectedTowerLevel}`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
    }
    
    /**
     * Desenha os previews das torres no menu de compra
     */
    drawTowerShopPreviews() {
        if (!this.imagesLoaded) return;
        
        const tower = IMAGES.tower1;
        if (!tower) return;
        
        // Preview Basic
        const canvasBasic = document.getElementById('preview-basic');
        if (canvasBasic && tower.animationBasic && tower.animationBasic[0]) {
            const ctxBasic = canvasBasic.getContext('2d');
            canvasBasic.width = 60;
            canvasBasic.height = 60;
            ctxBasic.drawImage(tower.animationBasic[0], 0, 0, 60, 60);
        }
        
        // Preview Upgrade
        const canvasUpgrade = document.getElementById('preview-upgrade');
        if (canvasUpgrade && tower.animationUpgrade && tower.animationUpgrade[0]) {
            const ctxUpgrade = canvasUpgrade.getContext('2d');
            canvasUpgrade.width = 60;
            canvasUpgrade.height = 60;
            ctxUpgrade.drawImage(tower.animationUpgrade[0], 0, 0, 60, 60);
        }
        
        // Preview Premium
        const canvasPremium = document.getElementById('preview-premium');
        if (canvasPremium && tower.animationPremium && tower.animationPremium[0]) {
            const ctxPremium = canvasPremium.getContext('2d');
            canvasPremium.width = 60;
            canvasPremium.height = 60;
            ctxPremium.drawImage(tower.animationPremium[0], 0, 0, 60, 60);
        }
        
        // Atualiza os custos exibidos no menu de compra
        this.updateTowerShopCosts();
    }
    
    /**
     * Atualiza os custos exibidos no menu de compra de torres
     */
    updateTowerShopCosts() {
        const costBasic = document.getElementById('cost-basic');
        const costUpgrade = document.getElementById('cost-upgrade');
        const costPremium = document.getElementById('cost-premium');
        if (costBasic) costBasic.textContent = `${CONFIG.TOWER_BASIC_COST} coins`;
        if (costUpgrade) costUpgrade.textContent = `${CONFIG.TOWER_UPGRADE_COST} coins`;
        if (costPremium) costPremium.textContent = `${CONFIG.TOWER_PREMIUM_COST} coins`;
        
        // Atualiza o estado de disponibilidade das torres baseado nas moedas
        this.updateTowerShopAvailability();
    }
    
    /**
     * Atualiza a disponibilidade visual das torres no menu de compra
     * Adiciona classe 'unaffordable' se o jogador não tiver dinheiro suficiente
     */
    updateTowerShopAvailability() {
        const basicOption = document.getElementById('tower-basic');
        const upgradeOption = document.getElementById('tower-upgrade');
        const premiumOption = document.getElementById('tower-premium');
        
        // Basic Tower
        if (basicOption) {
            if (this.coins < CONFIG.TOWER_BASIC_COST) {
                basicOption.classList.add('unaffordable');
            } else {
                basicOption.classList.remove('unaffordable');
            }
        }
        
        // Upgrade Tower
        if (upgradeOption) {
            if (this.coins < CONFIG.TOWER_UPGRADE_COST) {
                upgradeOption.classList.add('unaffordable');
            } else {
                upgradeOption.classList.remove('unaffordable');
            }
        }
        
        // Premium Tower
        if (premiumOption) {
            if (this.coins < CONFIG.TOWER_PREMIUM_COST) {
                premiumOption.classList.add('unaffordable');
            } else {
                premiumOption.classList.remove('unaffordable');
            }
        }
    }

    /**
     * Loop principal do jogo
     */
    gameLoop() {
        // Se o jogo terminou, para o loop imediatamente
        if (this.gameOver) {
            this.animationFrameId = null;
            return;
        }
        
        // Pega o tempo atual em milissegundos (preciso para animações e cooldowns)
        const currentTime = performance.now();
        
        // Atualiza a lógica do jogo (movimento, colisões, etc.)
        this.update(currentTime);
        // Desenha tudo no canvas
        this.draw();
        
        // Atualiza a tela de debug
        this.updateDebugScreen();

        // Agenda o próximo frame (cria um loop infinito de 60 FPS)
        // requestAnimationFrame é uma função do navegador que chama a função
        // no próximo frame de renderização (geralmente 60 vezes por segundo)
        this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
    }
    
    /**
     * Para o loop do jogo
     */
    stopGameLoop() {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
    
    /**
     * Alterna o estado de pausa do jogo
     */
    togglePause() {
        this.paused = !this.paused;
        const btnPause = document.getElementById('btnPause');
        if (btnPause) {
            btnPause.textContent = this.paused ? 'Resume' : 'Pause';
        }
    }
    
    /**
     * Reinicia o jogo com as novas configurações
     */
    restart() {
        // Para o loop atual
        this.stopGameLoop();
        this.gameOver = true;
        
        // Reseta todas as variáveis
        this.coins = CONFIG.STARTING_COINS;
        this.villageLife = CONFIG.STARTING_VILLAGE_LIFE;
        this.wave = 0;
        this.gameOver = false;
        this.paused = false;
        this.towers = [];
        this.enemies = [];
        this.projectiles = [];
        this.coinParticles = [];
        this.waveInProgress = false;
        this.wavePauseStart = 0;
        this.enemiesInWave = 0;
        this.enemiesSpawned = 0;
        this.lastSpawnTime = 0; // Reseta o tempo de spawn
        this.waveSpeed = CONFIG.ENEMY_SPEED; // Reseta a velocidade para o valor base
        this.waveHealth = CONFIG.ENEMY_HEALTH; // Reseta a vida para o valor base
        this.currentMonsterType = 1; // Reseta o tipo de monstro
        this.selectedTowerPosition = null;
        
        // Atualiza o HUD
        this.updateHUD();
        
        // Atualiza a tela de debug
        this.updateDebugScreen();
        
        // Atualiza os custos no menu de compra
        this.updateTowerShopCosts();
        
        // Reinicia o loop
        this.lastTime = performance.now();
        // Reseta o tempo de spawn para evitar bugs ao reiniciar
        this.lastSpawnTime = 0;
        this.animationFrameId = null; // Garante que não há loop anterior
        
        // Debug: mostra que o jogo foi reiniciado
        console.log('🔄 Jogo reiniciado - Stats resetados:');
        console.log(`   Wave: ${this.wave}`);
        console.log(`   Wave Speed: ${this.waveSpeed.toFixed(2)} (Base: ${CONFIG.ENEMY_SPEED.toFixed(2)})`);
        console.log(`   Wave Health: ${this.waveHealth.toFixed(0)} (Base: ${CONFIG.ENEMY_HEALTH})`);
        console.log(`   Last Spawn Time: ${this.lastSpawnTime}`);
        
        // Inicia o loop novamente
        this.gameOver = false; // Garante que o jogo não está em gameOver antes de iniciar
        this.gameLoop();
    }
}

// ============================================
// SISTEMA DE MENUS E OPÇÕES
// ============================================

/**
 * Gerencia os menus e opções do jogo
 */
class MenuManager {
    constructor() {
        // Carrega opções salvas do localStorage
        this.loadOptions();
        
        // Aplica as opções carregadas ao CONFIG
        this.applyOptions();
        
        // Configura os event listeners dos menus
        this.setupMenuListeners();
        
        // Atualiza os valores nos inputs do menu de opções
        this.updateOptionsUI();
        
        // Aguarda as imagens carregarem para desenhar os backgrounds
        this.waitForImagesAndDraw();
    }
    
    /**
     * Aguarda as imagens do GUI carregarem e desenha os backgrounds
     */
    async waitForImagesAndDraw() {
        // Position buttons for initial menu (using img tag)
        this.positionInitialMenuButtons();
        
        // Aguarda um pouco para garantir que as imagens começaram a carregar
        // Tenta várias vezes porque as imagens podem carregar em momentos diferentes
        let attempts = 0;
        const maxAttempts = 30; // Tenta por até 3 segundos (30 × 100ms)
        
        const tryDraw = () => {
            attempts++;
            // Verifica se as imagens já carregaram (apenas para options menu agora)
            if (IMAGES.settings || IMAGES.buttons) {
                this.drawMenuBackgrounds();
                // Se os sprites foram processados, atualiza os botões
                if (IMAGES.buttonNormal) {
                    this.updateButtonsWithSprites();
                }
            } else if (attempts < maxAttempts) {
                // Se não carregaram ainda, tenta novamente
                setTimeout(tryDraw, 100);
            }
        };
        
        setTimeout(tryDraw, 100);
    }
    
    /**
     * Positions the clickable buttons relative to the initial menu image
     */
    positionInitialMenuButtons() {
        const img = document.getElementById('initialMenuImage');
        const btnPlay = document.getElementById('btnPlay');
        const btnOptions = document.getElementById('btnOptions');
        
        if (!img || !btnPlay || !btnOptions) return;
        
        // Wait for image to load
        if (img.complete) {
            this.calculateButtonPositions(img, btnPlay, btnOptions);
        } else {
            img.onload = () => {
                this.calculateButtonPositions(img, btnPlay, btnOptions);
            };
        }
        
        // Also recalculate on window resize
        window.addEventListener('resize', () => {
            if (img.complete) {
                this.calculateButtonPositions(img, btnPlay, btnOptions);
            }
        });
    }
    
    /**
     * Calculates button positions based on image scale
     */
    calculateButtonPositions(img, btnPlay, btnOptions) {
        // Get natural (original) image dimensions
        const naturalWidth = img.naturalWidth;
        const naturalHeight = img.naturalHeight;
        
        // Get displayed image dimensions
        const displayedWidth = img.offsetWidth;
        const displayedHeight = img.offsetHeight;
        
        // Calculate scale factors
        const scaleX = displayedWidth / naturalWidth;
        const scaleY = displayedHeight / naturalHeight;
        
        // Original button positions (from image coordinates)
        const playX = 359.3;
        const playY = 1323.9;
        const playW = 375.3;
        const playH = 116.3;
        
        const optionsX = 359.3;
        const optionsY = 1487.7;
        const optionsW = 375.3;
        const optionsH = 116.3;
        
        // Get image position relative to container
        const imgRect = img.getBoundingClientRect();
        const containerRect = img.parentElement.getBoundingClientRect();
        
        // Calculate positions relative to image (not container)
        const imgOffsetX = imgRect.left - containerRect.left;
        const imgOffsetY = imgRect.top - containerRect.top;
        
        // Calculate scaled positions relative to container
        btnPlay.style.left = (imgOffsetX + playX * scaleX) + 'px';
        btnPlay.style.top = (imgOffsetY + playY * scaleY) + 'px';
        btnPlay.style.width = (playW * scaleX) + 'px';
        btnPlay.style.height = (playH * scaleY) + 'px';
        
        btnOptions.style.left = (imgOffsetX + optionsX * scaleX) + 'px';
        btnOptions.style.top = (imgOffsetY + optionsY * scaleY) + 'px';
        btnOptions.style.width = (optionsW * scaleX) + 'px';
        btnOptions.style.height = (optionsH * scaleY) + 'px';
        
        // Position buttons relative to container
        btnPlay.style.position = 'absolute';
        btnOptions.style.position = 'absolute';
    }
    
    /**
     * Atualiza os botões HTML para usar os sprites recortados
     */
    updateButtonsWithSprites() {
        // Pega todos os botões com a classe gui-btn
        const buttons = document.querySelectorAll('.gui-btn');
        
        buttons.forEach(button => {
            // Cria um canvas para cada botão
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 60;
            const ctx = canvas.getContext('2d');
            
            // Desenha o sprite normal como background
            if (IMAGES.buttonNormal) {
                ctx.drawImage(IMAGES.buttonNormal, 0, 0, canvas.width, canvas.height);
            }
            
            // Define o canvas como background do botão
            button.style.backgroundImage = `url(${canvas.toDataURL()})`;
            button.style.backgroundSize = 'cover';
            button.style.backgroundPosition = 'center';
            button.style.backgroundRepeat = 'no-repeat';
            
            // Adiciona efeito hover
            button.addEventListener('mouseenter', () => {
                if (IMAGES.buttonHover) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(IMAGES.buttonHover, 0, 0, canvas.width, canvas.height);
                    button.style.backgroundImage = `url(${canvas.toDataURL()})`;
                }
            });
            
            button.addEventListener('mouseleave', () => {
                if (IMAGES.buttonNormal) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(IMAGES.buttonNormal, 0, 0, canvas.width, canvas.height);
                    button.style.backgroundImage = `url(${canvas.toDataURL()})`;
                }
            });
            
            button.addEventListener('mousedown', () => {
                if (IMAGES.buttonPressed) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(IMAGES.buttonPressed, 0, 0, canvas.width, canvas.height);
                    button.style.backgroundImage = `url(${canvas.toDataURL()})`;
                }
            });
            
            button.addEventListener('mouseup', () => {
                if (IMAGES.buttonHover) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(IMAGES.buttonHover, 0, 0, canvas.width, canvas.height);
                    button.style.backgroundImage = `url(${canvas.toDataURL()})`;
                }
            });
        });
    }
    
    /**
     * Carrega opções salvas do localStorage
     */
    loadOptions() {
        // Tenta carregar opções salvas
        const savedOptions = localStorage.getItem('towerDefenseOptions');
        if (savedOptions) {
            try {
                // Converte de JSON para objeto
                const options = JSON.parse(savedOptions);
                // Aplica as opções ao CONFIG
                Object.assign(CONFIG, options);
                console.log('✓ Opções carregadas do localStorage');
            } catch (error) {
                console.warn('⚠ Erro ao carregar opções:', error);
            }
        }
    }
    
    /**
     * Salva opções no localStorage
     */
    saveOptions() {
        // Cria objeto com todas as opções configuráveis
        const options = {
            MAX_WAVES: CONFIG.MAX_WAVES,
            TOWER_BASIC_COST: CONFIG.TOWER_BASIC_COST,
            TOWER_UPGRADE_COST: CONFIG.TOWER_UPGRADE_COST,
            TOWER_PREMIUM_COST: CONFIG.TOWER_PREMIUM_COST,
            ENEMY_REWARD: CONFIG.ENEMY_REWARD,
            TOWER_RANGE: CONFIG.TOWER_RANGE,
            TOWER_DAMAGE: CONFIG.TOWER_DAMAGE,
            TOWER_FIRE_RATE: CONFIG.TOWER_FIRE_RATE,
            STARTING_COINS: CONFIG.STARTING_COINS,
            STARTING_VILLAGE_LIFE: CONFIG.STARTING_VILLAGE_LIFE,
            ENEMY_SPEED: CONFIG.ENEMY_SPEED,
            ENEMY_HEALTH: CONFIG.ENEMY_HEALTH,
            ENEMIES_PER_WAVE: CONFIG.ENEMIES_PER_WAVE,
            WAVE_MULTIPLIER: CONFIG.WAVE_MULTIPLIER,
        };
        
        // Salva no localStorage
        localStorage.setItem('towerDefenseOptions', JSON.stringify(options));
    }
    
    /**
     * Applies options to CONFIG
     */
    applyOptions() {
        // Options are already applied in loadOptions()
        // This function exists to be called manually if needed
    }
    
    /**
     * Aplica as opções atualizadas ao jogo em execução
     */
    applyOptionsToGame() {
        if (!window.gameInstance) return;
        
        const game = window.gameInstance;
        
        // Atualiza os custos das torres no menu de compra
        game.updateTowerShopCosts();
        
        // Atualiza as torres existentes com novos valores de alcance, dano e fire rate
        game.towers.forEach(tower => {
            tower.range = CONFIG.TOWER_RANGE;
            tower.damage = CONFIG.TOWER_DAMAGE;
            
            // Atualiza fire rate baseado no nível da torre
            if (tower.upgradeLevel === 'upgrade' || tower.upgradeLevel === 'premium') {
                tower.fireRate = CONFIG.TOWER_FIRE_RATE / 2;
            } else {
                tower.fireRate = CONFIG.TOWER_FIRE_RATE;
            }
        });
        
        // Atualiza projéteis existentes com novo dano
        game.projectiles.forEach(projectile => {
            projectile.damage = CONFIG.TOWER_DAMAGE;
        });
        
        // Atualiza a tela de debug
        game.updateDebugScreen();
        
        // Nota: STARTING_COINS e STARTING_VILLAGE_LIFE só se aplicam em novos jogos
        // MAX_WAVES, ENEMIES_PER_WAVE, WAVE_MULTIPLIER serão aplicados nas próximas waves
        // ENEMY_SPEED e ENEMY_HEALTH serão aplicados aos novos inimigos spawnados
    }
    
    /**
     * Resets all options to default values
     */
    resetDefaults() {
        // Restore all CONFIG values from DEFAULT_CONFIG
        Object.assign(CONFIG, DEFAULT_CONFIG);
        
        // Update the UI with default values
        this.updateOptionsUI();
        
        // Save the defaults
        this.saveOptions();
        
        // Show confirmation
        alert('Options reset to default values!');
    }
    
    /**
     * Atualiza os valores nos inputs do menu de opções
     */
    updateOptionsUI() {
        // Atualiza cada input com o valor atual do CONFIG
        document.getElementById('optMaxWaves').value = CONFIG.MAX_WAVES;
        document.getElementById('optTowerBasicCost').value = CONFIG.TOWER_BASIC_COST;
        document.getElementById('optTowerUpgradeCost').value = CONFIG.TOWER_UPGRADE_COST;
        document.getElementById('optTowerPremiumCost').value = CONFIG.TOWER_PREMIUM_COST;
        document.getElementById('optEnemyReward').value = CONFIG.ENEMY_REWARD;
        document.getElementById('optTowerRange').value = CONFIG.TOWER_RANGE;
        document.getElementById('optTowerDamage').value = CONFIG.TOWER_DAMAGE;
        document.getElementById('optTowerFireRate').value = CONFIG.TOWER_FIRE_RATE;
        document.getElementById('optStartingCoins').value = CONFIG.STARTING_COINS;
        document.getElementById('optStartingLife').value = CONFIG.STARTING_VILLAGE_LIFE;
        document.getElementById('optEnemySpeed').value = CONFIG.ENEMY_SPEED;
        document.getElementById('optEnemyHealth').value = CONFIG.ENEMY_HEALTH;
        document.getElementById('optEnemiesPerWave').value = CONFIG.ENEMIES_PER_WAVE;
        document.getElementById('optWaveMultiplier').value = CONFIG.WAVE_MULTIPLIER;
        
        // Atualiza os valores exibidos
        this.updateOptionValues();
    }
    
    /**
     * Atualiza os valores exibidos ao lado dos inputs
     */
    updateOptionValues() {
        document.getElementById('optMaxWavesValue').textContent = CONFIG.MAX_WAVES;
        document.getElementById('optTowerBasicCostValue').textContent = CONFIG.TOWER_BASIC_COST;
        document.getElementById('optTowerUpgradeCostValue').textContent = CONFIG.TOWER_UPGRADE_COST;
        document.getElementById('optTowerPremiumCostValue').textContent = CONFIG.TOWER_PREMIUM_COST;
        document.getElementById('optEnemyRewardValue').textContent = CONFIG.ENEMY_REWARD;
        document.getElementById('optTowerRangeValue').textContent = CONFIG.TOWER_RANGE;
        document.getElementById('optTowerDamageValue').textContent = CONFIG.TOWER_DAMAGE;
        document.getElementById('optTowerFireRateValue').textContent = CONFIG.TOWER_FIRE_RATE;
        document.getElementById('optStartingCoinsValue').textContent = CONFIG.STARTING_COINS;
        document.getElementById('optStartingLifeValue').textContent = CONFIG.STARTING_VILLAGE_LIFE;
        document.getElementById('optEnemySpeedValue').textContent = CONFIG.ENEMY_SPEED;
        document.getElementById('optEnemyHealthValue').textContent = CONFIG.ENEMY_HEALTH;
        document.getElementById('optEnemiesPerWaveValue').textContent = CONFIG.ENEMIES_PER_WAVE;
        document.getElementById('optWaveMultiplierValue').textContent = CONFIG.WAVE_MULTIPLIER;
    }
    
    /**
     * Lê os valores dos inputs e aplica ao CONFIG
     */
    readOptionsFromUI() {
        // Lê cada valor do input e aplica ao CONFIG
        CONFIG.MAX_WAVES = parseInt(document.getElementById('optMaxWaves').value) || 10;
        CONFIG.TOWER_BASIC_COST = parseInt(document.getElementById('optTowerBasicCost').value) || 50;
        CONFIG.TOWER_UPGRADE_COST = parseInt(document.getElementById('optTowerUpgradeCost').value) || 500;
        CONFIG.TOWER_PREMIUM_COST = parseInt(document.getElementById('optTowerPremiumCost').value) || 1000;
        CONFIG.ENEMY_REWARD = parseInt(document.getElementById('optEnemyReward').value) || 10;
        CONFIG.TOWER_RANGE = parseInt(document.getElementById('optTowerRange').value) || 50;
        CONFIG.TOWER_DAMAGE = parseInt(document.getElementById('optTowerDamage').value) || 25;
        CONFIG.TOWER_FIRE_RATE = parseInt(document.getElementById('optTowerFireRate').value) || 1000;
        CONFIG.STARTING_COINS = parseInt(document.getElementById('optStartingCoins').value) || 200;
        CONFIG.STARTING_VILLAGE_LIFE = parseInt(document.getElementById('optStartingLife').value) || 100;
        CONFIG.ENEMY_SPEED = parseFloat(document.getElementById('optEnemySpeed').value) || 1.0;
        CONFIG.ENEMY_HEALTH = parseInt(document.getElementById('optEnemyHealth').value) || 50;
        CONFIG.ENEMIES_PER_WAVE = parseInt(document.getElementById('optEnemiesPerWave').value) || 5;
        CONFIG.WAVE_MULTIPLIER = parseFloat(document.getElementById('optWaveMultiplier').value) || 1.2;
    }
    
    /**
     * Desenha o background do menu usando sprites do GUI
     */
    drawMenuBackgrounds() {
        // Desenha background do menu principal
        const mainMenuCanvas = document.getElementById('mainMenuCanvas');
        if (mainMenuCanvas && IMAGES.mainMenu) {
            const ctx = mainMenuCanvas.getContext('2d');
            const container = mainMenuCanvas.parentElement;
            mainMenuCanvas.width = container.offsetWidth;
            mainMenuCanvas.height = container.offsetHeight;
            // Desenha o sprite do menu principal (redimensionado)
            ctx.drawImage(IMAGES.mainMenu, 0, 0, mainMenuCanvas.width, mainMenuCanvas.height);
        }
        
        // Desenha background do menu de opções
        const optionsCanvas = document.getElementById('optionsMenuCanvas');
        if (optionsCanvas && IMAGES.settings) {
            const ctx = optionsCanvas.getContext('2d');
            const container = optionsCanvas.parentElement;
            optionsCanvas.width = container.offsetWidth;
            optionsCanvas.height = container.offsetHeight;
            // Desenha o sprite de settings (redimensionado)
            ctx.drawImage(IMAGES.settings, 0, 0, optionsCanvas.width, optionsCanvas.height);
        }
    }
    
    /**
     * Configura os event listeners dos menus
     */
    setupMenuListeners() {
        // Botão Play - inicia o jogo
        document.getElementById('btnPlay').addEventListener('click', () => {
            this.showGame();
        });
        
        // Botão Opções - mostra menu de opções
        document.getElementById('btnOptions').addEventListener('click', () => {
            this.showOptions();
        });
        
        // Botão Voltar do menu de opções - volta ao menu principal
        document.getElementById('btnBackToMenu').addEventListener('click', () => {
            // Aplica as opções antes de voltar (caso o usuário tenha mudado algo)
            this.readOptionsFromUI();
            this.saveOptions();
            this.applyOptionsToGame();
            this.showMainMenu();
        });
        
        // Save button - saves options and returns to menu
        document.getElementById('btnSaveOptions').addEventListener('click', () => {
            this.readOptionsFromUI();
            this.saveOptions();
            // Apply options to running game if it exists
            this.applyOptionsToGame();
            this.showMainMenu();
            alert('Options saved!');
        });
        
        // Reset Defaults button - restores all values to defaults
        document.getElementById('btnResetDefaults').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all options to default values?')) {
                this.resetDefaults();
            }
        });
        
        // Back button (in game HUD) - returns to main menu
        document.getElementById('btnBackToMainMenu').addEventListener('click', () => {
            if (window.gameInstance) {
                // Apply current options before returning to menu
                this.readOptionsFromUI();
                this.saveOptions();
                this.applyOptionsToGame();
                // Para o jogo completamente
                window.gameInstance.stopGameLoop();
                window.gameInstance.gameOver = true;
            }
            this.showMainMenu();
        });
        
        // Atualiza valores exibidos quando os inputs mudam
        const inputs = document.querySelectorAll('#optionsMenu input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.readOptionsFromUI();
                this.updateOptionValues();
            });
        });
        
        // Botão Pausa (no jogo)
        document.getElementById('btnPause').addEventListener('click', () => {
            if (window.gameInstance) {
                window.gameInstance.togglePause();
            }
        });
    }
    
    /**
     * Mostra o menu principal
     */
    showMainMenu() {
        document.getElementById('mainMenu').classList.remove('hidden');
        document.getElementById('optionsMenu').classList.add('hidden');
        document.getElementById('gameScreen').classList.add('hidden');
        // Redesenha o background quando o menu aparece
        setTimeout(() => this.drawMenuBackgrounds(), 50);
    }
    
    /**
     * Mostra o menu de opções
     */
    showOptions() {
        document.getElementById('mainMenu').classList.add('hidden');
        document.getElementById('optionsMenu').classList.remove('hidden');
        document.getElementById('gameScreen').classList.add('hidden');
        // Atualiza os valores nos inputs
        this.updateOptionsUI();
        // Redesenha o background quando o menu aparece
        setTimeout(() => this.drawMenuBackgrounds(), 50);
    }
    
    
    /**
     * Mostra o jogo e inicia
     */
    showGame() {
        document.getElementById('mainMenu').classList.add('hidden');
        document.getElementById('optionsMenu').classList.add('hidden');
        document.getElementById('gameScreen').classList.remove('hidden');
        
        // Aplica as opções antes de iniciar o jogo
        this.readOptionsFromUI();
        this.saveOptions();
        
        // Inicia o jogo (apenas se ainda não foi iniciado)
        if (!window.gameInstance) {
            window.gameInstance = new Game();
        } else {
            // Se já existe, reinicia
            window.gameInstance.restart();
        }
    }
}

// ============================================
// INICIALIZAÇÃO DO JOGO
// ============================================

// Variável global para guardar a instância do jogo
window.gameInstance = null;

// Aguarda a página HTML carregar completamente
window.addEventListener('load', () => {
    // Inicializa o gerenciador de menus
    // Isso carrega opções salvas e configura os menus
    window.menuManager = new MenuManager();
});

// ============================================
// PRÓXIMOS PASSOS E MELHORIAS FUTURAS
// ============================================

/*
 * IDEIAS PARA EXPANSÃO DO JOGO:
 * 
 * 1. DIFERENTES TIPOS DE TORRES:
 *    - Torre de Arco (rápida, baixo dano)
 *    - Torre de Canhão (lenta, alto dano, área)
 *    - Torre de Gelo (reduz velocidade dos inimigos)
 *    - Torre de Veneno (dano contínuo)
 * 
 * 2. SISTEMA DE UPGRADES:
 *    - Melhorar alcance
 *    - Melhorar dano
 *    - Melhorar velocidade de disparo
 *    - Adicionar efeitos especiais
 * 
 * 3. DIFERENTES TIPOS DE INIMIGOS:
 *    - Inimigo rápido (pouca vida)
 *    - Inimigo lento (muita vida)
 *    - Inimigo voador (caminho diferente)
 *    - Inimigo blindado (reduz dano recebido)
 * 
 * 4. MELHORIAS VISUAIS:
 *    - Substituir blocos coloridos por sprites reais
 *    - Adicionar animações (torres, inimigos, projéteis)
 *    - Efeitos de partículas (explosões, sangue)
 *    - Background temático medieval
 * 
 * 5. MELHORIAS DE UI/UX:
 *    - Menu inicial
 *    - Tela de game over com pontuação
 *    - Botão de pausa
 *    - Botão de velocidade (2x)
 *    - Indicador de próxima wave
 *    - Loja de torres com preview
 * 
 * 6. FEATURES ADICIONAIS:
 *    - Sistema de pontuação
 *    - Leaderboard (localStorage)
 *    - Sons e música
 *    - Diferentes mapas/caminhos
 *    - Power-ups temporários
 *    - Boss a cada 5 waves
 * 
 * 7. MELHORIAS TÉCNICAS:
 *    - Otimização de performance (quadtree para colisões)
 *    - Sistema de save/load
 *    - Configurações (volume, qualidade gráfica)
 *    - Suporte mobile (touch controls)
 */

