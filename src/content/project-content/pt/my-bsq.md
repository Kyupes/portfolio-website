---
project: my-bsq
locale: pt
title: "my_bsq: maior quadrado em um mapa"
summary: "Projeto acadêmico colaborativo em C que identifica o maior quadrado livre de obstáculos em um mapa e marca essa região no resultado."
technicalOverview: |
  O mapa possui dimensões N × N. Cada posição contém . para espaço livre ou o para obstáculo. Durante a busca, o programa percorre a grade e calcula, para cada posição livre, o tamanho do maior quadrado que pode terminar naquela célula.
  Ao terminar a análise, as coordenadas e o tamanho do maior quadrado encontrado são usados para substituir suas células por x no mapa de saída.
architecture: |
  A aplicação de linha de comando lê o mapa de um arquivo e imprime as linhas com o quadrado marcado. A adaptação para navegador recebe o mesmo mapa em memória por uma interface C compilada para WebAssembly e devolve o cabeçalho, as linhas pintadas e o tamanho do quadrado. A página gera a entrada e exibe a saída; a busca pelo maior quadrado continua no código C.
algorithm:
  explanation: |
    Para uma posição livre que não está na primeira linha ou coluna, o tamanho do quadrado terminado naquela posição é calculado a partir do menor valor entre três posições já processadas: acima, à esquerda e na diagonal superior esquerda. O resultado é esse menor valor mais um.
    A implementação mantém somente a linha atual e a linha anterior dessa tabela de programação dinâmica. Dessa forma, não é necessário armazenar uma matriz auxiliar completa.
    Quando existem vários quadrados com o mesmo tamanho máximo, a implementação mantém o primeiro encontrado durante a varredura em ordem de linhas.
  complexity:
    explanation: |
      Para um mapa N × N, o algoritmo visita cada uma das N² posições uma vez, resultando em tempo O(N²).
      A estrutura auxiliar de programação dinâmica mantém duas linhas com N valores cada, portanto utiliza O(N) de memória adicional.
testing: |
  A adaptação verifica exemplos de entrada e saída da aplicação de linha de comando, exercita a interface C com casos válidos e inválidos e confere o módulo WebAssembly gerado. A interface retorna tamanho 0 como resultado válido quando não há células livres.
demoExplanation: |
  Escolha um tamanho entre 5 e 50, gere um mapa quadrado e selecione “Encontrar maior quadrado”. A página mostra primeiro a entrada sem marcações; depois, o programa em C executado via WebAssembly devolve o mapa com o quadrado pintado e seu tamanho. Esses limites de tamanho pertencem apenas à demonstração.
---

`my_bsq` é um projeto acadêmico desenvolvido em colaboração por Igor Castro de Gissi e Vladislav Doynov. O programa recebe um mapa quadrado contendo espaços livres e obstáculos, procura a maior região quadrada formada somente por espaços livres e imprime o mapa com essa região marcada.

A implementação utiliza programação dinâmica para evitar testar cada quadrado possível separadamente. O projeto original funciona como uma aplicação de linha de comando que recebe o mapa por arquivo.
