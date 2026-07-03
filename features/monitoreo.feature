# language: es
Característica: Visualización del Dashboard del Operador en Tiempo Real

  Escenario: El operador visualiza un estado crítico en un sensor específico
    Dado que el usuario se encuentra en el "Dashboard — Monitoreo en Tiempo Real"
    Cuando hace clic en el nodo "P-03" dentro del mapa de puntos de monitoreo
    Entonces el sistema debe actualizar la tarjeta de "Turbidez" mostrando un valor de "9.4 NTU"
    Y el estado del parámetro debe cambiar visualmente a una etiqueta de "Alerta" color rojo
