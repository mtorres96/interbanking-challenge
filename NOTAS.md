#  Notas complementarias y detalles extra sobre el desafío

Este documento detalla decisiones y extras agregados más allá de los requerimientos del desafío técnico.

---

##  Requerimientos cumplidos

- [x] API REST desarrollada con NestJS
- [x] Arquitectura hexagonal (Domain → Application → Infrastructure)
- [x] Funcionalidades:
  - Alta de empresas
  - Consulta de empresas con transferencias
  - Consulta de empresas recientemente adheridas
- [x] Función Lambda implementada con lógica de alta de empresa
- [x] Código entregado sin necesidad de despliegue

---

## Temas extras abordados

### Documentación Swagger

- Agregada para facilitar pruebas manuales y visualización de la API.
- Incluye validaciones, ejemplos de request y response.

### README detallado

- Descripción completa del proyecto.
- Instrucciones para correr localmente y probar.
- Ejemplos de uso con `curl`.

### Tests

- Tests unitarios de los casos de uso y repositorios.
- Cobertura total de validaciones funcionales.


### Lambda ejecutable localmente (offline)

- Aunque no se requería ejecución, se configuró `serverless` con `serverless-offline` para simular localmente la función.
- Endpoint simulado: `POST /companies` con la misma lógica que el endpoint REST.
