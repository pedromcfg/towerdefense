# Guia: Como Descobrir Coordenadas de Sprites

## Método 1: Usando Ferramentas Online (Mais Fácil)

### Opção A: Sprite Sheet Cutter
1. Acesse: https://www.leshylabs.com/apps/sstool/
2. Faça upload da sua imagem (ex: `Buttons.png`)
3. A ferramenta detecta automaticamente os sprites
4. Clique em cada sprite para ver as coordenadas (x, y, width, height)

### Opção B: Sprite Sheet Parser
1. Acesse: https://www.codeandweb.com/free-sprite-sheet-packer
2. Ou use: https://ezgif.com/sprite-cutter
3. Faça upload e veja as coordenadas de cada frame

## Método 2: Usando Editores de Imagem

### GIMP (Gratuito)
1. Abra a imagem no GIMP
2. Use a ferramenta de seleção retangular (R)
3. Selecione um sprite
4. Veja as coordenadas na barra de status:
   - X, Y = posição do canto superior esquerdo
   - W, H = largura e altura

### Photoshop
1. Abra a imagem no Photoshop
2. Use a ferramenta de seleção retangular (M)
3. Selecione um sprite
4. Veja as coordenadas no painel "Info" (F8)

### Paint.NET (Gratuito)
1. Abra a imagem no Paint.NET
2. Use a ferramenta de seleção retangular
3. Selecione um sprite
4. Veja as coordenadas na barra de status inferior

## Método 3: Usando JavaScript no Navegador

### Console do Navegador
```javascript
// 1. Carregue a imagem no navegador
const img = new Image();
img.src = 'assets/GUI/PNG/Buttons.png';
img.onload = () => {
    console.log('Tamanho da imagem:', img.width, 'x', img.height);
    
    // 2. Crie um canvas para visualizar
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    // 3. Adicione um listener de clique para ver coordenadas
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor(e.clientX - rect.left);
        const y = Math.floor(e.clientY - rect.top);
        console.log(`Clique em: x=${x}, y=${y}`);
    });
    
    document.body.appendChild(canvas);
};
```

## Método 4: Análise Visual Manual

1. **Abra a imagem** em qualquer visualizador
2. **Conte os pixels** manualmente (não recomendado, mas funciona)
3. **Use uma régua de pixels** se disponível no editor

## Exemplo de Mapeamento

Depois de descobrir as coordenadas, atualize o objeto `GUI_SPRITE_MAP` no `game.js`:

```javascript
const GUI_SPRITE_MAP = {
    buttons: {
        normal: { x: 0, y: 0, width: 200, height: 60 },
        hover: { x: 0, y: 60, width: 200, height: 60 },
        pressed: { x: 0, y: 120, width: 200, height: 60 },
    },
    icons: {
        coin: { x: 0, y: 0, width: 32, height: 32 },
        heart: { x: 32, y: 0, width: 32, height: 32 },
    }
};
```

## Dicas

- **Sprites organizados em grid**: Se os sprites estão alinhados, você pode calcular:
  - `x = coluna × largura_do_sprite`
  - `y = linha × altura_do_sprite`

- **Sprites irregulares**: Use as ferramentas acima para medir cada um individualmente

- **Teste visual**: Depois de definir as coordenadas, teste no jogo para verificar se está correto

