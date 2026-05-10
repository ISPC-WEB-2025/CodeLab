# CodeLab_Stock: sistema de gestión de stock

![Static Badge](https://img.shields.io/github/last-commit/ISPC-WEB-2025/CodeLab?label=Último%20cambio&color=blue)

## 1. Descripción del proyecto

Este proyecto consiste en el desarrollo de una **plataforma web integral** diseñada para la administración y control de inventarios en tiempo real. La idea es que el sistema permita a las empresas gestionar sus productos, proveedores y movimientos de mercadería de manera ágil y centralizada.
  
Muchas pequeñas y medianas empresas aún dependen de procesos manuales o planillas de cálculo propensas a errores para controlar sus activos. Esto deriva en diversos problemas como:

* *Falta de visibilidad*, es decir, no saber con certeza cuánta mercadería hay disponible.

* *Pérdida de ventas*, debido a la ausencia de alertas tempranas en las bajas de stock.

* *Desperdicio de capital* por exceso de productos estacionales o de baja rotación acumulados en depósito.

* *Desorganización* y dificultad para rastrear entradas y salidas de distintas sucursales o depósitos.

Nuestra solución se diferencia por las siguientes características:

* **Modular y adaptable**: su estructura permite configurar categorías y atributos de productos según el rubro de la empresa (desde una ferretería hasta una tienda de ropa).

* **Escalable**: gracias al uso de una API REST sólida, el sistema puede crecer en funciones sin comprometer el rendimiento.

* **Accesibilidad total**: al ser una aplicación web, los dueños de negocio pueden monitorear su stock desde cualquier dispositivo con acceso a internet.

* **Interfaz intuitiva**: diseñada con foco en la experiencia de usuario (UX) para reducir la curva de aprendizaje del personal.

## 2. Instrucciones de instalación

### Prerrequisitos

Antes de comenzar, asegurate de tener instalado:

* **Git** → [git-scm.com](https://git-scm.com)
* **Node.js** (v18 o superior, incluye npm) → [nodejs.org](https://nodejs.org)
* **Python** (v3.10 o superior) → [python.org](https://python.org)
* **MySQL** → [mysql.com](https://mysql.com)

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

**c.** *(Solo Windows)* Permitir ejecución de scripts en PowerShell:

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
>>>>>>> Stashed changes

## 3. Uso básico

* Backend corre en <http://127.0.0.1:8000/>
* Api disponible en <http://http://127.0.0.1:8000/api/>
* Frontend corre en <http://localhost:4200/>

* Vista previa de la página: [CodeLab](https://ispc-web-2025.github.io/CodeLab/)

## 4. Lista de requerimientos
  
* **Requerimientos Funcionales (RF)**

     **RF1 - Registro de productos:** El sistema permitirá dar de alta productos ingresando obligatoriamente nombre, descripción, precio y stock inicial.

     **RF2 - Gestión centralizada:** El sistema permitirá a las empresas administrar de manera ágil y centralizada sus productos, la información de sus proveedores y el registro de movimientos de mercadería.

     **RF3 - Consulta y filtrado:** El usuario podrá visualizar el listado completo de productos y proveedores, con la capacidad de filtrar resultados por categoría para agilizar la búsqueda.

     **RF4 - Gestión de inventario:** El sistema permitirá actualizar el stock de un producto existente, registrando tanto entradas como salidas de mercadería.

     **RF5 - Baja de productos:** El usuario podrá eliminar productos del sistema, impactando directamente en la base de datos MySQL.
  
* **Requerimientos No Funcionales (RNF)**

    **RNF1 - Seguridad:**  El sistema no debe exponer información sensible (como usuarios o contraseñas de la DB) en el código fuente, utilizando archivos .env y brindando un .env_modelo para el despliegue seguro.

    **RNF2 - Rendimiento:** Los datos modificados en la base de datos deben ser actualizados y visibles para todos los usuarios que acceden al sistema en un tiempo de respuesta menor a 2 segundos.

    **RNF3 - Diseño responsivo:** La interfaz del sistema, desarrollada con Angular y Bootstrap, debe ser completamente responsiva, garantizando una visualización y usabilidad óptima en dispositivos móviles, tablets y computadoras de escritorio.

## 5. Tecnologías utilizadas

* **Frontend:** Angular
* **Backend:** Python y Django Rest Framework
* **Base de Datos:** MySQL
* **Estilos:** CSS3 y Bootstrap
