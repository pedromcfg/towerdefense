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
        animation: [] // Array com 9 frames da animação de disparo (tower1_1 a tower1_9)
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
            // Tower 1 - Animação de disparo (9 frames: tower1_1 a tower1_9)
            loadImage('tower1_anim1', 'assets/towers/PNG/tower1/tower1_1.png'),
            loadImage('tower1_anim2', 'assets/towers/PNG/tower1/tower1_2.png'),
            loadImage('tower1_anim3', 'assets/towers/PNG/tower1/tower1_3.png'),
            loadImage('tower1_anim4', 'assets/towers/PNG/tower1/tower1_4.png'),
            loadImage('tower1_anim5', 'assets/towers/PNG/tower1/tower1_5.png'),
            loadImage('tower1_anim6', 'assets/towers/PNG/tower1/tower1_6.png'),
            loadImage('tower1_anim7', 'assets/towers/PNG/tower1/tower1_7.png'),
            loadImage('tower1_anim8', 'assets/towers/PNG/tower1/tower1_8.png'),
            loadImage('tower1_anim9', 'assets/towers/PNG/tower1/tower1_9.png'),
            
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
        
        console.log('✅ Todas as imagens e animações carregadas!');
        
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
        // Animação de disparo: [0-8] = 9 frames da animação completa
        IMAGES.tower1.animation = [
            IMAGES.tower1_anim1, // Frame 1
            IMAGES.tower1_anim2, // Frame 2
            IMAGES.tower1_anim3, // Frame 3
            IMAGES.tower1_anim4, // Frame 4
            IMAGES.tower1_anim5, // Frame 5
            IMAGES.tower1_anim6, // Frame 6
            IMAGES.tower1_anim7, // Frame 7
            IMAGES.tower1_anim8, // Frame 8
            IMAGES.tower1_anim9  // Frame 9
        ];
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
    
    console.log('✅ Sprites das torres organizados!');
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
    
    console.log('✅ Sprite sheets processados!');
}

// ============================================
// CONFIGURAÇÕES GLOBAIS DO JOGO
// ============================================

// CONFIG é um objeto mutável que pode ser alterado pelas opções
// Valores padrão (serão sobrescritos pelas opções se existirem)
const CONFIG = {
    // Dimensões do grid (15 colunas x 15 linhas = 750x750 pixels)
    GRID_COLS: 15,
    GRID_ROWS: 15,
    
    // Tamanho de cada célula do grid (em pixels)
    CELL_SIZE: 50,
    
    // Recursos iniciais (podem ser alterados nas opções)
    STARTING_COINS: 200,
    STARTING_VILLAGE_LIFE: 100,
    
    // Custo da torre (pode ser alterado nas opções)
    TOWER_COST: 50,
    
    // Recompensa por matar inimigo (pode ser alterado nas opções)
    ENEMY_REWARD: 10,
    
    // Configurações das torres (podem ser alteradas nas opções)
    TOWER_RANGE: 100,        // Alcance em pixels
    TOWER_DAMAGE: 25,        // Dano por projétil
    TOWER_FIRE_RATE: 1000,   // Tempo entre disparos (ms)
    
    // Configurações dos inimigos (podem ser alteradas nas opções)
    ENEMY_SIZE: 30,
    ENEMY_SPEED: 0.5,        // Velocidade base (pixels por frame)
    ENEMY_HEALTH: 50,        // Vida inicial
    
    // Configurações dos projéteis
    PROJECTILE_SIZE: 8,
    PROJECTILE_SPEED: 5,
    
    // Configurações das waves (podem ser alteradas nas opções)
    WAVE_PAUSE_TIME: 3000,   // Pausa entre waves (ms)
    ENEMIES_PER_WAVE: 5,     // Inimigos iniciais por wave
    WAVE_MULTIPLIER: 1.2,    // Multiplicador de dificuldade por wave
    MAX_WAVES: 10,           // Número máximo de waves (pode ser alterado nas opções)
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
        this.animationSpeed = 0.15; // Velocidade da animação (frames por update)
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
            this.dyingFrame = Math.floor(this.dyingDuration * 0.3); // Velocidade da animação de morte
            
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
     */
    constructor(gridX, gridY, towerType = 1) {
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
        this.upgradeLevel = 'basic';
        
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
     * Dispara um projétil
     * @param {Enemy} target - Inimigo alvo
     * @param {number} currentTime - Tempo atual
     * @returns {Projectile|null} - Novo projétil ou null
     */
    fire(target, currentTime) {
        // Se não há alvo, não dispara
        if (!target) return null;

        // Atualiza o tempo do último disparo (para controlar cooldown)
        this.lastFireTime = currentTime;
        // Inicia animação de disparo
        this.animationTime = currentTime;
        this.isAnimating = true;
        this.animationFrame = 0;
        // Cria e retorna um novo projétil na posição da torre, mirando no alvo
        // Passa o tipo de torre para o projétil usar o sprite correto
        return new Projectile(this.x, this.y, target, this.damage, this.towerType);
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
            // Se está animando (disparando), usa a animação completa
            if (this.isAnimating && tower.animation && tower.animation.length > 0) {
                const frame = tower.animation[this.animationFrame];
                if (frame) {
                    ctx.drawImage(frame, drawX, drawY, CONFIG.CELL_SIZE, CONFIG.CELL_SIZE);
                } else {
                    // Fallback se o frame não existe
                    this.drawFallback(ctx);
                }
            } else {
                // Se não está animando, usa o primeiro frame da animação (tower1_1.png) como estado padrão
                if (tower.animation && tower.animation.length > 0 && tower.animation[0]) {
                    // Usa o primeiro frame da animação como estado parado
                    ctx.drawImage(tower.animation[0], drawX, drawY, CONFIG.CELL_SIZE, CONFIG.CELL_SIZE);
                } else {
                    // Fallback: se a animação não estiver disponível, usa os componentes separados
                    // Desenha as 3 camadas na ordem correta (de trás para frente)
                    
                    // 1. throwerBack (atrás)
                    const throwerBack = this.upgradeLevel === 'upgrade' || this.upgradeLevel === 'premium' 
                        ? tower.throwerBack.upgrade 
                        : tower.throwerBack.basic;
                    if (throwerBack) {
                        ctx.drawImage(throwerBack, drawX, drawY, CONFIG.CELL_SIZE, CONFIG.CELL_SIZE);
                    }
                    
                    // 2. base (no meio)
                    const base = this.upgradeLevel === 'premium' 
                        ? tower.base.premium 
                        : (this.upgradeLevel === 'upgrade' 
                            ? tower.base.upgrade 
                            : tower.base.basic);
                    if (base) {
                        ctx.drawImage(base, drawX, drawY, CONFIG.CELL_SIZE, CONFIG.CELL_SIZE);
                    }
                    
                    // 3. throwerFront (na frente)
                    const throwerFront = this.upgradeLevel === 'upgrade' || this.upgradeLevel === 'premium' 
                        ? tower.throwerFront.upgrade 
                        : tower.throwerFront.basic;
                    if (throwerFront) {
                        ctx.drawImage(throwerFront, drawX, drawY, CONFIG.CELL_SIZE, CONFIG.CELL_SIZE);
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

        // Arrays que guardam todos os objetos do jogo
        this.towers = []; // Todas as torres colocadas
        this.enemies = []; // Todos os inimigos no mapa
        this.projectiles = []; // Todos os projéteis voando

        // Estado das waves (ondas de inimigos)
        this.waveInProgress = false; // Se uma wave está acontecendo
        this.wavePauseStart = 0; // Quando começou a pausa entre waves
        this.enemiesInWave = 0; // Quantos inimigos devem aparecer nesta wave
        this.enemiesSpawned = 0; // Quantos inimigos já foram criados nesta wave

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
        console.log('🔄 Carregando recursos...');
        
        // Carrega todas as imagens
        this.imagesLoaded = await loadAllImages();
        
        if (this.imagesLoaded) {
            console.log('✅ Jogo pronto!');
        } else {
            console.warn('⚠ Algumas imagens não carregaram. Continuando com fallbacks.');
        }
        
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

        // Verifica se tem moedas suficientes para comprar a torre
        if (this.coins < CONFIG.TOWER_COST) {
            alert('Moedas insuficientes!');
            return; // Não tem dinheiro suficiente
        }

        // Tudo OK! Coloca a torre
        // Por padrão usa towerType = 1 (pode ser alterado depois para permitir escolher tipo)
        this.towers.push(new Tower(gridX, gridY, 1));
        // Deduz o custo da torre das moedas
        this.coins -= CONFIG.TOWER_COST;
        // Atualiza o HUD para mostrar as novas moedas
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
        
        // Mostra no console qual wave começou e qual monstro está sendo usado
        console.log(`🌊 Wave ${this.wave} iniciada! Usando Monster_${this.currentMonsterType}`);
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
                // Se ainda não spawnou nenhum OU já passou o intervalo
                if (this.enemiesSpawned === 0 || 
                    currentTime - this.lastSpawnTime >= spawnInterval) {
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
                
                console.log(`✅ Wave ${this.wave} completada!`);
                
                // Verifica se completou todas as waves configuradas
                if (this.wave >= CONFIG.MAX_WAVES) {
                    this.gameOver = true;
                    alert(`Parabéns! Você completou todas as ${CONFIG.MAX_WAVES} waves!`);
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
                    alert('Game Over! A aldeia foi destruída!');
                }
                // Remove o inimigo que chegou ao fim
                this.enemies.splice(i, 1);
                continue; // Pula para o próximo inimigo
            }

            // Remove inimigos que terminaram a animação de morte
            // Condições: não está ativo, não chegou ao fim, não está morrendo
            if (!enemy.active && !enemy.reachedEnd && !enemy.isDying) {
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
                // Se encontrou um alvo, dispara um projétil
                const projectile = tower.fire(target, currentTime);
                if (projectile) {
                    // Adiciona o projétil ao array de projéteis
                    this.projectiles.push(projectile);
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
        if (this.selectedTowerPosition && this.coins >= CONFIG.TOWER_COST) {
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
                        // Desenha o tile de terreno na posição da célula
                        this.ctx.drawImage(img, x, y, CONFIG.CELL_SIZE, CONFIG.CELL_SIZE);
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
                // Se a imagem carregou, desenha o tile da estrada
                this.ctx.drawImage(pathImg, x, y, CONFIG.CELL_SIZE, CONFIG.CELL_SIZE);
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

        // Desenha a linha central do caminho (linha tracejada mostrando a direção)
        this.ctx.strokeStyle = '#34495e'; // Cor azul escura
        this.ctx.lineWidth = 2;
        // Define o padrão de linha tracejada (10px linha, 5px espaço)
        this.ctx.setLineDash([10, 5]);
        this.ctx.beginPath();
        // Começa no primeiro ponto do caminho
        this.ctx.moveTo(this.path[0].x, this.path[0].y);
        // Desenha linhas conectando todos os pontos do caminho
        for (let i = 1; i < this.path.length; i++) {
            this.ctx.lineTo(this.path[i].x, this.path[i].y);
        }
        this.ctx.stroke();
        // Remove o padrão de linha tracejada (volta ao padrão sólido)
        this.ctx.setLineDash([]);
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
        // Usa tower1 como preview padrão
        const tower = IMAGES.tower1;
        const drawX = gridX * CONFIG.CELL_SIZE;
        const drawY = gridY * CONFIG.CELL_SIZE;
        
        if (tower) {
            // Tenta usar o primeiro frame da animação (se disponível)
            if (tower.animation && tower.animation.length > 0 && tower.animation[0]) {
                // Usa o primeiro frame da animação com transparência
                this.ctx.globalAlpha = 0.5; // 50% de opacidade (semi-transparente)
                this.ctx.drawImage(tower.animation[0], drawX, drawY, CONFIG.CELL_SIZE, CONFIG.CELL_SIZE);
                this.ctx.globalAlpha = 1.0; // Volta a opacidade normal (100%)
            } else if (tower.throwerBack && tower.throwerBack.basic) {
                // Fallback: usa os componentes separados se a animação não estiver disponível
                this.ctx.globalAlpha = 0.5; // 50% de opacidade (semi-transparente)
                
                // Desenha as 3 camadas na ordem correta
                if (tower.throwerBack.basic) {
                    this.ctx.drawImage(tower.throwerBack.basic, drawX, drawY, CONFIG.CELL_SIZE, CONFIG.CELL_SIZE);
                }
                if (tower.base.basic) {
                    this.ctx.drawImage(tower.base.basic, drawX, drawY, CONFIG.CELL_SIZE, CONFIG.CELL_SIZE);
                }
                if (tower.throwerFront.basic) {
                    this.ctx.drawImage(tower.throwerFront.basic, drawX, drawY, CONFIG.CELL_SIZE, CONFIG.CELL_SIZE);
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
    }

    /**
     * Loop principal do jogo
     */
    gameLoop() {
        // Pega o tempo atual em milissegundos (preciso para animações e cooldowns)
        const currentTime = performance.now();
        
        // Atualiza a lógica do jogo (movimento, colisões, etc.)
        this.update(currentTime);
        // Desenha tudo no canvas
        this.draw();

        // Agenda o próximo frame (cria um loop infinito de 60 FPS)
        // requestAnimationFrame é uma função do navegador que chama a função
        // no próximo frame de renderização (geralmente 60 vezes por segundo)
        requestAnimationFrame(() => this.gameLoop());
    }
    
    /**
     * Alterna o estado de pausa do jogo
     */
    togglePause() {
        this.paused = !this.paused;
        const btnPause = document.getElementById('btnPause');
        if (btnPause) {
            btnPause.textContent = this.paused ? 'Continuar' : 'Pausa';
        }
    }
    
    /**
     * Reinicia o jogo com as novas configurações
     */
    restart() {
        // Para o loop atual
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
        this.waveInProgress = false;
        this.wavePauseStart = 0;
        this.enemiesInWave = 0;
        this.enemiesSpawned = 0;
        this.selectedTowerPosition = null;
        
        // Atualiza o HUD
        this.updateHUD();
        
        // Reinicia o loop
        this.lastTime = performance.now();
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
        // Aguarda um pouco para garantir que as imagens começaram a carregar
        // Tenta várias vezes porque as imagens podem carregar em momentos diferentes
        let attempts = 0;
        const maxAttempts = 30; // Tenta por até 3 segundos (30 × 100ms)
        
        const tryDraw = () => {
            attempts++;
            // Verifica se as imagens já carregaram
            if (IMAGES.mainMenu || IMAGES.settings || IMAGES.buttons) {
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
            TOWER_COST: CONFIG.TOWER_COST,
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
        console.log('✓ Opções guardadas');
    }
    
    /**
     * Aplica as opções ao CONFIG
     */
    applyOptions() {
        // As opções já foram aplicadas no loadOptions()
        // Esta função existe para poder ser chamada manualmente se necessário
    }
    
    /**
     * Atualiza os valores nos inputs do menu de opções
     */
    updateOptionsUI() {
        // Atualiza cada input com o valor atual do CONFIG
        document.getElementById('optMaxWaves').value = CONFIG.MAX_WAVES;
        document.getElementById('optTowerCost').value = CONFIG.TOWER_COST;
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
        document.getElementById('optTowerCostValue').textContent = CONFIG.TOWER_COST;
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
        CONFIG.TOWER_COST = parseInt(document.getElementById('optTowerCost').value) || 50;
        CONFIG.ENEMY_REWARD = parseInt(document.getElementById('optEnemyReward').value) || 10;
        CONFIG.TOWER_RANGE = parseInt(document.getElementById('optTowerRange').value) || 100;
        CONFIG.TOWER_DAMAGE = parseInt(document.getElementById('optTowerDamage').value) || 25;
        CONFIG.TOWER_FIRE_RATE = parseInt(document.getElementById('optTowerFireRate').value) || 1000;
        CONFIG.STARTING_COINS = parseInt(document.getElementById('optStartingCoins').value) || 200;
        CONFIG.STARTING_VILLAGE_LIFE = parseInt(document.getElementById('optStartingLife').value) || 100;
        CONFIG.ENEMY_SPEED = parseFloat(document.getElementById('optEnemySpeed').value) || 0.5;
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
            this.showMainMenu();
        });
        
        // Botão Guardar - salva opções e volta ao menu
        document.getElementById('btnSaveOptions').addEventListener('click', () => {
            this.readOptionsFromUI();
            this.saveOptions();
            this.showMainMenu();
            alert('Opções guardadas!');
        });
        
        // Botão Voltar do jogo (no HUD) - volta ao menu principal
        document.getElementById('btnBackToMainMenu').addEventListener('click', () => {
            if (window.gameInstance) {
                window.gameInstance.gameOver = true; // Para o jogo
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

