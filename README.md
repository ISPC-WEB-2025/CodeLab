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

* **Python 3.8**
* **MySQL**
* **Git**

1. Clonar el repositorio de GitHub: `git clone ...`

2. Instala dependencias de frontend:

   a. Instalar Angular Cli utilizando el siguiente comando: `npm install -g @angular/cli`
   b. Para evaluar que la instalación haya sido exitosa, utilizar el siguiente comando: `ng version`
   c. En caso de estar usando Windows, hay que permitir la ejecución de scripts explícitamente. Para eso, introducir lo siguiente: `Set.ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`
  
3. Instala dependencias de backend:

   a. Crea y activa el entorno virtual. Puedes hacerlo directamente sobre el directorio de tu repositorio local.  
   b. En terminal: `pip install -r requirements.txt`
   c. Crea la base de datos en MySQL: `nombre_db`
   d. Crea archivo `.env` y copia el contenido de `.env_modelo` a este archivo.
   e. Completalo con tus datos para conectarte con tu servidor MySQL.   
   f. En terminal: `python manage.py migrate`
   g. En terminal: `python manage.py runserver`

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
