# Tema P2-18: Transformação Interativa de Cúbicas de Bézier Controladas por Cúbicas de Bézier

## Descrição
O usuário entra via mouse com 4 poligonais de cúbicas de Bézier. O usuário pode reposicionar os pontos de controle arbitrariamente. O sistema desenha em tempo real as curvas correspondentes.  Depois que as 4 curvas estão configuradas da forma desejada, então um “slide button” será disponibilizado representando o parâmetro que irá controlar a interpolação das curvas. As curvas entradas pelo usuário funcionam como pontos de controle. Ou seja, para encontrar a curva correspondente ao parâmetro determinado pelo slide button, o sistema utiliza os correspondentes pontos de controle das 4 curvas e produz uma avaliação de De Casteljau para carreira de pontos correspondentes; estas avaliações serão os pontos de controle da curva procurada. Por exemplo, utiliza-se o primeiro ponto de controle de cada curva (são 4 pontos então, que serão os pontos de controle da carreira) e avalia-se com o parâmetro induzido pelo slide button, depois se utiliza o segundo ponto de controle de cada curva, e avalia-se do mesmo jeito, e assim por diante, até se obterem os quatros pontos avaliados, que serão os pontos de controle  da curva procurada.
O usuário pode modificar o posicionamento dos pontos, deletar e inserir carreiras de pontos, mas o slide button só será disponibilizado quando o conjunto de pontos de controle for numericamente suficiente para o objetivo do projeto. O usuário poderá suprimir os pontos de controle, a poligonal de controle, e os pontos das curvas. O usuário também poderá determinar o número de avaliações que deverá ser usado para então o sistema calcular os correspondentes pontos da curva e ligá-los por retas. As avaliações deverão ser feitas obrigatoriamente com o Algoritmo de de Casteljau.  

### Curso
Universidade Federal de Pernambuco\n
Centro de Informática\n
Gradução em Ciência da Computação\n
Programação Gráfica\n

### Autores
- Douglas Soares Lins | dsl@cin.ufpe.br
- Luiz Henrique Tavares Caúla | lhtc@cin.ufpe.br
