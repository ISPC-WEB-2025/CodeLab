# CodeLab_Stock: sistema de gestión de stock

## 1. Descripción del proyecto

Este proyecto consiste en el desarrollo de una **plataforma web integral** diseñada para la administración y control de inventarios en tiempo real. La idea es que el sistema permita a las empresas gestionar sus productos, proveedores y movimientos de mercadería de manera ágil y centralizada.
  
Muchas pequeñas y medianas empresas aún dependen de procesos manuales o planillas de cálculo propensas a errores para controlar sus activos. Esto deriva en diversos problemas como:

  * *Falta de visibilidad*, es decir, no saber con certeza cuánta mercadería hay disponible.

  * *Pérdida de ventas*, debido a la ausencia de alertas tempranas en las bajas de stock.

  * *Desperdicio de capital* por exceso de productos estacionales o de baja rotación acumulados en depósito.

  * *Desorganización* y dificultad para rastrear entradas y salidas de distintas sucursales o depósitos.

Nuestra solución se diferencia por las siguientes características:

- **Modular y adaptable**: su estructura permite configurar categorías y atributos de productos según el rubro de la empresa (desde una ferretería hasta una tienda de ropa).

- **Escalable**: gracias al uso de una API REST sólida, el sistema puede crecer en funciones sin comprometer el rendimiento.

- **Accesibilidad total**: al ser una aplicación web, los dueños de negocio pueden monitorear su stock desde cualquier dispositivo con acceso a internet.

- **Interfaz intuitiva**: diseñada con foco en la experiencia de usuario (UX) para reducir la curva de aprendizaje del personal.


## 2. Instrucciones de instalación

1. Clonar el repositorio de GitHub: `git clone ...`

2. Instala dependencias de frontend:

  - a. Instalar Angular Cli utilizando el siguiente comando: `npm install -g @angular/cli`
  - b. Para evaluar que la instalación haya sido exitosa, utilizar el siguiente comando: `ng version`
  - c. En caso de estar usando Windows, hay que permitir la ejecución de scripts explícitamente. Para eso, introducir lo siguiente: `Set.ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`
  
3. Instala dependencias de backend:

  - a. Crea y activa el entorno virtual. Puedes hacerlo directamente sobre el directorio de tu repositorio local.
  - b. En terminal: `pip install -r requirements.txt`
  - c. Crea la base de datos en MySQL: `nombre_db`
  - d. Crea archivo `.env` y copia el contenido de `.env_modelo` a este archivo.
  - e. Completalo con tus datos para conectarte con tu servidor MySQL.
  - f. En terminal: `python manage.py migrate`
  - g. En terminal: `python manage.py runserver`


## 3. Uso básico

* Backend corre en http://127.0.0.1:8000/

* Api disponible en http://http://127.0.0.1:8000/api/

* Frontend corre en http://localhost:4200/


## 4. Lista de requerimientos

  ### Requerimientos Funcionales (RF)
   Definir 5 Requerimientos Funcionales (RF) que describan las acciones específicas que el usuario podrá realizar en el sistema.

  ### Requerimientos No Funcionales (RNF)
   Definir 3 Requerimientos No Funcionales (RNF) que establezcan las propiedades del sistema.


## 5. Tecnologías utilizadas

* **Frontend:** Angular 
* **Backend:** Python y Django Rest Framework
* **Base de Datos:** MySQL
* **Estilos:** CSS3 y Bootstrap
