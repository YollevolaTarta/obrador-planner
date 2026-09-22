# Obrador Flow

PROMPT LOVABLE — DASHBOARD OBRADOR MVP

Yo Llevo la Tarta

CONTEXTO DEL NEGOCIO

"Yo Llevo la Tarta" es una tienda de postres personalizados en formato pequeño. Producción centralizada en obrador: un operario trabaja 1 jornada semanal de 7h y produce todo lo necesario para la semana. Sin conservantes: se congela en porciones, se descongela en nevera la noche anterior a la venta. Los productos se elaboran por capas: crumble (base) + crema + topping opcional + extra visual.

QUÉ ES ESTE DASHBOARD

Una pantalla interna para el encargado del obrador. No es una app de cliente ni un TPV. Es una herramienta de gestión de producción y stock. El encargado tiene que poder ver en menos de 1 minuto todo lo que necesita saber para organizar la semana.

Lo que tiene que ver de un vistazo:

Qué se vendió la semana pasada (unidades por producto)

Qué hay que producir esta semana (basado en ventas de los últimos 7 días)

Qué ingredientes hacen falta para producirlo (calculado automáticamente según recetas)

Qué hay en stock de materias primas (lo introduce el operario manualmente al llegar compras)

Qué hay en stock de producto terminado (lo introduce el operario al terminar cada elaboración, tras pesar)

Qué hace falta comprar esta semana (diferencia entre lo necesario y el stock actual)

Tendencia de ventas por producto en las últimas 4 semanas (subiendo / estable / bajando)

Control de desviación de receta: si se está gastando más materia prima de la que corresponde según receta

Inputs manuales del operario (solo dos):

Entrada de materias primas cuando llegan las compras

Peso de producto terminado al acabar cada elaboración

El sistema calcula el resto solo: producción necesaria, ingredientes requeridos, qué comprar, desviación.

FORMATOS DE VENTA Y GRAMAJES

Formato Peso total aprox. Crumble Crema Topping Tarta abierta pequeña 160g 20g 100g 30g Tarta en lata pequeña 180g 40g 100g 30g Cake shake 250ml — — 100g crema + 22,5g topping 1 + 22,5g topping 2 + 60g leche/bebida vegetal + 30g hielo frappé —

Nota cake shake: si el cliente elige matcha, se añaden 2g de matcha al shake. No lleva crumble.

RECETAS DEL OBRADOR

Estas recetas son la fuente de verdad para calcular ingredientes. El sistema las usa para saber cuánta materia prima hace falta en función de las unidades a producir. Todas las proporciones son en peso (%).

CRUMBLE

Ingrediente % Galleta 65% Mantequilla 35%

CREMAS

Crema vainilla

Ingrediente % Leche entera 76% Yemas 12% Azúcar 2% Maizena 7% Vainilla en polvo 3%

Crema lemon curd

Ingrediente % Leche entera 76% Yemas 12% Azúcar 2% Maizena 7% Limón liofilizado 3%

Crema coulant chocolate

Ingrediente % Leche entera 70% Yemas 10% Azúcar 1% Maizena 6% Chocolate para fundir 13%

Crema basque cheesecake

Ingrediente % Leche entera 70% Yemas 10% Azúcar 1% Maizena 6% Gorgonzola 13%

Crema NY cheesecake

Ingrediente % Queso crema 40% Nata 40% Azúcar 20%

TOPPINGS

Mermeladas (todos los sabores, misma receta)

Ingrediente % Fruta 65% Azúcar 35%

Cremas de frutos secos — nuez, almendra, avellana, pecana (todos los sabores, misma receta)

Ingrediente % Fruto seco 70% Aceite de girasol 20% Azúcar 10%

Crema de pistacho (receta propia, diferente a las anteriores)

Ingrediente % Pistacho 50% Anacardo 20% Aceite de girasol 20% Azúcar 10%

Ganache de frutas (5 sabores de fruta liofilizada disponibles, misma receta base)

Ingrediente % Nata 60% Leche entera 30% Chocolate blanco 5% Fruta liofilizada 3% Azúcar glas 2%

Ganache de café

Ingrediente % Nata 85% Chocolate blanco 10% Café soluble 3% Azúcar glas 2%

Ganache de matcha

Ingrediente % Nata 85% Chocolate blanco 10% Matcha 3% Azúcar glas 2%

LISTA COMPLETA DE MATERIAS PRIMAS

Todas las materias primas que aparecen en las recetas anteriores. El sistema debe gestionar stock de todas ellas:

Leche entera

Nata

Yemas

Queso crema

Gorgonzola

Azúcar

Azúcar glas

Maizena

Galleta

Mantequilla

Chocolate para fundir

Chocolate blanco

Vainilla en polvo

Limón liofilizado

Fruta liofilizada (genérica para el MVP — 5 sabores en producción real)

Fruta fresca (genérica para el MVP — para mermeladas)

Fruto seco genérico (para el MVP — nuez, almendra, avellana, pecana usan la misma receta)

Pistacho

Anacardo

Aceite de girasol

Café soluble

Matcha

Leche/bebida vegetal (para cake shake)

ESTRUCTURA DEL DASHBOARD MVP

PANTALLA PRINCIPAL — 5 SECCIONES VISUALES (una sola pantalla, scroll vertical)

SECCIÓN 1 — VENTAS SEMANA PASADA

Tabla: producto | formato | unidades vendidas

Ordenado de más a menos vendido

Barra horizontal proporcional para lectura rápida

SECCIÓN 2 — PRODUCCIÓN ESTA SEMANA

Calculado automáticamente desde ventas de los últimos 7 días

Tabla: qué producir | cuántas unidades

Nota visible: "Basado en ventas de los últimos 7 días"

SECCIÓN 3 — INGREDIENTES NECESARIOS

Calculado automáticamente: unidades a producir × receta × gramaje por formato

Tabla: ingrediente | cantidad necesaria (en kg o g)

Agrupado por categoría: lácteos / secos y harinas / chocolates y saborizantes / otros

SECCIÓN 4 — STOCK Y COMPRAS

4A — Stock actual (editable por el operario)

Tabla: ingrediente | cantidad en stock | última actualización

Botón por línea: "+ Registrar entrada" para materias primas

Sección separada para producto terminado: crema | kg disponibles | botón "+ Registrar producción"

4B — Qué comprar esta semana (calculado automáticamente)

Ingrediente | necesario | en stock | diferencia

Verde si hay suficiente. Rojo + cantidad si falta.

Esta lista es informativa. El encargado decide.

SECCIÓN 5 — TENDENCIA Y CONTROL

5A — Tendencia últimas 4 semanas

Por crema y formato: flecha ↑ subiendo | → estable | ↓ bajando

Mini gráfico de línea o indicador visual simple

5B — Control de desviación de receta

Teórico (receta × unidades producidas) vs real (stock anterior − stock actual)

Verde < 5% | Amarillo 5-15% | Rojo > 15%

Por ingrediente principal

DATOS DE PRUEBA

Carga estos datos ficticios para que el dashboard se vea funcional desde el primer momento.

Ventas semana pasada

Producto Formato Unidades Vainilla Tarta abierta pequeña 87 Coulant chocolate Tarta abierta pequeña 74 Lemon curd Tarta abierta pequeña 63 NY cheesecake Tarta abierta pequeña 58 Basque cheesecake Tarta abierta pequeña 41 Vainilla Tarta en lata pequeña 34 Coulant chocolate Tarta en lata pequeña 28 Vainilla Cake shake 31 Coulant chocolate Cake shake 27 Matcha Cake shake 19

Tendencia 4 semanas (datos ficticios para mostrar el gráfico)

Producto Sem -4 Sem -3 Sem -2 Sem -1 Vainilla 70 75 81 87 Coulant chocolate 80 78 74 74 Lemon curd 55 58 61 63 NY cheesecake 62 60 59 58 Basque cheesecake 30 34 38 41

Stock materias primas (datos ficticios)

Ingrediente Stock actual Leche entera 12 kg Nata 8 kg Yemas 1,2 kg Queso crema 3 kg Gorgonzola 1 kg Azúcar 4 kg Azúcar glas 0,5 kg Maizena 0,8 kg Galleta 6 kg Mantequilla 3 kg Chocolate para fundir 2 kg Chocolate blanco 1,5 kg Vainilla en polvo 0,2 kg Limón liofilizado 0,15 kg Fruta liofilizada 0,3 kg Fruta fresca 2 kg Fruto seco genérico 3 kg Pistacho 0,8 kg Anacardo 0,5 kg Aceite de girasol 1 L Café soluble 0,2 kg Matcha 0,3 kg Leche/bebida vegetal 3 L

Stock producto terminado (datos ficticios)

Crema Stock (kg) Crema vainilla 3,5 kg Crema coulant chocolate 2,8 kg Crema lemon curd 2,1 kg Crema NY cheesecake 2,3 kg Crema basque cheesecake 1,4 kg Crumble 4,2 kg

VISUAL Y ESTILO

Colores de marca: rosa #F4A7B9, rojo #E8341C

Fondo oscuro (casi negro) con texto blanco — legible en cocina con luz artificial

Tarjetas con bordes ligeramente redondeados

Rojo #E8341C para alertas y cifras negativas

Rosa #F4A7B9 para cabeceras de sección y destacados

Verde #4CAF50 para estados OK

Amarillo #FFC107 para estados de revisión

Tipografía sans-serif, limpia y grande — el operario lo lee mientras trabaja

Sin animaciones complejas — es una herramienta de trabajo

Logo: texto "Yo Llevo la Tarta" en cabecera, pequeño

DISEÑO PARA TABLET HORIZONTAL

Pantalla principal pensada para tablet horizontal fija en el obrador

Legible también en móvil

Cero fricción: el operario toca lo mínimo (solo las dos entradas manuales de stock)

Sin login para el MVP

LO QUE NO ES ESTE MVP

No tiene login ni gestión de usuarios

No se conecta a ningún sistema externo ni TPV

No genera pedidos automáticos a proveedores

No gestiona toppings en detalle (solo materias primas para producción)

No procesa pagos

No tiene multi-tienda

Los datos se guardan en local (localStorage) para el MVP.

RESUMEN: LO QUE TIENE QUE FUNCIONAR

Ver ventas semana pasada con datos de prueba cargados

Ver producción calculada automáticamente desde esas ventas

Ver ingredientes necesarios calculados desde las recetas y gramajes

Introducir stock manualmente (materias primas + producto terminado)

Ver qué hace falta comprar calculado automáticamente

Ver tendencia de las últimas 4 semanas con mini gráfico

Ver control de desviación de receta con semáforo de colores

Todo en una sola pantalla, sin navegación compleja.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f52bfaf3-4004-4429-ae25-ab3503769472).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
