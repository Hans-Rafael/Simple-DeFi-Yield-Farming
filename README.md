# TokenFarm Project

## Descripción

TokenFarm es una aplicación descentralizada (DApp) que permite a los usuarios:
- Stakear tokens de proveedor de liquidez (LP Tokens) para ganar recompensas en forma de DAppTokens.
- Reclamar recompensas acumuladas.
- Retirar los tokens stakeados.

Incluye un sistema de distribución de recompensas que considera la cantidad de tokens stakeados y el tiempo de staking. Además, se implementa un mecanismo de tarifas en la reclamación de recompensas, las cuales son enviadas al propietario del contrato.

## Características Principales

- **Staking de LP Tokens:** Los usuarios pueden depositar LP tokens para participar en el sistema de recompensas.
- **Distribución de Recompensas:** Recompensas calculadas según el tiempo y el balance stakeado.
- **Reclamo de Recompensas:** Los usuarios pueden reclamar sus recompensas acumuladas.
- **Retiro Completo:** Los usuarios pueden retirar tanto los tokens stakeados como las recompensas pendientes.
- **Tarifa de Reclamo:** Se cobra una tarifa al reclamar las recompensas, destinada al propietario del contrato.

## Contratos Implementados

### 1. DAppToken
Un token ERC20 usado como recompensa en el sistema. 

- Permite al propietario (`owner`) acuñar nuevos tokens.
- La propiedad se transfiere al contrato `TokenFarm` al desplegar el sistema.

### 2. LPToken
Un token ERC20 simulado para representar los tokens de proveedor de liquidez que los usuarios stakean.

### 3. TokenFarm
El contrato principal que gestiona el staking, distribución de recompensas, y manejo de tarifas.

## Requisitos Previos

- Node.js y npm instalados.
- Hardhat para el desarrollo y pruebas de contratos inteligentes.
- Una red de pruebas local (usando Hardhat).

## Estructura del proyecto

- **`contracts/`**: Contiene los contratos Solidity.
- **`scripts/`**: Contiene los scripts para desplegar los contratos.
- **`hardhat.config.ts`**: Configuración de redes y compilación.

# Estructura del Proyecto: TokenFarm

├── contracts
│   ├── DAppToken.sol       # Token ERC20 usado para recompensas.
│   ├── LPToken.sol         # Token ERC20 usado para staking.
│   ├── TokenFarm.sol       # Contrato principal para staking y distribución de recompensas.
│
├── scripts
│   ├── deploy.ts           # Script para desplegar los contratos en la red.
│
├── test
│   ├── TokenFarm.test.ts   # Pruebas unitarias para el contrato TokenFarm.
│
├── hardhat.config.ts       # Configuración de Hardhat para redes, plugins y compilación.
├── package.json            # Archivo de configuración de dependencias del proyecto.
├── README.md               # Documentación del proyecto.


## Instalación

Clona el repositorio y ejecuta el siguiente comando para instalar las dependencias necesarias:

```bash
npm install
```

## Scripts Disponibles

### Compilar los Contratos

```bash
npx hardhat compile
```

### Ejecutar Tests

```bash
npx hardhat test
```

### Desplegar Contratos (red local)

```bash
npx hardhat run scripts/deploy.ts
```

## Descripción de Tests

Los tests se encuentran en la carpeta `test/` e incluyen los siguientes escenarios:

1. **Minting y Depósito:** Verifica que los usuarios puedan acuñar LP tokens y depositarlos en el contrato `TokenFarm`.
2. **Distribución de Recompensas:** Comprueba que las recompensas se calculen y distribuyan correctamente.
3. **Reclamo de Recompensas:** Asegura que los usuarios puedan reclamar sus recompensas correctamente.
4. **Retiro Completo:** Verifica que los usuarios puedan retirar tanto sus tokens stakeados como las recompensas pendientes.
5. **Cobro de Tarifas:** Confirma que se cobre una tarifa en las recompensas y que esta se transfiera al propietario del contrato.

## Configuración Adicional

### Transferencia de Propiedad

En el script de despliegue, asegúrate de transferir la propiedad de `DAppToken` al contrato `TokenFarm` para permitir la correcta operación del sistema:

```typescript
await dappToken.transferOwnership(await tokenFarm.getAddress());
```

### Simulación de Tiempo

Los tests utilizan los siguientes comandos para manipular el tiempo y simular el paso de bloques:

```typescript
await ethers.provider.send("evm_increaseTime", [100]); // Incrementa el tiempo en 100 segundos
await ethers.provider.send("evm_mine", []); // Mina un nuevo bloque
```

## Dependencias

- [OpenZeppelin](https://openzeppelin.com/contracts/) (para contratos ERC20 estándar).
- [Hardhat](https://hardhat.org/) (entorno de desarrollo y pruebas).
- [Ethers.js](https://docs.ethers.io/) (interacción con contratos inteligentes).

## Licencia

Este proyecto está bajo la Licencia MIT. Puedes consultarla en el archivo `LICENSE`.

---

¡Gracias por usar **TokenFarm**! Si tienes alguna pregunta o sugerencia, no dudes en crear un *issue* en el repositorio.


Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```
