---
project: my-mouse
locale: pt
title: "my_mouse: solucionador de labirintos"
summary: "Projeto acadêmico colaborativo em andamento que lê um labirinto de um arquivo e busca uma rota entre a entrada e a saída."
technicalOverview: |
  O programa em C recebe o caminho de um arquivo `.map`. Seu cabeçalho informa as dimensões do labirinto e os caracteres usados para obstáculos, espaços livres, início, fim e trajeto. O código lê a grade, verifica a presença de um início e um fim e então procura uma rota. Quando encontra o destino, marca o caminho na grade e imprime o resultado.
architecture: |
  A implementação separa leitura e validação do mapa, busca do caminho, apresentação do resultado e liberação de memória em arquivos C distintos. A busca guarda coordenadas em uma fila encadeada; cada item mantém uma referência ao item anterior para permitir a reconstrução do trajeto ao chegar ao destino.
algorithm:
  explanation: |
    A busca em largura (BFS) parte da posição inicial e examina as quatro casas adjacentes, sem movimentos diagonais. Antes de adicionar uma casa à fila, o código verifica se ela está dentro do mapa, não é um obstáculo e ainda não foi registrada. Ao encontrar o fim, segue os ponteiros para os itens anteriores e marca as casas intermediárias do caminho.

    Em uma grade válida na qual cada movimento tem o mesmo custo, a exploração em largura encontra um caminho com o menor número de movimentos entre início e fim, caso exista.
  complexity:
    explanation: |
      `N` representa o número de casas do mapa. Embora uma BFS com marcação de visitados em tempo constante possa ser linear, **esta implementação** percorre a fila encadeada para verificar se uma coordenada já foi visitada e também para inserir no fim. Essas buscas lineares podem ocorrer para cada casa alcançada, resultando em tempo de pior caso `O(N²)`. O mapa e a fila ocupam `O(N)` de memória.
technicalDecisions:
  - "A implementação usa uma fila encadeada com referências aos predecessores para reunir a ordem da busca e os dados necessários à reconstrução do caminho."
  - "O formato de entrada é um arquivo `.map`, com dimensões e símbolos definidos no cabeçalho."
challenges:
  - "A validação do formato de entrada ainda não está concluída: há uma rotina de validação do cabeçalho comentada no código atual."
testing: |
  O repositório contém mapas de exemplo em `our_test_files/`, incluindo `bug_01.map` e `bug_02.map`, criados para reproduzir cenários de bug. Esses arquivos podem ser usados em execuções manuais com `make` e `./my_mouse arquivo.map`. Não há uma suíte de testes automatizados no estado do repositório inspecionado.
demoExplanation: |
  A demonstração no navegador está planejada para uma etapa futura. Por enquanto, esta página apresenta o projeto e o algoritmo sem executar o programa; o repositório original permanece privado.
---

`my_mouse` é um projeto acadêmico em desenvolvimento realizado em colaboração por Igor Castro de Gissi e Vladislav Doynov. A versão atual lê um mapa de arquivo, usa busca em largura para procurar uma rota e, quando encontra a saída, imprime o labirinto com o trajeto marcado. O código e os mapas de exemplo mostram o funcionamento atual; a validação do cabeçalho está incompleta e a demonstração interativa ainda não existe.
