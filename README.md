# CodeLab_Stock: sistema de gestión de stock

![Static Badge](https://img.shields.io/github/last-commit/ISPC-WEB-2025/CodeLab?label=Último%20cambio&color=blue)

## 1. Descripción del proyecto

Este proyecto consiste en el desarrollo de una **plataforma web integral** diseñada para la administración y control de inventarios en tiempo real. La idea es que el sistema permita a las empresas gestionar sus productos, proveedores y movimientos de mercadería de manera ágil y centralizada.

Muchas pequeñas y medianas empresas aún dependen de procesos manuales o planillas de cálculo propensas a errores para controlar sus activos. Esto deriva en diversos problemas como:

- _Falta de visibilidad_, es decir, no saber con certeza cuánta mercadería hay disponible.

- _Pérdida de ventas_, debido a la ausencia de alertas tempranas en las bajas de stock.

- _Desperdicio de capital_ por exceso de productos estacionales o de baja rotación acumulados en depósito.

- _Desorganización_ y dificultad para rastrear entradas y salidas de distintas sucursales o depósitos.

Nuestra solución se diferencia por las siguientes características:

- **Modular y adaptable**: su estructura permite configurar categorías y atributos de productos según el rubro de la empresa (desde una ferretería hasta una tienda de ropa).

- **Escalable**: gracias al uso de una API REST sólida, el sistema puede crecer en funciones sin comprometer el rendimiento.

- **Accesibilidad total**: al ser una aplicación web, los dueños de negocio pueden monitorear su stock desde cualquier dispositivo con acceso a internet.

- **Interfaz intuitiva**: diseñada con foco en la experiencia de usuario (UX) para reducir la curva de aprendizaje del personal.

## 2. Instrucciones de instalación

### Prerrequisitos

Antes de comenzar, asegurate de tener instalado:

- **Git** → [git-scm.com](https://git-scm.com)
- **Node.js** (v18 o superior, incluye npm) → [nodejs.org](https://nodejs.org)
- **Python** (v3.10 o superior) → [python.org](https://python.org)
- **MySQL** → [mysql.com](https://mysql.com)

---

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_PROYECTO>
```

---

### 2. Frontend (Angular)

**a.** Instalar Angular CLI globalmente (si no está instalado):

```bash
npm install -g @angular/cli
```

**b.** Verificar la instalación:

```bash
ng version
```

**c.** _(Solo Windows)_ Permitir ejecución de scripts en PowerShell:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

**d.** Navegar a la carpeta del proyecto frontend:

```bash
cd Frontend/app-stock
```

**e.** Instalar dependencias:

```bash
npm install
```

**f.** Iniciar el servidor de desarrollo:

```bash
ng serve
```

> [!NOTE]
> Al ejecutar `npm install` pueden aparecer advertencias de dependencias deprecadas. Estas corresponden a dependencias internas de Angular v19 y no afectan el funcionamiento de la aplicación. **No ejecutar** `npm audit fix --force` ya que puede romper la compatibilidad del proyecto.

---

### 3. Backend (Django)

**a.** Crear y activar el entorno virtual:

```bash
# Crear
python -m venv venv

# Activar en Linux/Mac
source venv/bin/activate

# Activar en Windows
venv\Scripts\activate
```

**b.** Instalar dependencias:

```bash
pip install -r requirements.txt
```

**c.** Crear la base de datos en MySQL:

```sql
CREATE DATABASE nombre_db;
```

**d.** Crear el archivo de variables de entorno copiando el modelo:

```bash
cp .env_modelo .env
```

**e.** Completar `.env` con tus credenciales de MySQL.

**f.** Ejecutar migraciones:

```bash
python manage.py migrate
```

**g.** Iniciar el servidor:

```bash
python manage.py runserver
```

---

## 3. Uso básico

- Backend corre en <http://127.0.0.1:8000/>
- Api disponible en <http://127.0.0.1:8000/api/>
- Frontend corre en <http://localhost:4200/>

- Vista previa de la página: [CodeLab](https://ispc-web-2025.github.io/CodeLab/)

## 4. Lista de requerimientos

- **Requerimientos Funcionales (RF)**

| ID      | Descripción                                                                                                                                                                      | Prioridad | Actor                    |
| :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------: | :----------------------- |
| **RF1** | **Registro de productos:** El sistema debe permitir dar de alta productos ingresando: nombre, descripción, precio, código y stock inicial.                                       |   Must    | Administrador            |
| **RF2** | **Gestión de productos:** El sistema debe permitir crear, editar y eliminar productos del catálogo.                                                                              |   Must    | Administrador / Vendedor |
| **RF3** | **Gestión de proveedores:** El sistema debe permitir registrar, editar y eliminar proveedores, asociándolos a los productos correspondientes.                                    |   Must    | Administrador            |
| **RF4** | **Registro de movimientos:** El sistema debe registrar cada entrada y salida de mercadería, indicando fecha, cantidad, producto y usuario responsable.                           |   Must    | Vendedor                 |
| **RF5** | **Gestión de inventario:** El sistema debe permitir actualizar el stock de un producto existente, registrando tanto entradas como salidas de mercadería.                         |   Must    | Vendedor                 |
| **RF6** | **Baja de productos:** El sistema debe permitir eliminar un producto del catálogo.                                                                                               |   Must    | Administrador            |
| **RF7** | **Alertas de stock mínimo:** El sistema debe notificar al usuario cuando el stock de un producto caiga por debajo de un umbral mínimo configurable.                              |  Should   | Sistema                  |
| **RF8** | **Autenticación de usuarios:** El sistema debe contar con un módulo de inicio de sesión que permitirá el acceso únicamente a usuarios registrados mediante usuario y contraseña. |   Must    | Administrador            |

- **Requerimientos No Funcionales (RNF)**

| ID       | Categoría         | Descripción                                                                                                                                                                                                                                                     |
| :------- | :---------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **RNF1** | **Seguridad**     | El sistema no debe exponer credenciales de base de datos, tokens de API ni datos de usuarios en respuestas, logs públicos o código del cliente.                                                                                                                 |
| **RNF2** | **Rendimiento**   | Los datos modificados en el inventario deben ser visibles para todos los usuarios en un tiempo de respuesta menor a 2 segundos, medido bajo condiciones normales de operación con hasta 50 usuarios concurrentes y carga de red estable.                        |
| **RNF3** | **Usabilidad**    | La interfaz debe adaptarse correctamente a dispositivos móviles, tablets y escritorio, garantizando que todos los elementos sean legibles e interactuables sin desplazamiento horizontal. Compatible con Chrome ≥ 110, Firefox ≥ 110, Safari ≥ 16 y Edge ≥ 110. |
| **RNF4** | **Accesibilidad** | La plataforma debe ser accesible para usuarios con discapacidades visuales, motoras o cognitivas.                                                                                                                                                               |

## 5. Tecnologías utilizadas

- **Frontend:** Angular
- **Backend:** Python y Django Rest Framework
- **Base de Datos:** MySQL
- **Estilos:** CSS3 y Bootstrap
